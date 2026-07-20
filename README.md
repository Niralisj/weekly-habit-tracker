# Placement Mode

A weekly tracker for the routine: morning DSA, college, gym, evening DSA, and the weekend
build/project blocks. Netflix-themed. No backend, no API keys, no cost — everything is
saved in your browser via localStorage.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Deploy on Vercel

1. Push this folder to a GitHub repo (or drag-and-drop the folder into Vercel's dashboard).
2. On [vercel.com](https://vercel.com), click **Add New → Project**, import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` —
   Vercel usually detects these automatically.
4. Deploy. That's it — no environment variables needed.

## Editing the schedule

Everything about the routine lives in `src/scheduleData.js`:
- `SCHEDULE` — the tasks per day (label, time, tag, and whether it's `critical` — critical
  tasks are the ones that count toward the DSA streak).
- `NOTES_TO_SELF` — the static reminder lines at the bottom of the page.

Change these any time your routine changes; the rest of the app adapts automatically.

## How data is stored

Everything is saved under one localStorage key (`placement-tracker-data-v1`) as
`{ "2026-07-20": { "morning-dsa": true, ... }, ... }`. Nothing leaves your browser —
if you clear site data or switch browsers/devices, the history resets.
