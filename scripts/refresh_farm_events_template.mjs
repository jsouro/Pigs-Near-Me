/**
 * Fetches Metro Detroit farm events from official farm websites using JSON-LD
 * structured data, then writes the normalized feed to events.json and
 * public/events.json. Designed to run daily via GitHub Actions.
 *
 * Strategy:
 *   1. Fetch the events page of each known farm source.
 *   2. Extract Event objects from JSON-LD <script> blocks (schema.org standard).
 *   3. Normalize to our FarmEvent shape and filter to the Metro Detroit area.
 *   4. Preserve any manually-curated events whose source isn't in our fetch list.
 *   5. Deduplicate by name+date and write both JSON feed files.
 */

import fs from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------------------
// Farm event sources – pages known to carry JSON-LD Event schema data
// ---------------------------------------------------------------------------
const SOURCES = [
  {
    url: 'https://blakefarms.com/events/',
    sourceLabel: 'Blake Farms',
    defaultLocation: "Blake's Orchard & Cider Mill, Armada, MI",
    farmFilter: false,
  },
  {
    url: 'https://www.mayburyfarm.org/events/',
    sourceLabel: 'Maybury Farm',
    defaultLocation: 'Maybury Farm, 50165 Eight Mile Road, Northville, MI 48167',
    farmFilter: false,
  },
  {
    url: 'https://www.debucksfamilyfarm.com/events/',
    sourceLabel: "DeBuck's Family Farm",
    defaultLocation: "DeBuck's Family Farm, 50240 Martz Road, Belleville, MI 48111",
    farmFilter: false,
  },
  {
    url: 'https://www.uplandhillsfarm.com/events/',
    sourceLabel: 'Upland Hills Farm',
    defaultLocation: 'Upland Hills Farm, 481 Lake George Road, Oxford, MI 48370',
    farmFilter: false,
  },
  {
    url: 'https://www.metroparks.com/events/',
    sourceLabel: 'Metroparks',
    defaultLocation: 'Metro Detroit Metroparks',
    // Only keep events mentioning farm, animal, or agriculture keywords
    farmFilter: true,
  },
]

const METRO_DETROIT_KEYWORDS = [
  'michigan',
  ', mi',
  ' mi ',
  'metro detroit',
  'armada',
  'northville',
  'oxford',
  'belleville',
  'lyon township',
  'ray, mi',
  'novi',
  'south lyon',
  'milford',
  'rochester',
  'macomb',
  'utica',
  'sterling heights',
  'brighton',
  'howell',
]

const FARM_KEYWORDS = [
  'farm',
  'animal',
  'pig',
  'goat',
  'chicken',
  'cow',
  'horse',
  'pony',
  'agritourism',
  'orchard',
  'harvest',
  'hayride',
  'barn',
]

// ---------------------------------------------------------------------------
// JSON-LD helpers
// ---------------------------------------------------------------------------

function extractJsonLdBlocks(html) {
  const pattern =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const results = []
  let match
  while ((match = pattern.exec(html)) !== null) {
    try {
      results.push(JSON.parse(match[1]))
    } catch {
      // malformed block – skip
    }
  }
  return results
}

function collectEventNodes(ldBlocks) {
  const events = []
  for (const block of ldBlocks) {
    const items = block['@graph'] ?? (Array.isArray(block) ? block : [block])
    for (const item of items) {
      if (item['@type'] === 'Event') events.push(item)
    }
  }
  return events
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

function isoToDateString(iso) {
  if (!iso) return ''
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : ''
}

function isoToTimeString(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Detroit',
  })
}

function formatDateRange(startDate, endDate) {
  const start = isoToDateString(startDate)
  if (!start) return ''
  const end = isoToDateString(endDate)
  if (!end || end === start) return start
  return `${start} to ${end}`
}

function formatTimeRange(startDate, endDate) {
  const start = isoToTimeString(startDate)
  if (!start) return ''
  const end = isoToTimeString(endDate)
  if (!end || end === start) return start
  return `${start}–${end}`
}

function extractLocationText(location) {
  if (!location) return ''
  if (typeof location === 'string') return location
  const parts = []
  if (location.name) parts.push(location.name)
  const addr = location.address
  if (addr) {
    if (typeof addr === 'string') {
      parts.push(addr)
    } else {
      if (addr.streetAddress) parts.push(addr.streetAddress)
      if (addr.addressLocality) parts.push(addr.addressLocality)
      if (addr.addressRegion) parts.push(addr.addressRegion)
    }
  }
  return parts.join(', ')
}

function stripHtmlTags(html) {
  return (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeEvent(node, source) {
  const location =
    extractLocationText(node.location) || source.defaultLocation
  const description = stripHtmlTags(node.description ?? '').slice(0, 400)

  return {
    name: (node.name ?? '').trim(),
    date: formatDateRange(node.startDate, node.endDate),
    time: formatTimeRange(node.startDate, node.endDate),
    location,
    description,
    url: node.url ?? source.url,
    sourceType: /** @type {'google'} */ ('google'),
    sourceLabel: source.sourceLabel,
  }
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

function isMetroDetroit(event) {
  const text = `${event.location} ${event.description}`.toLowerCase()
  return METRO_DETROIT_KEYWORDS.some((kw) => text.includes(kw))
}

function isFarmRelated(event) {
  const text = `${event.name} ${event.description}`.toLowerCase()
  return FARM_KEYWORDS.some((kw) => text.includes(kw))
}

function passesFilters(event, source) {
  if (!event.name) return false
  if (source.farmFilter && !isFarmRelated(event)) return false
  // Only apply geo filter when the event has a location to check
  if (event.location && event.location !== source.defaultLocation) {
    if (!isMetroDetroit(event)) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

function dedup(events) {
  const seen = new Set()
  return events.filter((e) => {
    const key = `${e.name.toLowerCase()}|${e.date}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ---------------------------------------------------------------------------
// Fetch & parse one source
// ---------------------------------------------------------------------------

async function fetchSource(source) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent':
          'PigsNearMe/1.0 (+https://jsouro.github.io/Pigs-Near-Me/)',
        Accept: 'text/html',
      },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      console.warn(`  [${source.sourceLabel}] HTTP ${res.status} – skipping`)
      return []
    }
    const html = await res.text()
    const ldBlocks = extractJsonLdBlocks(html)
    const rawNodes = collectEventNodes(ldBlocks)
    const normalized = rawNodes
      .map((node) => normalizeEvent(node, source))
      .filter((e) => passesFilters(e, source))

    console.log(`  [${source.sourceLabel}] ${normalized.length} events found`)
    return normalized
  } catch (err) {
    clearTimeout(timeout)
    console.warn(
      `  [${source.sourceLabel}] fetch error: ${err instanceof Error ? err.message : String(err)}`,
    )
    return []
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const repoEventsPath = path.resolve('events.json')
const publicEventsPath = path.resolve('public', 'events.json')

for (const target of [repoEventsPath, publicEventsPath]) {
  if (!fs.existsSync(target)) {
    console.error('Missing feed file:', target)
    process.exit(1)
  }
}

const existing = JSON.parse(fs.readFileSync(repoEventsPath, 'utf8'))

console.log(`Fetching events from ${SOURCES.length} farm sources...`)
const fetchedArrays = await Promise.all(SOURCES.map(fetchSource))
const fetched = fetchedArrays.flat()

// Preserve manually-curated entries whose sourceLabel isn't in our live sources
const liveLabels = new Set(SOURCES.map((s) => s.sourceLabel))
const preserved = (existing.events ?? []).filter(
  (e) => !liveLabels.has(e.sourceLabel),
)

const merged = dedup([...fetched, ...preserved])

const feed = {
  lastUpdated: new Date().toISOString(),
  refreshNotes: `Auto-refreshed from ${SOURCES.length} farm event pages on ${new Date().toUTCString()}.`,
  events: merged,
}

const json = JSON.stringify(feed, null, 2) + '\n'
fs.writeFileSync(repoEventsPath, json)
fs.writeFileSync(publicEventsPath, json)

console.log(
  `Done. ${merged.length} total events written` +
    ` (${fetched.length} fetched, ${preserved.length} preserved from prior feed).`,
)
