const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")

const results = []

const filePath = path.join(process.cwd(), "data/raw/playerAttributes_nfl.csv")

// Normalize name → ID
function normalizeName(name) {
  if (!name) return ""

  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_")
}

// Convert DOB → Age
function getAge(dob) {
  if (!dob) return null

  let value = dob

  // Fix 2-digit years like 1/2/80 → 1/2/1980
  if (typeof value === "string" && value.includes("/")) {
    const parts = value.split("/")
    if (parts[2] && parts[2].length === 2) {
      value = `${parts[0]}/${parts[1]}/19${parts[2]}`
    }
  }

  const birth = new Date(value)
  if (isNaN(birth)) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()

  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const id = `${normalizeName(row.name)}_nfl`

    // Clean DOB formatting
    const dobRaw = row.birth_date
    let dob = null

    if (dobRaw) {
      let value = dobRaw

      // Fix 2-digit year
      if (value.includes("/")) {
        const parts = value.split("/")
        if (parts[2] && parts[2].length === 2) {
          value = `${parts[0]}/${parts[1]}/19${parts[2]}`
        }
      }

      const parsed = new Date(value)
      if (!isNaN(parsed)) {
        dob = parsed.toISOString().split("T")[0]
      }
    }

    const player = {
      id,

      externalIds: {
        gsis_id: row.gsis_id,
      },

      name: row.name,

      sport: "Football",
      league: "NFL",

      team: row.latest_team || null,
      teamsPlayedFor: Number(row.years_of_experience) || 1,

      position: row.position ? [row.position] : [],

      birthDate: dob,
      age: getAge(dobRaw),

      height: Number(row.height) || null,
      weight: Number(row.weight) || null,

      college: row.college_name
        ? row.college_name.split(";")[0]
        : "Unknown",

      draftYear: Number(row.draft_year) || null,
      draftRound: Number(row.draft_round) || null,
      draftPick: Number(row.draft_pick) || null,
      jersey_number: row.jersey_number && row.jersey_number !== ""? Number(row.jersey_number): null,
      draftTeam: row.draft_team || null,

      stats: {}
    }

    results.push(player)
  })
  .on("end", () => {
    const uniquePlayers = Array.from(
      new Map(results.map((p) => [p.id, p])).values()
    )

    const outputPath = path.join(process.cwd(), "data/players.json")

    fs.writeFileSync(outputPath, JSON.stringify(uniquePlayers, null, 2))

    console.log(`✅ Converted ${uniquePlayers.length} players`)
  })