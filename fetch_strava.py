"""
fetch_strava.py
Pulls all Strava activities and rebuilds the RAW array in training_dashboard.jsx
Run locally or via GitHub Actions daily.

Required env vars:
  STRAVA_CLIENT_ID
  STRAVA_CLIENT_SECRET
  STRAVA_REFRESH_TOKEN
"""

import os, json, requests, re
from datetime import datetime, timezone

CLIENT_ID     = os.environ["STRAVA_CLIENT_ID"]
CLIENT_SECRET = os.environ["STRAVA_CLIENT_SECRET"]
REFRESH_TOKEN = os.environ["STRAVA_REFRESH_TOKEN"]

# ── 1. Refresh access token ────────────────────────────────────────────────────
def get_access_token():
    r = requests.post("https://www.strava.com/oauth/token", data={
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
        "grant_type":    "refresh_token",
    })
    r.raise_for_status()
    data = r.json()
    print(f"Token refreshed. Athlete: {data.get('athlete', {}).get('firstname', 'Rob')}")
    return data["access_token"]

# ── 2. Pull all activities since Jan 1 2026 ────────────────────────────────────
def fetch_activities(token):
    headers = {"Authorization": f"Bearer {token}"}
    after   = int(datetime(2026, 1, 1, tzinfo=timezone.utc).timestamp())
    page, activities = 1, []
    while True:
        r = requests.get(
            "https://www.strava.com/api/v3/athlete/activities",
            headers=headers,
            params={"after": after, "per_page": 100, "page": page}
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        activities.extend(batch)
        page += 1
        print(f"  Fetched page {page-1}: {len(batch)} activities")
    print(f"Total activities: {len(activities)}")
    return activities

# ── 3. Map to RAW format ───────────────────────────────────────────────────────
SPORT_MAP = {
    "Run":                      "Run",
    "TrailRun":                 "Run",
    "VirtualRun":               "Run",
    "Hike":                     "Run",   # count toward volume
    "Walk":                     "Run",
    "WeightTraining":           "Strength",
    "Workout":                  "HIIT",
    "HighIntensityIntervalTraining": "HIIT",
    "Yoga":                     "Strength",
    "Crossfit":                 "HIIT",
}

RACE_NAMES = ["hyrox", "spartan", "race", "5k", "10k", "half", "marathon", "army run", "tt"]

def classify(activity):
    sport = SPORT_MAP.get(activity.get("sport_type",""), "HIIT")
    name  = activity.get("name","").lower()
    if any(r in name for r in RACE_NAMES):
        return "Race"
    return sport

def to_raw(a):
    dt   = a.get("start_date_local","")[:10]
    dist = round(a.get("distance", 0) / 1000, 2)
    mt   = a.get("moving_time", 0)
    re_  = a.get("suffer_score") or a.get("relative_effort") or 0
    # Fallback TSS estimate if no relative effort
    if not re_ and mt:
        re_ = round(mt / 60 * 0.5)
    return {
        "d":    dt,
        "dist": dist,
        "mt":   mt,
        "type": classify(a),
        "re":   int(re_),
        "name": a.get("name",""),
    }

# ── 4. Format as JS array ──────────────────────────────────────────────────────
def format_js(activities):
    lines = []
    for a in sorted(activities, key=lambda x: x["d"]):
        name_part = f',name:"{a["name"]}"' if a.get("name") else ""
        lines.append(
            f'  {{d:"{a["d"]}",dist:{a["dist"]},mt:{a["mt"]},type:"{a["type"]}",re:{a["re"]}{name_part}}},'
        )
    return "\n".join(lines)

# ── 5. Inject into JSX ────────────────────────────────────────────────────────
def update_jsx(jsx_path, js_array, activity_count, last_date):
    with open(jsx_path) as f:
        content = f.read()

    # Replace RAW array contents
    new_raw = f"const RAW = [\n{js_array}\n];"
    content = re.sub(r"const RAW = \[[\s\S]*?\];", new_raw, content)

    # Update PMC end date to today
    today = datetime.now().strftime("%Y-%m-%d")
    content = re.sub(
        r'const end = new Date\("[^"]+"\)',
        f'const end = new Date("{today}")',
        content
    )

    # Update display date
    display = datetime.now().strftime("%b %-d, %Y")
    content = re.sub(
        r'(Updated|Season data)[^<"]*',
        lambda m: m.group(0),
        content
    )
    content = re.sub(r'Jul \d+, 2026', display, content)
    content = re.sub(r'Jan – \w+ 2026', f'Jan – {datetime.now().strftime("%b")} 2026', content)

    # Update activity count in footer
    content = re.sub(r'\d+ activities', f'{activity_count} activities', content)

    with open(jsx_path, "w") as f:
        f.write(content)

    print(f"Updated {jsx_path}: {activity_count} activities through {last_date}")

# ── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    token      = get_access_token()
    raw_data   = fetch_activities(token)
    activities = [to_raw(a) for a in raw_data]
    js_array   = format_js(activities)
    last_date  = max(a["d"] for a in activities) if activities else "n/a"

    jsx_path = os.path.join(os.path.dirname(__file__), "training_dashboard.jsx")
    update_jsx(jsx_path, js_array, len(activities), last_date)
    print("Done.")
