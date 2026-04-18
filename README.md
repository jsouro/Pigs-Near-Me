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

- Metro Detroit farm outing suggestions
- Refresh-randomized pig facts
- World pig breed gallery with working photos only
- Metro Detroit farm events section
- Event source labels and source links

## Farm event refresh workflow

The site is prepared for a once-daily refresh workflow that can check public Facebook events and official farm websites, then update `src/pigEvents.ts`.

### Files involved

- `src/pigEvents.ts`
  - stores the event list
  - stores `eventFeedMeta`, including refresh strategy and timestamp
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
   - `host`
   - `city`
   - `category`
   - `source`
   - `sourceLabel`
   - `sourceLink`
   - `nextDate` or recurring timing
   - `description`
   - `link`
4. Update `eventFeedMeta.refreshedAt`.
5. Commit and push the refreshed file.

### Notes

- There is no clean free anonymous Facebook events API for the general feed.
- The intended model here is a maintained once-daily refresh, not a direct live feed.
- For production quality, consider moving event data into a JSON file that your refresh job rewrites directly.
