import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { pigFacts as fallbackPigFacts, type PigFact } from './pigFacts'
import { pigBreedGallery } from './pigBreedGallery'
import { eventFeedMeta, getUpcomingEvents } from './pigEvents'

type PigSpot = {
  name: string
  city: string
  vibe: string
  details: string
  tip: string
  link: string
}

const pigSpots: PigSpot[] = [
  {
    name: 'Maybury Farm',
    city: 'Northville',
    vibe: 'Family farm with classic barnyard energy',
    details:
      'A Metro Detroit favorite with pigs, goats, chickens, and seasonal events, with public admission days and a full barnyard feel.',
    tip: 'Check the farm calendar before you go, since weather and seasonal programming can affect hours.',
    link: 'https://mayburyfarm.org/',
  },
  {
    name: 'Upland Hills Farm',
    city: 'Oxford',
    vibe: 'Hands-on farm with a cozy day-trip vibe',
    details:
      'Known for public farm days, animal encounters, and a classic small-farm atmosphere that works well for a cute date outing.',
    tip: 'Their public access is more limited than some farms, so verify the exact open dates first.',
    link: 'https://www.uplandhillsfarm.com/',
  },
  {
    name: 'DeBuck’s Family Farm',
    city: 'Belleville',
    vibe: 'Larger attraction-style farm with lots to do',
    details:
      'A family entertainment farm in the Metro Detroit area with attractions, seasonal events, and farm-animal appeal for a bigger outing.',
    tip: 'Best if you want a fuller activity day, not just a quick pig stop.',
    link: 'https://www.debucksfamilyfarm.com/',
  },
  {
    name: 'Domino’s Farms Petting Farm',
    city: 'Ann Arbor',
    vibe: 'Classic petting farm close enough for a nice drive',
    details:
      'A longtime Ann Arbor-area animal destination that is worth checking for pig sightings and other farm-animal experiences.',
    tip: 'Confirm the current site or social updates before heading out, since online info can be inconsistent.',
    link: 'https://pettingfarm.com/',
  },
  {
    name: 'Detroit Zoo',
    city: 'Royal Oak',
    vibe: 'Not a farm, but still a solid animal day out nearby',
    details:
      'Included as a bonus local animal destination if you want a polished outing in the Metro Detroit area, even though it is not a pig-petting farm.',
    tip: 'Treat this one as an alternate animal date option, not a guaranteed pig stop.',
    link: 'https://detroitzoo.org/',
  },
]

const factsUrl = 'https://raw.githubusercontent.com/jsouro/Pigs-Near-Me/main/src/pigFacts.ts'

function shuffleFacts<T>(items: T[]) {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

function App() {
  const [pigFacts, setPigFacts] = useState<PigFact[]>(fallbackPigFacts)
  const [factsStatus, setFactsStatus] = useState<'loading' | 'live' | 'fallback'>(
    'loading',
  )
  const [breedQuery, setBreedQuery] = useState('')
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadFacts = async () => {
      try {
        const response = await fetch(factsUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch facts: ${response.status}`)
        }

        const text = await response.text()
        const matches = [...text.matchAll(/title:\s*'([^']+)'[\s\S]*?fact:\s*'([^']+)'/g)]
        const parsedFacts = matches.map((match) => ({
          title: match[1],
          fact: match[2],
        }))

        if (parsedFacts.length === 0) {
          throw new Error('No facts parsed from source')
        }

        setPigFacts(shuffleFacts(parsedFacts))
        setFactsStatus('live')
      } catch {
        setPigFacts(shuffleFacts(fallbackPigFacts))
        setFactsStatus('fallback')
      }
    }

    void loadFacts()
  }, [])

  const featuredFacts = useMemo(() => pigFacts.slice(0, 6), [pigFacts])

  const filteredBreeds = useMemo(() => {
    const breedsWithPhotos = pigBreedGallery.filter(
      (breed) => !brokenImages.has(breed.name),
    )
    const query = breedQuery.trim().toLowerCase()
    if (!query) return breedsWithPhotos
    return breedsWithPhotos.filter((breed) =>
      [breed.name, breed.origin, breed.color].some((field) =>
        field.toLowerCase().includes(query),
      ),
    )
  }, [breedQuery, brokenImages])

  const upcomingEvents = useMemo(() => getUpcomingEvents(), [])

  const handleImageError = (name: string) => {
    setBrokenImages((prev) => {
      if (prev.has(name)) return prev
      const next = new Set(prev)
      next.add(name)
      return next
    })
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">For Kennedy 🐷</p>
          <h1>Pigs Near Me</h1>
          <p className="lead">
            A cute little Metro Detroit guide to places where you might meet pigs,
            plus fun facts for the ride there.
          </p>
          <div className="hero-actions">
            <a href="#spots" className="button primary">
              Find pig spots
            </a>
            <a href="#events" className="button secondary">
              See events
            </a>
            <a href="#facts" className="button secondary">
              Read fun facts
            </a>
            <a href="#breeds" className="button secondary">
              Browse breeds
            </a>
          </div>
        </div>
        <div className="hero-card">
          <h2>Pink, playful, and practical</h2>
          <p>
            Built as a sweet one-page date idea site with local suggestions near
            Detroit and easy, fast browsing on a phone.
          </p>
          <ul>
            <li>Expanded Metro Detroit animal stops</li>
            <li>Live-linked farm websites for planning</li>
            <li>Dynamic facts and breed gallery behavior</li>
          </ul>
        </div>
      </header>

      <main>
        <section id="spots" className="section">
          <div className="section-heading">
            <p className="section-kicker">Places to check out</p>
            <h2>Publicly visitable pig-friendly stops around Metro Detroit</h2>
            <p>
              I kept this focused on places that are realistically visitable for a
              day out. Always verify current hours, seasonal access, and whether
              pigs are part of the public-facing animal areas before you go.
            </p>
          </div>

          <div className="card-grid">
            {pigSpots.map((spot) => (
              <article className="info-card" key={spot.name}>
                <div className="card-topline">
                  <span>{spot.city}</span>
                  <span className="pill">Pig stop</span>
                </div>
                <h3>{spot.name}</h3>
                <p className="vibe">{spot.vibe}</p>
                <p>{spot.details}</p>
                <div className="tip-box">
                  <strong>Tip:</strong> {spot.tip}
                </div>
                <a href={spot.link} target="_blank" rel="noreferrer">
                  Visit website
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="events" className="section">
          <div className="section-heading">
            <p className="section-kicker">Upcoming events</p>
            <h2>Farm events around Metro Detroit</h2>
            <p>
              County fairs, open farm days, harvest festivals, and other Metro
              Detroit farm events. Past dates drop off automatically, and
              recurring events roll forward to the next occurrence. Always
              confirm exact dates on each event&rsquo;s site before heading out.
            </p>
            <p className="events-note">
              Facebook note: there is no reliable free anonymous general Facebook
              events API I can safely plug in here, so this section is prepared
              for a once-daily Facebook-plus-website refresh workflow instead of
              brittle scraping.
            </p>
            <div className="events-meta-box">
              <p>
                <strong>Refresh strategy:</strong> {eventFeedMeta.strategy}
              </p>
              <p>
                <strong>Coverage:</strong> {eventFeedMeta.coverage}
              </p>
              <p>
                <strong>Last prepared update:</strong>{' '}
                {new Date(eventFeedMeta.refreshedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {upcomingEvents.length === 0 ? (
            <article className="info-card">
              <h3>No farm events currently listed</h3>
              <p>
                Check back soon, this feed is set up to support a broader Metro
                Detroit farm-event refresh workflow.
              </p>
            </article>
          ) : (
            <div className="card-grid">
              {upcomingEvents.map((event) => (
                <article className="info-card" key={event.name}>
                  <div className="card-topline">
                    <span>{event.city}</span>
                    <span className="pill">{event.category}</span>
                  </div>
                  <h3>{event.name}</h3>
                  <p className="vibe">{event.host}</p>
                  <p className="event-date">
                    <strong>When:</strong>{' '}
                    {event.nextDate
                      ? new Date(`${event.nextDate}T00:00:00`).toLocaleDateString(
                          undefined,
                          { year: 'numeric', month: 'long', day: 'numeric' },
                        )
                      : event.recurringLabel ?? 'Recurring annually'}
                  </p>
                  <p>{event.description}</p>
                  <p className="event-source">
                    <strong>Source:</strong> {event.sourceLabel ?? event.source}
                  </p>
                  {event.sourceLink ? (
                    <p className="event-source-link">
                      <a href={event.sourceLink} target="_blank" rel="noreferrer">
                        View source link
                      </a>
                    </p>
                  ) : null}
                  <a href={event.link} target="_blank" rel="noreferrer">
                    Visit website
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="facts" className="section alt-section">
          <div className="section-heading narrow">
            <p className="section-kicker">Pig facts</p>
            <h2>Different pig facts every time you refresh</h2>
            <p className="facts-source-line">
              {factsStatus === 'live'
                ? 'Facts are loaded from the live source file and shuffled on each refresh.'
                : factsStatus === 'loading'
                  ? 'Loading pig facts...'
                  : 'Using fallback pig facts while the live source catches up.'}
            </p>
            <p className="facts-source-note">
              Source inspiration:{' '}
              <a href="https://en.wikipedia.org/wiki/Pig" target="_blank" rel="noreferrer">
                Wikipedia pig article
              </a>
            </p>
          </div>

          <div className="facts-grid">
            {featuredFacts.map((item) => (
              <article className="fact-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.fact}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="breeds" className="section alt-section">
          <div className="section-heading">
            <p className="section-kicker">Pig breeds</p>
            <h2>World pig breed gallery</h2>
            <p>
              A broader global list of pig breeds &mdash; browse the gallery or
              use the search to filter by name, country, or color. Photos come
              from Wikimedia Commons when available.
            </p>
            <input
              type="search"
              className="breed-search"
              value={breedQuery}
              onChange={(e) => setBreedQuery(e.target.value)}
              placeholder="Search breeds by name, origin, or color…"
              aria-label="Search pig breeds"
            />
          </div>

          {filteredBreeds.length === 0 ? (
            <p className="breed-empty">
              {breedQuery
                ? `No photographed breeds match “${breedQuery}”. Try a different search.`
                : 'No photographed breeds are available right now.'}
            </p>
          ) : (
            <div className="breed-gallery-grid">
              {filteredBreeds.map((breed) => (
                <article className="breed-gallery-card" key={breed.name}>
                  <img
                    src={breed.imageUrl}
                    alt={breed.imageAlt}
                    loading="lazy"
                    onError={() => handleImageError(breed.name)}
                  />
                  <div className="breed-gallery-copy">
                    <h3>{breed.name}</h3>
                    <p>
                      <strong>Origin:</strong> {breed.origin}
                    </p>
                    <p>
                      <strong>Color:</strong> {breed.color}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section closing-note">
          <div>
            <p className="section-kicker">Before you go</p>
            <h2>Make it a fun day trip</h2>
            <p>
              Call ahead, wear shoes you do not mind getting dusty, and take a
              few photos. The best farm dates are the ones where you leave with a
              little mud on your shoes and a better story than you expected.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
