const fs = require("fs")

const players = require("../data/players.json")

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_")
}

const updated = players.map((p) => ({
  ...p,
  id: `${normalizeName(p.name)}_nfl`,
  externalIds: {
    gsis_id: p.id
  }
}))

fs.writeFileSync(
  "data/players.json",
  JSON.stringify(updated, null, 2)
)

console.log("Migration complete")