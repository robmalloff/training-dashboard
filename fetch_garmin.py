"""
fetch_garmin.py
Pulls all Garmin Connect activities and rebuilds the RAW array in training_dashboard.jsx
Run locally or via GitHub Actions daily.

Required env vars:
  GARMIN_EMAIL
  GARMIN_PASSWORD

First run: generates tokens saved to .garmin_tokens/
Subsequent runs: uses saved tokens (no password needed for ~6 months)
"""

import os, json, re, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    from garminconnect import Garmin
except ImportError:
    print("Run: pip install garminconnect")
    sys.exit(1)

EMAIL    = os.environ.get("GARMIN_EMAIL", "")
PASSWORD = os.environ.get("GARMIN_PASSWORD", "")
TOKEN_DIR = Path(os.environ.get("GARMIN_TOKEN_DIR", ".garmin_tokens"))
JSX_PATH = Path(__file__).parent / "training_dashboard.jsx"

# ── 1. Login ──────────────────────────────────────────────────────────────────
def get_client():
    TOKEN_DIR.mkdir(exist_ok=True)
    token_files = list(TOKEN_DIR.glob("*.json"))

    if token_files:
        print("Using saved Garmin tokens...")
        try:
            client = Garmin(prompt_mfa=lambda: "")
            client.login(str(TOKEN_DIR))
            print(f"Connected as {EMAIL}")
            return client
        except Exception as e:
            print(f"Token refresh failed: {e}. Re-authenticating...")

    if not EMAIL or not PASSWORD:
        print("ERROR: GARMIN_EMAIL and GARMIN_PASSWORD env vars required for first login")
        sys.exit(1)

    print(f"Logging in as {EMAIL}...")
    client = Garmin(
        email=EMAIL,
        password=PASSWORD,
        prompt_mfa=lambda: input("MFA code: ").strip() if sys.stdin.isatty() else ""
    )
    client.login(str(TOKEN_DIR))
    print("Logged in. Tokens saved.")
    return client

# ── 2. Fetch activities ────────────────────────────────────────────────────────
def fetch_activities(client):
    start = datetime(2026, 1, 1).date()
    end   = datetime.now().date()
    print(f"Fetching activities {start} to {end}...")

    activities = client.get_activities_by_date(
        start.strftime("%Y-%m-%d"),
        end.strftime("%Y-%m-%d"),
    )
    print(f"Found {len(activities)} activities")
    return activities

# ── 3. Map to RAW format ──────────────────────────────────────────────────────
SPORT_MAP = {
    "running":          "Run",
    "trail_running":    "Run",
    "treadmill_running":"Run",
    "walking":          "Run",
    "hiking":           "Run",
    "strength_training":"Strength",
    "fitness_equipment":"Strength",
    "yoga":             "Strength",
    "cycling":          "HIIT",
    "indoor_cycling":   "HIIT",
    "swimming":         "HIIT",
    "other":            "HIIT",
}

RACE_KEYWORDS = ["hyrox","spartan","race","5k","10k","half","marathon","army run","tt","time trial"]

def classify(activity):
    sport = activity.get("activityType", {}).get("typeKey", "other").lower()
    name  = (activity.get("activityName") or "").lower()
    if any(k in name for k in RACE_KEYWORDS):
        return "Race"
    return SPORT_MAP.get(sport, "HIIT")

def to_raw(a):
    # Date
    start_local = a.get("startTimeLocal") or a.get("startTimeGMT", "")
    date = start_local[:10] if start_local else ""

    # Distance in km
    dist = round((a.get("distance") or 0) / 1000, 2)

    # Duration in seconds
    mt = int(a.get("movingDuration") or a.get("duration") or 0)

    # TSS calculation using TRIMP method
    # Max HR: 191, Lactate threshold HR: 168
    # Estimate intensity factor from pace and activity type
    activity_type = classify(a)
    mins = mt / 60 if mt else 0
    dist_km = dist  # already in km

    if activity_type == "Race":
        IF = 1.05
    elif activity_type == "Run" and dist_km > 0 and mins > 0:
        pace = mins / dist_km  # min/km
        if pace < 4.0:    IF = 1.0
        elif pace < 4.3:  IF = 0.93
        elif pace < 4.8:  IF = 0.85
        elif pace < 5.5:  IF = 0.78
        else:             IF = 0.72
    elif activity_type == "HIIT":
        IF = 0.85
    elif activity_type == "Strength":
        IF = 0.65
    else:
        IF = 0.72

    # TSS = (duration_secs * IF^2) / 3600 * 100
    tss = round((mt * IF * IF) / 3600 * 100) if mt else 0

    name = a.get("activityName") or ""

    return {
        "d":    date,
        "dist": dist,
        "mt":   mt,
        "type": classify(a),
        "re":   int(tss),
        "name": name,
    }

# ── 4. Format as JS array ─────────────────────────────────────────────────────
def format_js(activities):
    lines = []
    for a in sorted(activities, key=lambda x: x["d"]):
        if not a["d"]:
            continue
        name_part = f',name:"{a["name"]}"' if a.get("name") else ""
        lines.append(
            f'  {{d:"{a["d"]}",dist:{a["dist"]},mt:{a["mt"]},type:"{a["type"]}",re:{a["re"]}{name_part}}},'
        )
    return "\n".join(lines)

# ── 5. Inject into JSX ────────────────────────────────────────────────────────
def update_jsx(js_array, activity_count, last_date):
    with open(JSX_PATH) as f:
        content = f.read()

    # Replace RAW array
    new_raw = f"const RAW = [\n{js_array}\n];"
    content = re.sub(r"const RAW = \[[\s\S]*?\];", new_raw, content)

    # Update PMC end date
    today = datetime.now().strftime("%Y-%m-%d")
    content = re.sub(
        r'const end = new Date\("[^"]+"\)',
        f'const end = new Date("{today}")',
        content
    )

    # Update display date
    display = datetime.now().strftime("%b %-d, %Y")
    content = re.sub(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d+, 2026', display, content)

    # Update month label
    month = datetime.now().strftime("%b")
    content = re.sub(r'Jan – \w+ 2026', f'Jan – {month} 2026', content)

    # Update activity count
    content = re.sub(r'\d+ activities', f'{activity_count} activities', content)

    with open(JSX_PATH, "w") as f:
        f.write(content)

    print(f"Updated {JSX_PATH.name}: {activity_count} activities through {last_date}")

# ── MAIN ──────────────────────────────────────────────────────────────────────

# ── 6. Also update index.html ─────────────────────────────────────────────────
def update_html(js_array, activity_count, last_date):
    html_path = Path(__file__).parent / "index.html"
    if not html_path.exists():
        print("index.html not found — skipping HTML update")
        return
    with open(html_path) as f:
        content = f.read()

    # Replace RAW array — use a more robust pattern
    new_raw = f"const RAW = [\n{js_array}\n];"
    # Try exact match first
    if "const RAW = [" in content:
        # Find start and end of RAW array
        start_idx = content.find("const RAW = [")
        # Find the matching closing ]; by tracking bracket depth
        i = start_idx + len("const RAW = [")
        depth = 1
        while i < len(content) and depth > 0:
            if content[i] == '[': depth += 1
            elif content[i] == ']': depth -= 1
            i += 1
        # i now points just after the closing ]
        # skip the semicolon
        if i < len(content) and content[i] == ';':
            i += 1
        content = content[:start_idx] + new_raw + content[i:]
        print(f"RAW array replaced: {activity_count} activities")
    else:
        print("WARNING: Could not find RAW array in index.html")
        return

    # Update activity count
    content = re.sub(r'\d+ Garmin activities', f'{activity_count} Garmin activities', content)

    with open(html_path, "w") as f:
        f.write(content)
    print(f"Updated index.html through {last_date}")
if __name__ == "__main__":
    client     = get_client()
    raw_data   = fetch_activities(client)
    activities = [to_raw(a) for a in raw_data if a.get("startTimeLocal","")[:4] == "2026"]
    activities = [a for a in activities if a["d"]]
    js_array   = format_js(activities)
    last_date  = max((a["d"] for a in activities), default="n/a")
    update_jsx(js_array, len(activities), last_date)
    update_html(js_array, len(activities), last_date)
    print("Done.")

