export type Sport = "NFL"

export type Player = {
  id: string
  name: string

  sport: Sport
  league?: string

  team: string
  teamsPlayedFor: number

  position: string[]

  age: number

  // NEW FIELDS ✅
  college?: string
  draftRound?: number
  draftPick?: number

  // Scoring
  totalTDs: number
  passingTDs: number
  totalTDsResponsible: number

  // Yardage
  passingYards: number
  rushingYards: number

  // Honors
  proBowls: number
  allProSeasons: number
  superBowlsWon: number

  // Career
  gamesPlayed: number

  // Defense
  tackles: number
  sacks: number
  interceptions: number
}