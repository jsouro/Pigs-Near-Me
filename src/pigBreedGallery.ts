export type PigBreedPhoto = {
  name: string
  origin: string
  color: string
  imageUrl: string
  imageAlt: string
}

// Seeded from broad public pig breed listings and Wikimedia-hosted media where available.
export const pigBreedGallery: PigBreedPhoto[] = [
  {
    name: 'American Yorkshire',
    origin: 'United States',
    color: 'White',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Yorkshire%20pigs%20at%20animal%20sanctuary.jpg?width=800',
    imageAlt: 'American Yorkshire pigs',
  },
  {
    name: 'Angeln Saddleback',
    origin: 'Germany',
    color: 'Black and white',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Angeln%20Saddleback%20%28aka%29.jpg?width=800',
    imageAlt: 'Angeln Saddleback pig',
  },
  {
    name: 'Bisaro',
    origin: 'Portugal',
    color: 'Black and white',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Porco_b%C3%ADsaro.jpg?width=800',
    imageAlt: 'Bisaro pig',
  },
  {
    name: 'Göttingen minipig',
    origin: 'Germany',
    color: 'White',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/G%C3%B6ttingen%20Minipig.jpg?width=800',
    imageAlt: 'Göttingen minipig',
  },
  {
    name: 'Kunekune',
    origin: 'New Zealand',
    color: 'Multicolored',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Kunekune%20Pig%20at%20Hamilton%20Zoo.jpg?width=800',
    imageAlt: 'Kunekune pig',
  },
  {
    name: 'Nero Siciliano',
    origin: 'Italy, Sicily',
    color: 'Black',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Capizzi%20scrofa%200001.jpg?width=800',
    imageAlt: 'Nero Siciliano pig',
  },
  {
    name: 'Ossabaw Island hog',
    origin: 'Ossabaw Island, United States',
    color: 'Spotted and varied',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Ossabaw%20Island%20Hog.jpg?width=800',
    imageAlt: 'Ossabaw Island hog',
  },
  {
    name: 'Red Wattle hog',
    origin: 'United States',
    color: 'Red',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Wattle%20pig.jpg?width=800',
    imageAlt: 'Red Wattle hog',
  },
  {
    name: 'Tamworth',
    origin: 'United Kingdom',
    color: 'Red',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Mudchute%20farm%20pig%20side.jpg?width=800',
    imageAlt: 'Tamworth pig',
  },
  {
    name: 'Vietnamese Pot-Bellied',
    origin: 'Vietnam',
    color: 'Black or black and white',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sus%20scrofa%20domestica.jpg?width=800',
    imageAlt: 'Vietnamese pot-bellied pig',
  },
]
