import { useEffect, useState } from 'react'
import { pigFacts } from './pigFacts'
import type { PigFact } from './pigFacts'
import { pigBreedGallery } from './pigBreedGallery'
import './App.css'

type PigSpot = {
  name: string
  city: string
  vibe: string
  details: string
  tip: string
  link: string
  emoji: string
}

type FarmEvent = {
  name: string
  date: string
  time: string
  location: string
  description: string
  url: string
  sourceType?: 'facebook' | 'google'
  sourceLabel?: string
}

type EventFeed = {
  lastUpdated: string
  refreshNotes?: string
  events: FarmEvent[]
}

const pigSpots: PigSpot[] = [
  {
    name: 'Maybury Farm',
    city: 'Northville',
    vibe: 'Family farm with classic barnyard energy',
    details:
      'A Metro Detroit favorite with pigs, goats, chickens, and seasonal events. Great if you want a relaxed afternoon close to the city.',
    tip: 'Check visiting hours and petting barn access before heading out.',
    link: 'https://mayburyfarm.org/',
    emoji: '🌾',
  },
  {
    name: 'Domino’s Farms Petting Farm',
    city: 'Ann Arbor',
    vibe: 'Easygoing farm stop with lots of animal variety',
    details:
      'Known for kid-friendly animal encounters and a solid chance to spot pigs as part of the farm experience. Worth the short drive from Detroit.',
    tip: 'Spring through fall is usually the best window for a full visit.',
    link: 'https://pettingfarm.com/',
    emoji: '🚜',
  },
  {
    name: 'Upland Hills Farm',
    city: 'Oxford',
    vibe: 'Hands-on petting farm with cozy date-day potential',
    details:
      'A charming option north of Detroit with animal feeding opportunities, pony rides, and a classic small-farm feel.',
    tip: 'Bring cash for feed and confirm whether pigs are in the public animal area that day.',
    link: 'https://www.uplandhillsfarm.com/',
    emoji: '🐄',
  },
]

const navLinks = [
  { href: '#spots', label: 'Pig spots' },
  { href: '#events', label: 'Farm events' },
  { href: '#breeds', label: 'Breeds' },
  { href: '#facts', label: 'Fun facts' },
]

const GALLERY_PREVIEW_COUNT = 8

const mapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

// Date strings look like "2026-05-16" or "2026-04-17 to 2026-05-03"; the
// last ISO date in the string is treated as the event's final day.
function eventEndDate(date: string): Date | null {
  const matches = date.match(/\d{4}-\d{2}-\d{2}/g)
  if (!matches) {
    return null
  }
  const parsed = new Date(`${matches[matches.length - 1]}T23:59:59`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isUpcoming(eventItem: FarmEvent, now: Date): boolean {
  const end = eventEndDate(eventItem.date)
  return end === null || end >= now
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function EventCardSkeleton() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  )
}

function App() {
  const [eventFeed, setEventFeed] = useState<EventFeed | null>(null)
  const [eventError, setEventError] = useState<string | null>(null)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [facts, setFacts] = useState<PigFact[]>(() => shuffle(pigFacts))
  const [showAllBreeds, setShowAllBreeds] = useState(false)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}events.json`)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as EventFeed
        setEventFeed(data)
      } catch (error) {
        setEventError(
          error instanceof Error ? error.message : 'Unable to load events right now.',
        )
      } finally {
        setEventsLoading(false)
      }
    }

    void loadEvents()
  }, [])

  const refreshedLabel = eventFeed?.lastUpdated
    ? new Date(eventFeed.lastUpdated).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : ''

  const now = new Date()
  const upcomingEvents = eventFeed?.events.filter((item) => isUpcoming(item, now)) ?? []
  const endedEvents = eventFeed?.events.filter((item) => !isUpcoming(item, now)) ?? []

  const loadableBreeds = pigBreedGallery.filter((breed) => !brokenImages.has(breed.name))
  const visibleBreeds = showAllBreeds
    ? loadableBreeds
    : loadableBreeds.slice(0, GALLERY_PREVIEW_COUNT)

  const markImageBroken = (name: string) => {
    setBrokenImages((previous) => {
      const next = new Set(previous)
      next.add(name)
      return next
    })
  }

  return (
    <div className="page-shell">
      <div className="backdrop" aria-hidden="true">
        <div className="blob blob-one" />
        <div className="blob blob-two" />
        <div className="blob blob-three" />
      </div>

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            🐷
          </span>
          Pigs Near Me
        </a>
        <nav className="site-nav" aria-label="Sections">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="badge">Made for Kennedy 🩷</p>
          <h1>
            Find the pigs <span className="accent">near you</span>
          </h1>
          <p className="lead">
            A cute little Metro Detroit guide to places where you might meet pigs —
            plus farm events, breeds from around the world, and fun facts for the
            ride there.
          </p>
          <div className="hero-actions">
            <a href="#spots" className="button primary">
              Find pig spots
            </a>
            <a href="#events" className="button secondary">
              Browse farm events
            </a>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>Local farm picks</dt>
              <dd>{pigSpots.length}</dd>
            </div>
            <div>
              <dt>Pig breeds in the gallery</dt>
              <dd>{pigBreedGallery.length}</dd>
            </div>
            <div>
              <dt>Fun facts on shuffle</dt>
              <dd>{pigFacts.length}</dd>
            </div>
          </dl>
        </section>

        <section id="spots" className="section">
          <div className="section-heading">
            <p className="section-kicker">Places to check out</p>
            <h2>Metro Detroit pig-friendly stops</h2>
            <p>
              These are solid starting points for seeing farm animals around the
              Detroit area. Always verify current hours and animal availability
              before visiting.
            </p>
          </div>

          <div className="card-grid">
            {pigSpots.map((spot) => (
              <article className="card spot-card" key={spot.name}>
                <div className="card-topline">
                  <span className="spot-emoji" aria-hidden="true">
                    {spot.emoji}
                  </span>
                  <span className="pill">{spot.city}</span>
                </div>
                <h3>{spot.name}</h3>
                <p className="vibe">{spot.vibe}</p>
                <p>{spot.details}</p>
                <div className="tip-box">
                  <strong>Tip</strong> {spot.tip}
                </div>
                <div className="card-links">
                  <a className="card-link" href={spot.link} target="_blank" rel="noreferrer">
                    Visit website <span aria-hidden="true">→</span>
                  </a>
                  <a
                    className="card-link"
                    href={mapsUrl(`${spot.name}, ${spot.city}, MI`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Directions <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="events" className="section">
          <div className="section-heading">
            <p className="section-kicker">Upcoming farm events</p>
            <h2>Farm event finds for Metro Detroit</h2>
            <p>
              Refreshed from a curated feed that combines public Facebook event
              discovery with official farm event pages.
            </p>
            {refreshedLabel ? (
              <p className="meta-line">
                <span className="dot" aria-hidden="true" /> Last updated {refreshedLabel}
              </p>
            ) : null}
          </div>

          {eventsLoading ? (
            <div className="card-grid">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : null}

          {eventError ? (
            <div className="card notice-card">
              <h3>Event feed unavailable</h3>
              <p>
                The events file could not be loaded right now. Try refreshing the
                page in a moment.
              </p>
            </div>
          ) : null}

          {!eventsLoading && !eventError && eventFeed ? (
            <>
              {upcomingEvents.length > 0 ? (
                <div className="card-grid">
                  {upcomingEvents.map((eventItem) => (
                    <article
                      className="card event-card"
                      key={`${eventItem.name}-${eventItem.date}`}
                    >
                      <div className="card-topline">
                        <span className="date-chip">{eventItem.date}</span>
                        <span className="pill">{eventItem.sourceLabel ?? 'Event link'}</span>
                      </div>
                      <h3>{eventItem.name}</h3>
                      <p className="vibe">{eventItem.time}</p>
                      <p className="event-location">📍 {eventItem.location}</p>
                      <p>{eventItem.description}</p>
                      <div className="card-links">
                        <a
                          className="card-link"
                          href={eventItem.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {eventItem.sourceType === 'google'
                            ? 'Open event page'
                            : 'Open Facebook event'}{' '}
                          <span aria-hidden="true">→</span>
                        </a>
                        <a
                          className="card-link"
                          href={mapsUrl(eventItem.location)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Directions <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="card notice-card">
                  <h3>No upcoming events right now</h3>
                  <p>
                    Everything in the current feed has already wrapped up. Check
                    back after the next refresh — or browse the pig spots above,
                    they’re open year-round.
                  </p>
                </div>
              )}

              {endedEvents.length > 0 ? (
                <details className="ended-events">
                  <summary>Recently ended events ({endedEvents.length})</summary>
                  <div className="card-grid">
                    {endedEvents.map((eventItem) => (
                      <article
                        className="card event-card ended"
                        key={`${eventItem.name}-${eventItem.date}`}
                      >
                        <div className="card-topline">
                          <span className="date-chip">{eventItem.date}</span>
                          <span className="pill ended-pill">Ended</span>
                        </div>
                        <h3>{eventItem.name}</h3>
                        <p className="vibe">{eventItem.time}</p>
                        <p className="event-location">📍 {eventItem.location}</p>
                        <p>{eventItem.description}</p>
                        <a
                          className="card-link"
                          href={eventItem.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {eventItem.sourceType === 'google'
                            ? 'Open event page'
                            : 'Open Facebook event'}{' '}
                          <span aria-hidden="true">→</span>
                        </a>
                      </article>
                    ))}
                  </div>
                </details>
              ) : null}
            </>
          ) : null}
        </section>

        <section id="breeds" className="section">
          <div className="section-heading">
            <p className="section-kicker">Pig breed gallery</p>
            <h2>Pigs of the world, from woolly to spotted</h2>
            <p>
              Photos from Wikimedia Commons of pig breeds across the globe. Any
              photo that fails to load is quietly skipped.
            </p>
          </div>

          {loadableBreeds.length === 0 ? (
            <div className="card notice-card">
              <h3>Gallery photos unavailable</h3>
              <p>
                The breed photos could not be loaded right now. Try refreshing the
                page in a moment.
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {visibleBreeds.map((breed) => (
                <figure className="breed-card" key={breed.name}>
                  <img
                    src={breed.imageUrl}
                    alt={breed.imageAlt}
                    loading="lazy"
                    onError={() => markImageBroken(breed.name)}
                  />
                  <figcaption>
                    <h3>{breed.name}</h3>
                    <p>
                      {breed.origin} · {breed.color}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {loadableBreeds.length > GALLERY_PREVIEW_COUNT ? (
            <div className="gallery-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setShowAllBreeds((previous) => !previous)}
              >
                {showAllBreeds
                  ? 'Show fewer breeds'
                  : `Show all ${loadableBreeds.length} breeds`}
              </button>
            </div>
          ) : null}
        </section>

        <section id="facts" className="section">
          <div className="section-heading">
            <p className="section-kicker">Pig facts</p>
            <h2>Things pigs do that make them even cooler</h2>
            <p>Shuffled every visit — or whenever you want a fresh batch.</p>
            <button type="button" className="button secondary" onClick={() => setFacts(shuffle(pigFacts))}>
              🔀 Shuffle the facts
            </button>
          </div>

          <div className="facts-grid">
            {facts.map((item, index) => (
              <article className="card fact-card" key={item.title}>
                <span className="fact-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{item.title}</h3>
                <p>{item.fact}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Made with 🩷 for Kennedy · Pig facts adapted from Wikipedia · Photos from
          Wikimedia Commons
        </p>
      </footer>
    </div>
  )
}

export default App
