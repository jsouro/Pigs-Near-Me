export type PigSpot = {
  name: string
  city: string
  vibe: string
  details: string
  tip: string
  link: string
  emoji: string
  /** Whether pigs are part of the animals visitors can see on site. */
  hasPigs: boolean
  /** Short note on the pig situation, surfaced on the card. */
  pigNote: string
}

// Metro Detroit farms researched from official farm sites, Metroparks pages,
// municipal park pages, and local farm directories. Only farms where pigs were
// confirmed on site are listed here, since this is "Pigs Near Me." Always
// double-check seasonal hours and which animals are out before visiting.
export const pigSpots: PigSpot[] = [
  {
    name: 'Maybury Farm',
    city: 'Northville',
    vibe: 'Family farm with classic barnyard energy',
    details:
      'An 85-acre working farm with 100+ animals, wagon rides, a farm-themed playground, and a general store. A relaxed Metro Detroit favorite close to the city.',
    tip: 'Check visiting hours and petting barn access before heading out.',
    link: 'https://mayburyfarm.org/',
    emoji: '🚜',
    hasPigs: true,
    pigNote: 'Pigs are part of the 100+ animals on the working farm.',
  },
  {
    name: 'The Petting Farm at Domino’s Farms',
    city: 'Ann Arbor',
    vibe: 'Big variety petting farm running since 1984',
    details:
      'Home to about 200 traditional and unusual animals, with pony rides, hayrides, and a picturesque setting. Worth the short drive from Detroit.',
    tip: 'Spring through fall is usually the best window for a full visit.',
    link: 'https://www.pettingfarm.com/',
    emoji: '🐴',
    hasPigs: true,
    pigNote: 'Pigs are listed among the ~200 animals on site.',
  },
  {
    name: 'Upland Hills Farm',
    city: 'Oxford',
    vibe: 'Hands-on petting farm with cozy date-day potential',
    details:
      'A family farm since 1960 with pony rides, hayrides, nature walks, and pens you can step into to meet the animals up close.',
    tip: 'Public days are select Sundays in summer and every weekend in October — confirm before you go.',
    link: 'https://www.uplandhillsfarm.com/',
    emoji: '🐑',
    hasPigs: true,
    pigNote: 'Pigs share the farm with sheep, llamas, and alpacas.',
  },
  {
    name: 'Bowers School Farm',
    city: 'Bloomfield Hills',
    vibe: 'Working school farm with friendly animals',
    details:
      'A 93-acre working farm run by Bloomfield Hills Schools, open to the community spring through fall with bunny circles, pony grooming, and a poultry yard.',
    tip: 'Open to the public April through October; animals out vary by day and time.',
    link: 'https://www.schoolfarm.org/',
    emoji: '🐐',
    hasPigs: true,
    pigNote: 'The farm’s pigs are social and used to visitors.',
  },
  {
    name: 'Kensington Metropark Farm Center',
    city: 'Milford',
    vibe: 'Metropark working farm with 100+ animals',
    details:
      'Several breeds of horses, cows, donkeys, goats, and more across a Metropark farm, with weekend hayrides in the warmer months.',
    tip: 'Included with the park’s daily vehicle pass; visitors are asked not to feed the animals.',
    link: 'https://www.metroparks.com/kensington-metropark/kensington-metropark-farm-center/',
    emoji: '🐎',
    hasPigs: true,
    pigNote: 'Pigs are among the 100+ farm animals on site.',
  },
  {
    name: 'Wolcott Mill Metropark Farm Center',
    city: 'Ray Township',
    vibe: 'Big 250-acre Metropark working farm',
    details:
      'A 250-acre working farm near Romeo with daily milking demonstrations, a greenhouse and gardens, and seasonal horse-drawn wagon rides.',
    tip: 'Some goats and cows love a pat, but animals are on controlled diets — no feeding.',
    link: 'https://www.metroparks.com/wolcott-metropark/wolcott-mill-metropark-farm-center/',
    emoji: '🐄',
    hasPigs: true,
    pigNote: 'Pigs live on the farm alongside cows, goats, and sheep.',
  },
  {
    name: 'Hess-Hathaway Park',
    city: 'Waterford',
    vibe: 'Free township farm park with an animal exhibit',
    details:
      'A 167-acre township park with an animal exhibit farm, an all-kids playground, and nature trails. A laid-back, no-pressure animal stop.',
    tip: 'No admission fee — donations are appreciated, and guided tours can be arranged.',
    link: 'https://www.waterfordmi.gov/Facilities/Facility/Details/HessHathaway-Park-2',
    emoji: '🦆',
    hasPigs: true,
    pigNote: 'Pigs share the exhibit farm with goats, horses, and a donkey.',
  },
  {
    name: 'Heritage Park Petting Farm',
    city: 'Taylor',
    vibe: 'Budget-friendly Downriver municipal farm',
    details:
      'A municipal petting farm with 90+ animals in a full-size barn, plus a koi pond and waterfalls. An easy, inexpensive Downriver outing.',
    tip: 'Just $3–$4 admission; open Tue–Sun in summer and weekends in winter.',
    link: 'https://www.cityoftaylor.com/466/Heritage-Park-Petting-Farm',
    emoji: '🐷',
    hasPigs: true,
    pigNote: 'Home to pigs, pot-bellied pigs, and piglets in the barn.',
  },
  {
    name: 'Carousel Acres',
    city: 'South Lyon',
    vibe: 'Petting farm with exotic animals too',
    details:
      'A petting farm since 1993 where you can feed and brush animals — plus surprises like kangaroos, emus, reindeer, and a tortoise named Tom.',
    tip: 'Admission is about $9; pony rides cost a little extra.',
    link: 'https://www.carouselacres.biz/',
    emoji: '🎠',
    hasPigs: true,
    pigNote: 'Pigs share the place with goats, donkeys, and exotic animals.',
  },
  {
    name: 'Calder Dairy & Farm',
    city: 'Carleton',
    vibe: 'Free working dairy with farm-made ice cream',
    details:
      'A working dairy open daily and free to visit, where you can feed and pet animals, watch afternoon milking, and grab a farm-made ice cream cone.',
    tip: 'Free admission, open daily 10am–7pm; come around 4pm to catch milking.',
    link: 'https://calderdairy.com/visit-the-farm/',
    emoji: '🍦',
    hasPigs: true,
    pigNote: 'Pigs are among the animals you can feed and pet.',
  },
  {
    name: 'Cook’s Farm Dairy',
    city: 'Ortonville',
    vibe: 'Fourth-generation dairy with a barn walk',
    details:
      'A family dairy since 1933 where you can walk back to the barns to see the cows and pigs, pet the calves, and pick up homemade ice cream.',
    tip: 'Free to walk the farm; great in fall for the pumpkin hayride.',
    link: 'https://cooksfarmdairy.com/',
    emoji: '🥛',
    hasPigs: true,
    pigNote: 'You can walk to the barns to see and feed the pigs.',
  },
  {
    name: 'Blake Farms',
    city: 'Armada',
    vibe: 'Big orchard and cider mill with a Funland',
    details:
      'An 80-year-old orchard and cider mill an hour northeast of Detroit, with a Funland animal farm, train and wagon rides, a corn maze, and cider and donuts.',
    tip: 'Animals and the “Piggy Dash” races are seasonal — best in fall during Funland hours.',
    link: 'https://blakefarms.com/funland-cider-mill/',
    emoji: '🍎',
    hasPigs: true,
    pigNote: 'Pigs appear in Funland, including the “Piggy Dash” pig races.',
  },
  {
    name: 'Three Cedars Farm',
    city: 'Northville',
    vibe: 'Cider mill with a storybook petting farm',
    details:
      'A family cider mill in Northville with a Barn Yard Play Land of live animals, hayrides, a U-pick pumpkin patch, a corn maze, and fresh cider and donuts.',
    tip: 'Animals and activities are seasonal — best in fall during cider-mill hours.',
    link: 'https://threecedarsfarm.org/',
    emoji: '🎃',
    hasPigs: true,
    pigNote: 'Pigs are part of the petting farm, including a “Three Little Pigs” barnyard.',
  },
]
