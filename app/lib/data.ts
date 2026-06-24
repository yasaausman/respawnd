export type Status = 'Played' | 'Playing' | 'Backlog' | 'Want'

// ── Curated popular-games list ────────────────────────────────────────────────
// rawg_id is 0 for games added after mid-2023 where the RAWG ID isn't known
// at build time; the frontend resolves all of them by name search at runtime.

export interface PopularGame {
  rawg_id: number
  name: string
  slug: string
}

export const POPULAR_GAMES: PopularGame[] = [
  { rawg_id: 4291,   name: 'Counter-Strike 2',          slug: 'counter-strike-2' },
  { rawg_id: 4415,   name: 'Dota 2',                    slug: 'dota-2' },
  { rawg_id: 586618, name: 'PUBG: Battlegrounds',        slug: 'playerunknowns-battlegrounds' },
  { rawg_id: 768058, name: 'Hogwarts Legacy',            slug: 'hogwarts-legacy' },
  { rawg_id: 41994,  name: 'Cyberpunk 2077',             slug: 'cyberpunk-2077' },
  { rawg_id: 326243, name: 'Elden Ring',                 slug: 'elden-ring' },
  { rawg_id: 3498,   name: 'Grand Theft Auto V',         slug: 'grand-theft-auto-v' },
  { rawg_id: 28747,  name: 'Red Dead Redemption 2',      slug: 'red-dead-redemption-2' },
  { rawg_id: 499235, name: "Baldur's Gate 3",            slug: 'baldurs-gate-3' },
  { rawg_id: 0,      name: 'Palworld',                   slug: 'palworld' },
  { rawg_id: 0,      name: 'Helldivers 2',               slug: 'helldivers-2' },
  { rawg_id: 16817,  name: 'Stardew Valley',             slug: 'stardew-valley' },
  { rawg_id: 1656,   name: 'Terraria',                   slug: 'terraria' },
  { rawg_id: 436886, name: 'Among Us',                   slug: 'among-us' },
  { rawg_id: 521628, name: 'Valheim',                    slug: 'valheim' },
  { rawg_id: 17973,  name: 'Rust',                       slug: 'rust' },
  { rawg_id: 4212,   name: 'ARK: Survival Evolved',      slug: 'ark-survival-evolved' },
  { rawg_id: 15739,  name: 'Dead by Daylight',           slug: 'dead-by-daylight' },
  { rawg_id: 83580,  name: 'Apex Legends',               slug: 'apex-legends' },
  { rawg_id: 13536,  name: 'Team Fortress 2',            slug: 'team-fortress-2' },
  { rawg_id: 6968,   name: 'Left 4 Dead 2',              slug: 'left-4-dead-2' },
  { rawg_id: 58134,  name: 'Monster Hunter: World',      slug: 'monster-hunter-world' },
  { rawg_id: 5679,   name: 'Destiny 2',                  slug: 'destiny-2' },
  { rawg_id: 759,    name: 'Path of Exile',              slug: 'path-of-exile' },
  { rawg_id: 8981,   name: 'Warframe',                   slug: 'warframe' },
  { rawg_id: 30514,  name: "No Man's Sky",               slug: 'no-mans-sky' },
  { rawg_id: 439038, name: 'Hades',                      slug: 'hades' },
  { rawg_id: 24397,  name: 'Hollow Knight',              slug: 'hollow-knight' },
  { rawg_id: 12937,  name: 'Celeste',                    slug: 'celeste' },
  { rawg_id: 231689, name: 'Deep Rock Galactic',         slug: 'deep-rock-galactic' },
  { rawg_id: 556161, name: 'Risk of Rain 2',             slug: 'risk-of-rain-2' },
  { rawg_id: 0,      name: 'Vampire Survivors',          slug: 'vampire-survivors' },
  { rawg_id: 0,      name: 'Dave the Diver',             slug: 'dave-the-diver' },
  { rawg_id: 0,      name: 'Lies of P',                  slug: 'lies-of-p' },
  { rawg_id: 0,      name: 'Alan Wake 2',                slug: 'alan-wake-2' },
  { rawg_id: 0,      name: 'Starfield',                  slug: 'starfield' },
  { rawg_id: 0,      name: 'Cocoon',                     slug: 'cocoon' },
  { rawg_id: 0,      name: 'Jusant',                     slug: 'jusant' },
  { rawg_id: 0,      name: 'Viewfinder',                 slug: 'viewfinder' },
  { rawg_id: 0,      name: 'The Talos Principle 2',      slug: 'the-talos-principle-2' },
  { rawg_id: 0,      name: 'Armored Core VI',            slug: 'armored-core-vi' },
  { rawg_id: 0,      name: 'Street Fighter 6',           slug: 'street-fighter-6' },
  { rawg_id: 0,      name: 'Mortal Kombat 1',            slug: 'mortal-kombat-1' },
  { rawg_id: 0,      name: 'Diablo IV',                  slug: 'diablo-iv' },
  { rawg_id: 0,      name: 'Remnant 2',                  slug: 'remnant-2' },
  { rawg_id: 0,      name: 'Sea of Stars',               slug: 'sea-of-stars' },
  { rawg_id: 0,      name: 'Blasphemous 2',              slug: 'blasphemous-2' },
  { rawg_id: 0,      name: 'Pizza Tower',                slug: 'pizza-tower' },
  { rawg_id: 0,      name: 'Dredge',                     slug: 'dredge' },
  { rawg_id: 0,      name: 'Venba',                      slug: 'venba' },
]

// ── API types ─────────────────────────────────────────────────────────────────

export interface RawgGenre {
  id: number
  name: string
  slug: string
}

export interface SearchResult {
  id: number
  name: string
  background_image: string | null
  released: string | null
  genres: RawgGenre[]
}

export interface GameDetail {
  id: number
  slug: string
  name: string
  description: string
  released: string | null
  background_image: string | null
  background_image_additional: string | null
  rating: number
  metacritic: number | null
  genres: RawgGenre[]
  developers?: { id: number; name: string; slug: string }[]
  platforms?: { platform: { id: number; name: string; slug: string } }[]
}

// ── API types for game logs ───────────────────────────────────────────────────

export interface GameLog {
  id: number
  rawg_id: number
  title: string
  cover_url: string | null
  status: Status
  rating: number | null
  review: string | null
  created_at: string
}

// ── Static library data (no backend yet) ──────────────────────────────────────

export interface LibraryEntry {
  id: string
  title: string
  coverUrl: string | null
  genres: string[]
  status: Status
  rating: number
  review: string
}

export const LOGGED_GAMES: LibraryEntry[] = [
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    coverUrl: 'https://placehold.co/300x400/1e1b4b/a78bfa?text=Elden+Ring',
    genres: ['Action', 'RPG'],
    status: 'Played',
    rating: 9,
    review:
      'A masterpiece of open-world design. The boss fights are brutal but fair, and the world-building is extraordinary.',
  },
  {
    id: 'hades',
    title: 'Hades',
    coverUrl: 'https://placehold.co/300x400/4c0519/fb7185?text=Hades',
    genres: ['Action', 'RPG'],
    status: 'Playing',
    rating: 8,
    review:
      'Incredibly addictive. The narrative integration with the roguelite loop is genius.',
  },
  {
    id: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    coverUrl: 'https://placehold.co/300x400/14532d/86efac?text=BG3',
    genres: ['RPG', 'Strategy'],
    status: 'Backlog',
    rating: 0,
    review: '',
  },
  {
    id: 'celeste',
    title: 'Celeste',
    coverUrl: 'https://placehold.co/300x400/1e1b4b/818cf8?text=Celeste',
    genres: ['Platformer', 'Adventure'],
    status: 'Played',
    rating: 10,
    review:
      'Perfect platformer. The story hits hard and the gameplay is incredibly precise and satisfying.',
  },
  {
    id: 'doom-eternal',
    title: 'DOOM Eternal',
    coverUrl: 'https://placehold.co/300x400/450a0a/f87171?text=DOOM+Eternal',
    genres: ['Shooter', 'Action'],
    status: 'Want',
    rating: 0,
    review: '',
  },
  {
    id: 'the-witcher-3',
    title: 'The Witcher 3',
    coverUrl: 'https://placehold.co/300x400/14532d/6ee7b7?text=Witcher+3',
    genres: ['RPG', 'Action', 'Adventure'],
    status: 'Played',
    rating: 9,
    review:
      'Still the gold standard for open-world RPGs. The side quests are better than most games entire campaigns.',
  },
  {
    id: 'sekiro',
    title: 'Sekiro: Shadows Die Twice',
    coverUrl: 'https://placehold.co/300x400/27272a/d4d4d8?text=Sekiro',
    genres: ['Action', 'Adventure'],
    status: 'Playing',
    rating: 7,
    review: 'The posture system is revolutionary. Incredibly rewarding once it clicks.',
  },
]
