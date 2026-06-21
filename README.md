# Pigs Near Me

A pink, playful Metro Detroit farm outing site built for Kennedy.

Live site:
- https://jsouro.github.io/Pigs-Near-Me/

## Stack

- React
- TypeScript
- Vite
- GitHub Pages

## Current features

- 12 Metro Detroit farms with pigs confirmed on site (see `src/pigSpots.ts`), each with a pig note, tip, website, and directions link
- Refresh-randomized pig facts with a shuffle button
- World pig breed photo gallery (broken photos are skipped automatically)
- Metro Detroit farm events section with loading and error states
- Event source labels and source links
- Truffle Trot: a tap-to-jump pig runner mini game with a saved best score

## Farm event refresh workflow

The site is prepared for a once-daily refresh workflow that can check public Facebook events and official farm websites, then update the JSON event feed.

### Files involved

- `events.json` and `public/events.json`
  - store the event list plus `lastUpdated` and `refreshNotes`
  - `public/events.json` is what the deployed site fetches
- `scripts/refresh_farm_events_template.mjs`
  - scaffold for your future cron-driven refresh logic

### Run the scaffold

```bash
npm run refresh:farm-events
```

### What your cron job should eventually do

1. Open public Facebook event listings and official farm websites.
2. Find Metro Detroit farm events.
3. Add missing events with:
   - `name`
   - `date`
   - `time`
   - `location`
   - `description`
   - `url`
   - `sourceType` (`facebook` | `google`)
   - `sourceLabel`
4. Update `lastUpdated` (and `refreshNotes` if useful).
5. Commit and push the refreshed files.

### Notes

- There is no clean free anonymous Facebook events API for the general feed.
- The intended model here is a maintained once-daily refresh, not a direct live feed.
