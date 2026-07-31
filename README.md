# Rob Malloff Training Dashboard

Auto-updating training dashboard pulling live Garmin Connect data.
Rebuilds daily via GitHub Actions at 6am ET.

## Files
- `training_dashboard.jsx` — React dashboard artifact
- `fetch_garmin.py` — Garmin Connect pull + JSX updater
- `.github/workflows/update_dashboard.yml` — Daily automation

## Setup (one time, ~10 minutes)

### Step 1 — Add GitHub Secrets
Go to your repo → Settings → Secrets and variables → Actions

Add two secrets:
- `GARMIN_EMAIL` — your Garmin Connect email
- `GARMIN_PASSWORD` — your Garmin Connect password

### Step 2 — First run (generates auth tokens)
Go to Actions → Update Training Dashboard → Run workflow

The first run logs in with your credentials and saves tokens to cache.
Subsequent runs use cached tokens — password only needed if cache expires (~6 months).

### Step 3 — Verify
Check that training_dashboard.jsx was updated in the repo after the action completes.

## Viewing the Dashboard
Paste the contents of training_dashboard.jsx into Claude as a React artifact anytime.

## Manual local run
```bash
source ~/garmin_venv/bin/activate
export GARMIN_EMAIL=your@email.com
export GARMIN_PASSWORD=yourpassword
export GARMIN_TOKEN_DIR=~/.garminconnect
python fetch_garmin.py
```
