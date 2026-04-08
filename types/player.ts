export type Sport = "NFL"

export type Player = {
  id: string
  name: string

  sport: Sport
  league?: string

  // Player Attributes (CATEGORIES FOR ALL SPORTS - Position just has unique values for each sport)
  team: string
  teamsPlayedFor: number
  position: string[]
  age: number
  college?: string
  draftRound?: number
  draftPick?: number
  gamesPlayed: number

  // PLAYER STATISTICS:

  //FOOTBALL STATISTICS

  //Passing (Career Totals)
  totalTDs: number
  passingTDs: number

  //TD's General (Career Totals)
  totalTDsResponsible: number

  // Yardage (Career Totals)
  passingYards: number
  rushingYards: number
  receivingYards: number
  allPurposeYards: number

  // Honors
  proBowls: number
  superBowlsWon: number

  // Defense (Career Totals)
  tackles: number
  sacks: number
  interceptions: number
}