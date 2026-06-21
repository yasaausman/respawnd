export type Status = 'Played' | 'Playing' | 'Backlog' | 'Want'
export type Genre =
  | 'Action'
  | 'RPG'
  | 'Strategy'
  | 'Shooter'
  | 'Adventure'
  | 'Platformer'
  | 'Horror'
  | 'Sports'
  | 'Simulation'
  | 'Fighting'

export interface Game {
  id: string
  title: string
  coverUrl: string
  releaseDate: string
  genres: Genre[]
  developer: string
  description: string
}

export interface LoggedGame {
  game: Game
  status: Status
  rating: number
  review: string
}

export const GAMES: Game[] = [
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    coverUrl: 'https://placehold.co/300x400/1e1b4b/a78bfa?text=Elden+Ring',
    releaseDate: '2022-02-25',
    genres: ['Action', 'RPG'],
    developer: 'FromSoftware',
    description:
      'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast open world awaits, filled with ancient secrets and punishing challenges.',
  },
  {
    id: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    coverUrl: 'https://placehold.co/300x400/14532d/86efac?text=BG3',
    releaseDate: '2023-08-03',
    genres: ['RPG', 'Strategy'],
    developer: 'Larian Studios',
    description:
      'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.',
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    coverUrl: 'https://placehold.co/300x400/451a03/fb923c?text=CP2077',
    releaseDate: '2020-12-10',
    genres: ['Action', 'RPG'],
    developer: 'CD Projekt Red',
    description:
      'An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour, and body modification.',
  },
  {
    id: 'hollow-knight',
    title: 'Hollow Knight',
    coverUrl: 'https://placehold.co/300x400/0c0a09/a8a29e?text=Hollow+Knight',
    releaseDate: '2017-02-24',
    genres: ['Action', 'Adventure', 'Platformer'],
    developer: 'Team Cherry',
    description:
      'A challenging 2D action-adventure through a vast ruined kingdom of insects and heroes. Forge your own path in a vast underground world.',
  },
  {
    id: 'hades',
    title: 'Hades',
    coverUrl: 'https://placehold.co/300x400/4c0519/fb7185?text=Hades',
    releaseDate: '2020-09-17',
    genres: ['Action', 'RPG'],
    developer: 'Supergiant Games',
    description:
      'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.',
  },
  {
    id: 'resident-evil-4',
    title: 'Resident Evil 4',
    coverUrl: 'https://placehold.co/300x400/1a2e1a/4ade80?text=RE4+Remake',
    releaseDate: '2023-03-24',
    genres: ['Horror', 'Action', 'Adventure'],
    developer: 'Capcom',
    description:
      'Survive the terror of a rural European village in this remake of the iconic survival horror classic. Rescued from a cult, but the nightmare is just beginning.',
  },
  {
    id: 'doom-eternal',
    title: 'DOOM Eternal',
    coverUrl: 'https://placehold.co/300x400/450a0a/f87171?text=DOOM+Eternal',
    releaseDate: '2020-03-20',
    genres: ['Shooter', 'Action'],
    developer: 'id Software',
    description:
      'The armies of Hell have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the consumption of all life.',
  },
  {
    id: 'celeste',
    title: 'Celeste',
    coverUrl: 'https://placehold.co/300x400/1e1b4b/818cf8?text=Celeste',
    releaseDate: '2018-01-25',
    genres: ['Platformer', 'Adventure'],
    developer: 'Maddy Thorson',
    description:
      'Help Madeline survive her inner demons on her journey to the top of Celeste Mountain in this incredibly tight and emotional platformer.',
  },
  {
    id: 'sekiro',
    title: 'Sekiro: Shadows Die Twice',
    coverUrl: 'https://placehold.co/300x400/27272a/d4d4d8?text=Sekiro',
    releaseDate: '2019-03-22',
    genres: ['Action', 'Adventure'],
    developer: 'FromSoftware',
    description:
      'Carve your own clever path to vengeance in the critically acclaimed action-adventure game set in late 1500s Sengoku Japan.',
  },
  {
    id: 'disco-elysium',
    title: 'Disco Elysium',
    coverUrl: 'https://placehold.co/300x400/1c1917/d6d3d1?text=Disco+Elysium',
    releaseDate: '2019-10-15',
    genres: ['RPG', 'Adventure'],
    developer: 'ZA/UM',
    description:
      'A groundbreaking open-world role-playing game where you can become any kind of detective you want. A city on the edge of the world.',
  },
  {
    id: 'the-witcher-3',
    title: 'The Witcher 3',
    coverUrl: 'https://placehold.co/300x400/14532d/6ee7b7?text=Witcher+3',
    releaseDate: '2015-05-19',
    genres: ['RPG', 'Action', 'Adventure'],
    developer: 'CD Projekt Red',
    description:
      'Play as Geralt of Rivia, a mercenary monster slayer, in a visually stunning fantasy universe full of meaningful choices and impactful consequences.',
  },
  {
    id: 'dark-souls-3',
    title: 'Dark Souls III',
    coverUrl: 'https://placehold.co/300x400/1c1917/a8a29e?text=Dark+Souls+III',
    releaseDate: '2016-04-12',
    genres: ['Action', 'RPG'],
    developer: 'FromSoftware',
    description:
      'The third entry in the acclaimed Dark Souls series. A punishing dark fantasy RPG where every death is a lesson and every victory is earned.',
  },
]

export const LOGGED_GAMES: LoggedGame[] = [
  {
    game: GAMES[0],
    status: 'Played',
    rating: 9,
    review:
      'A masterpiece of open-world design. The boss fights are brutal but fair, and the world-building is extraordinary.',
  },
  {
    game: GAMES[4],
    status: 'Playing',
    rating: 8,
    review:
      'Incredibly addictive. The narrative integration with the roguelite loop is genius — every run feels different.',
  },
  {
    game: GAMES[1],
    status: 'Backlog',
    rating: 0,
    review: '',
  },
  {
    game: GAMES[7],
    status: 'Played',
    rating: 10,
    review:
      'Perfect platformer. The story hits hard and the gameplay is incredibly precise and satisfying. A must-play.',
  },
  {
    game: GAMES[6],
    status: 'Want',
    rating: 0,
    review: '',
  },
  {
    game: GAMES[10],
    status: 'Played',
    rating: 9,
    review:
      'Still the gold standard for open-world RPGs. The side quests are better than most games entire campaigns.',
  },
  {
    game: GAMES[8],
    status: 'Playing',
    rating: 7,
    review: 'The posture system is revolutionary. Incredibly rewarding once it clicks.',
  },
]
