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

    # Relative effort / TSS estimate
    # Use aerobicTrainingEffect * 20 as a TSS proxy if no direct TSS
    tss = a.get("trainingStressScore") or 0
    if not tss:
        aerobic_te = a.get("aerobicTrainingEffect") or 0
        anaerobic_te = a.get("anaerobicTrainingEffect") or 0
        te = max(aerobic_te, anaerobic_te)
        tss = round(mt / 60 * te * 3) if te and mt else round(mt / 60 * 0.5)

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
if __name__ == "__main__":
    client     = get_client()
    raw_data   = fetch_activities(client)
    activities = [to_raw(a) for a in raw_data if a.get("startTimeLocal","")[:4] == "2026"]
    activities = [a for a in activities if a["d"]]
    js_array   = format_js(activities)
    last_date  = max((a["d"] for a in activities), default="n/a")
    update_jsx(js_array, len(activities), last_date)
    print("Done.")
