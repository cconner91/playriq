import { Player } from "@/types/player"

export function mapToPlayer(row: any): Player {
  return {
    id: row.gsis_id,

    name: row.name,
    sport: "NFL",
    league: "NFL",

    team: row.latest_team,
    teamsPlayedFor: row.years_of_experience
      ? Number(row.years_of_experience)
      : 1,

    position: [row.position],

    // AGE (already provided)
    age: Number(row.birth_date) || 0,

    // NEW FIELDS
    college: row.college_name || "Unknown",

    draftRound: Number(row.draft_round) || 0,
    draftPick: Number(row.draft_pick) || 0,

    // TEMP stats (we’ll enrich later)
    totalTDs: 0,
    passingTDs: 0,
    totalTDsResponsible: 0,

    passingYards: 0,
    rushingYards: 0,
    receivingYards: 0,
    allPurposeYards: 0,

    proBowls: 0,
    superBowlsWon: 0,

    gamesPlayed: 0,

    tackles: 0,
    sacks: 0,
    interceptions: 0,
  }
}