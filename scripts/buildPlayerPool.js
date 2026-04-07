const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")

const players = require("../data/players.json")

const results = []

// 👉 change this if you switch files
const filePath = path.join(process.cwd(), "data/raw/playerpool_test.csv")

function normalizeName(name) {
  if (!name) return ""

  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_")
}

function getSportFromLeague(league) {
  switch ((league || "").toUpperCase()) {
    case "NFL":
      return "Football"
    case "NBA":
      return "Basketball"
    case "MLB":
      return "Baseball"
    case "NHL":
      return "Hockey"
    default:
      return "Unknown"
  }
}

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const name = row.name
    const league = (row.league || "NFL").toUpperCase()
    const difficulty = Number(row.difficulty)

    const sport = getSportFromLeague(league)

    // 👉 build YOUR system ID
    const id = `${normalizeName(name)}_${league.toLowerCase()}`

    const match = players.find((p) => p.id === id)

    if (!match) {
      console.warn(`⚠️ Missing player: ${name} (${id})`)
      return
    }

    results.push({
      playerId: match.id,
      sport,
      league,
      difficulty: !isNaN(difficulty) ? difficulty : 3,
      enabled: true
    })
  })
  .on("end", () => {
    // remove duplicates just in case
    const unique = Array.from(
      new Map(results.map((p) => [p.playerId, p])).values()
    )

    const outputPath = path.join(process.cwd(), "data/playerPool.json")

    fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2))

    console.log(`✅ Built player pool: ${unique.length} players`)
  })