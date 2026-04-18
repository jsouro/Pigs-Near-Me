export type PigEventCategory =
  | 'Fair'
  | 'Farm event'
  | '4-H'
  | 'Open day'
  | 'Festival'
  | 'Market'

export type PigEvent = {
  name: string
  host: string
  city: string
  category: PigEventCategory
  source: 'website' | 'facebook-check' | 'manual-refresh'
  nextDate?: string
  recurringMonth?: number
  recurringLabel?: string
  description: string
  link: string
}

// Metro Detroit farm events, broader than pig-only activities.
// These are intentionally structured so a daily refresh workflow can replace
// dates or add entries without rewriting the page logic.
export const pigEvents: PigEvent[] = [
  {
    name: 'Oakland County Fair',
    host: 'Oakland County 4-H Fair Association',
    city: 'Davisburg, MI',
    category: 'Fair',
    source: 'website',
    recurringMonth: 7,
    recurringLabel: 'Early July, annually',
    description:
      'A major Metro Detroit county fair with livestock shows, barns, midway attractions, and broad family farm energy.',
    link: 'https://www.oakfair.org/',
  },
  {
    name: 'Armada Fair',
    host: 'Armada Agricultural Society',
    city: 'Armada, MI',
    category: 'Fair',
    source: 'website',
    recurringMonth: 8,
    recurringLabel: 'Mid-August, annually',
    description:
      'A longstanding Macomb County agricultural fair with livestock, exhibits, rides, and classic small-town farm culture.',
    link: 'https://www.armadafair.org/',
  },
  {
    name: 'Michigan State Fair',
    host: 'Michigan State Fair LLC',
    city: 'Novi, MI',
    category: 'Fair',
    source: 'website',
    recurringMonth: 8,
    recurringLabel: 'Labor Day weekend',
    description:
      'The revived state fair in Novi with agriculture programming, livestock competitions, food, and family activities.',
    link: 'https://www.michiganstatefairllc.com/',
  },
  {
    name: 'Maybury Farm Harvest Festival',
    host: 'Maybury Farm',
    city: 'Northville, MI',
    category: 'Festival',
    source: 'website',
    recurringMonth: 10,
    recurringLabel: 'Weekends in October',
    description:
      'A fall farm festival with hayrides, a corn maze, barnyard animals, and one of the best easy farm outings near Detroit.',
    link: 'https://mayburyfarm.org/',
  },
  {
    name: 'Maybury Farm Maple Syrup Day',
    host: 'Maybury Farm',
    city: 'Northville, MI',
    category: 'Farm event',
    source: 'website',
    recurringMonth: 3,
    recurringLabel: 'A Saturday in March',
    description:
      'Maple syrup demonstrations, pancakes, and barnyard visits in a more seasonal educational farm setting.',
    link: 'https://mayburyfarm.org/',
  },
  {
    name: 'Upland Hills Farm Public Days',
    host: 'Upland Hills Farm',
    city: 'Oxford, MI',
    category: 'Open day',
    source: 'website',
    recurringMonth: 5,
    recurringLabel: 'Select weekends, spring through fall',
    description:
      'Public access days with animal encounters, farm scenery, and a quieter small-farm experience.',
    link: 'https://www.uplandhillsfarm.com/',
  },
  {
    name: "DeBuck's Fall Harvest Festival",
    host: "DeBuck's Family Farm",
    city: 'Belleville, MI',
    category: 'Festival',
    source: 'website',
    recurringMonth: 9,
    recurringLabel: 'September through October',
    description:
      'A large seasonal farm attraction with a pumpkin patch, corn maze, rides, animal encounters, and lots of foot traffic.',
    link: 'https://www.debucksfamilyfarm.com/',
  },
  {
    name: "Domino's Farms Petting Farm Open Season",
    host: "Domino's Farms Petting Farm",
    city: 'Ann Arbor, MI',
    category: 'Open day',
    source: 'website',
    recurringMonth: 4,
    recurringLabel: 'Open seasonally April through October',
    description:
      'A longtime animal outing destination with a broad farmyard feel and a short drive from Metro Detroit.',
    link: 'https://pettingfarm.com/',
  },
  {
    name: 'Eastern Market Flower Day',
    host: 'Eastern Market',
    city: 'Detroit, MI',
    category: 'Market',
    source: 'manual-refresh',
    recurringMonth: 5,
    recurringLabel: 'One major Sunday in May',
    description:
      'A huge Detroit seasonal event with growers, plants, crowds, and a strong farm-and-market energy even though it is not a livestock event.',
    link: 'https://easternmarket.org/',
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
