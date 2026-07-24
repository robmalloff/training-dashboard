# Rob Malloff Training Dashboard

Auto-updating training dashboard pulling live Strava data. Rebuilds daily via GitHub Actions at 6am ET.

## Files
- `training_dashboard.jsx` — React dashboard artifact
- `fetch_strava.py` — Strava API pull + JSX updater
- `.github/workflows/update_dashboard.yml` — Daily automation

## Setup (one time, ~30 minutes)

### Step 1 — Create Strava API App
1. Go to https://www.strava.com/settings/api
2. Create an app — name it anything (e.g. "Training Dashboard")
3. Set "Authorization Callback Domain" to `localhost`
4. Copy your **Client ID** and **Client Secret**

### Step 2 — Get your Refresh Token
Open this URL in your browser (replace YOUR_CLIENT_ID):
```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all
```
1. Click Authorize
2. You'll be redirected to a localhost URL — copy the `code=` parameter from the URL
3. Run this in terminal (replace values):
```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_CODE \
  -d grant_type=authorization_code
```
4. Copy the `refresh_token` from the response

### Step 3 — Create GitHub Repo
1. Go to github.com → New repository
2. Name it `training-dashboard` (private recommended)
3. Don't initialize with README

### Step 4 — Push files to GitHub
```bash
cd ~/Downloads/dashboard
git init
git add .
git commit -m "Initial dashboard"
git remote add origin https://github.com/YOUR_USERNAME/training-dashboard.git
git push -u origin main
```

### Step 5 — Add Secrets to GitHub
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add three secrets:
   - `STRAVA_CLIENT_ID` — your client ID number
   - `STRAVA_CLIENT_SECRET` — your client secret
   - `STRAVA_REFRESH_TOKEN` — your refresh token

### Step 6 — Test it
Go to your repo → Actions → "Update Training Dashboard" → Run workflow
Watch it run. If green, check that `training_dashboard.jsx` was updated.

## Using the Dashboard
The JSX file updates daily automatically. To view it:
- Paste contents into Claude as a React artifact anytime
- Or set up GitHub Pages / Vercel for a live URL (optional)

## Manual run locally
```bash
export STRAVA_CLIENT_ID=your_id
export STRAVA_CLIENT_SECRET=your_secret
export STRAVA_REFRESH_TOKEN=your_token
python fetch_strava.py
```
