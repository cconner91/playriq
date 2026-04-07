const fs = require("fs")

const players = require("../data/players.json")
const stats = require("../data/stats.json")

const merged = players.map((player) => {
  const stat = stats.find((s) => s.playerId === player.id)

  return {
    ...player,
    passingYards: stat?.passingYards || 0,
    rushingYards: stat?.rushingYards || 0
  }
})

fs.writeFileSync(
  "data/players.json",
  JSON.stringify(merged, null, 2)
)

console.log("Merged players + stats")