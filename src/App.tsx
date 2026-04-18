import './App.css'

type PigSpot = {
  name: string
  city: string
  vibe: string
  details: string
  tip: string
  link: string
}

type PigFact = {
  title: string
  fact: string
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
  },
  {
    name: 'Domino’s Farms Petting Farm',
    city: 'Ann Arbor',
    vibe: 'Easygoing farm stop with lots of animal variety',
    details:
      'Known for kid-friendly animal encounters and a solid chance to spot pigs as part of the farm experience. Worth the short drive from Detroit.',
    tip: 'Spring through fall is usually the best window for a full visit.',
    link: 'https://pettingfarm.com/',
  },
  {
    name: 'Upland Hills Farm',
    city: 'Oxford',
    vibe: 'Hands-on petting farm with cozy date-day potential',
    details:
      'A charming option north of Detroit with animal feeding opportunities, pony rides, and a classic small-farm feel.',
    tip: 'Bring cash for feed and confirm whether pigs are in the public animal area that day.',
    link: 'https://www.uplandhillsfarm.com/',
  },
]

const pigFacts: PigFact[] = [
  {
    title: 'Pigs are extremely smart',
    fact: 'They can learn routines, solve simple puzzles, and even recognize patterns faster than many people expect.',
  },
  {
    title: 'They love social time',
    fact: 'Pigs build strong bonds, communicate constantly, and prefer being around other pigs or trusted humans.',
  },
  {
    title: 'Mud helps, not hurts',
    fact: 'Pigs roll in mud to cool off and protect their skin because they do not sweat the way humans do.',
  },
  {
    title: 'They are naturally curious',
    fact: 'A pig will often inspect new spaces with its nose first, treating the world like one giant investigation.',
  },
]

function App() {
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
            <a href="#facts" className="button secondary">
              Read fun facts
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
            <li>Metro Detroit farm suggestions</li>
            <li>Short notes for planning a visit</li>
            <li>Fun pig facts to make it memorable</li>
          </ul>
        </div>
      </header>

      <main>
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

        <section id="facts" className="section alt-section">
          <div className="section-heading narrow">
            <p className="section-kicker">Pig facts</p>
            <h2>Things pigs do that make them even cooler</h2>
          </div>

          <div className="facts-grid">
            {pigFacts.map((item) => (
              <article className="fact-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.fact}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section closing-note">
          <div>
            <p className="section-kicker">Before you go</p>
            <h2>Make it a fun day trip</h2>
            <p>
              Call ahead, wear shoes you do not mind getting dusty, and bring a
              few photos home. Pigs are somehow both adorable and hilarious in
              person.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
