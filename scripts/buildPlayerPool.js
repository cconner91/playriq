const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")

const results = []

const filePath = path.join(process.cwd(), "data/raw/playerPool.csv")

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    const name = row.name?.trim()

    const league = (row.league || "NFL")
      .toString()
      .trim()
      .toUpperCase()

    let difficulty = Number(row.difficulty)

    if (isNaN(difficulty) || difficulty < 1 || difficulty > 3) {
      difficulty = 1
    }

    if (!name) return

    // 🔑 IMPORTANT: must match your players.json ID format
    const playerId = `${name.toLowerCase().replace(/\s+/g, "_")}_${league.toLowerCase()}`

    results.push({
      playerId,
      league,
      difficulty
    })
  })
  .on("end", () => {
    const outputPath = path.join(process.cwd(), "data/playerPool.json")

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))

    console.log(`✅ Built playerPool.json with ${results.length} players`)
  })