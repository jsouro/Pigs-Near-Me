export type PigEventCategory = 'Fair' | 'Farm event' | '4-H' | 'Open day'

export type PigEvent = {
  name: string
  host: string
  city: string
  category: PigEventCategory
  // Exactly one of these two should be set:
  nextDate?: string // ISO 'YYYY-MM-DD' for known upcoming or one-off events
  recurringMonth?: number // 1-12 for annual recurring events whose exact date varies
  recurringLabel?: string // human-friendly label for recurring entries
  description: string
  link: string
}

// Metro Detroit area events that feature pigs (county fair swine shows,
// seasonal farm events, 4-H livestock shows, and farm open days). Dates are
// intentionally stored as either a specific `nextDate` or as a recurring month
// so the list stays self-maintaining — past entries drop off automatically.
export const pigEvents: PigEvent[] = [
  {
    name: 'Oakland County Fair',
    host: 'Oakland County 4-H Fair Association',
    city: 'Davisburg, MI',
    category: 'Fair',
    recurringMonth: 7,
    recurringLabel: 'Early July, annually',
    description:
      'A classic county fair with a 4-H swine show, barns full of market hogs, and plenty of family-friendly farm activities.',
    link: 'https://www.oakfair.org/',
  },
  {
    name: 'Armada Fair',
    host: 'Armada Agricultural Society',
    city: 'Armada, MI',
    category: 'Fair',
    recurringMonth: 8,
    recurringLabel: 'Mid-August, annually',
    description:
      'Longstanding Macomb County fair with livestock shows including swine, plus midway rides and a rural-town vibe.',
    link: 'https://www.armadafair.org/',
  },
  {
    name: 'Michigan State Fair',
    host: 'Michigan State Fair LLC',
    city: 'Novi, MI',
    category: 'Fair',
    recurringMonth: 8,
    recurringLabel: 'Labor Day weekend',
    description:
      'The revived state fair at Suburban Collection Showplace with 4-H livestock competitions, including swine showmanship.',
    link: 'https://www.michiganstatefairllc.com/',
  },
  {
    name: 'Maybury Farm Harvest Festival',
    host: 'Maybury Farm',
    city: 'Northville, MI',
    category: 'Farm event',
    recurringMonth: 10,
    recurringLabel: 'Weekends in October',
    description:
      'Fall festival with pig visits, hayrides, and a corn maze at a Metro Detroit farm regulars love.',
    link: 'https://mayburyfarm.org/',
  },
  {
    name: 'Maybury Farm Maple Syrup Day',
    host: 'Maybury Farm',
    city: 'Northville, MI',
    category: 'Farm event',
    recurringMonth: 3,
    recurringLabel: 'A Saturday in March',
    description:
      'Watch maple sap get boiled down, meet barnyard animals including the pigs, and enjoy pancakes.',
    link: 'https://mayburyfarm.org/',
  },
  {
    name: 'Upland Hills Farm Public Days',
    host: 'Upland Hills Farm',
    city: 'Oxford, MI',
    category: 'Open day',
    recurringMonth: 5,
    recurringLabel: 'Select weekends, spring through fall',
    description:
      'Scheduled public days with hands-on animal encounters — a cozy day-trip farm with classic small-farm charm.',
    link: 'https://www.uplandhillsfarm.com/',
  },
  {
    name: "DeBuck's Fall Harvest Festival",
    host: "DeBuck's Family Farm",
    city: 'Belleville, MI',
    category: 'Farm event',
    recurringMonth: 9,
    recurringLabel: 'September through October',
    description:
      'Large-scale fall attraction with pig races, a corn maze, a pumpkin patch, and farm-animal encounters.',
    link: 'https://www.debucksfamilyfarm.com/',
  },
  {
    name: "Domino's Farms Petting Farm Open Season",
    host: "Domino's Farms Petting Farm",
    city: 'Ann Arbor, MI',
    category: 'Open day',
    recurringMonth: 4,
    recurringLabel: 'Open seasonally April through October',
    description:
      'A long-running petting farm a short drive from Detroit with pigs, goats, and other farmyard animals.',
    link: 'https://pettingfarm.com/',
  },
]

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate()

type ProjectedEvent = PigEvent & { projectedDate: Date }

export function getUpcomingEvents(now: Date = new Date()): PigEvent[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const projected: ProjectedEvent[] = []

  for (const event of pigEvents) {
    if (event.nextDate) {
      const parsed = new Date(`${event.nextDate}T00:00:00`)
      if (parsed >= today) {
        projected.push({ ...event, projectedDate: parsed })
      }
      continue
    }

    if (event.recurringMonth) {
      let year = today.getFullYear()
      const lastDay = daysInMonth(year, event.recurringMonth)
      let candidate = new Date(year, event.recurringMonth - 1, lastDay)
      if (candidate < today) {
        year += 1
        candidate = new Date(
          year,
          event.recurringMonth - 1,
          daysInMonth(year, event.recurringMonth),
        )
      }
      projected.push({ ...event, projectedDate: candidate })
    }
  }

  projected.sort((a, b) => a.projectedDate.getTime() - b.projectedDate.getTime())

  return projected.map(({ projectedDate, ...rest }) => {
    void projectedDate
    return rest
  })
}
