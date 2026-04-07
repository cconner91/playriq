import players from "@/data/players.json"
import playerPool from "@/data/playerPool.json"

// loosen types for now
type Player = any
type PoolItem = any

type Filters = {
  sport?: string
  league?: string
  maxDifficulty?: number
}

export function getPlayablePlayers(filters: Filters = {}): Player[] {
  const { sport, league, maxDifficulty } = filters

  const filteredPool = (playerPool as PoolItem[]).filter((p) => {
    if (sport && p.sport !== sport) return false
    if (league && p.league !== league) return false
    if (maxDifficulty && p.difficulty > maxDifficulty) return false
    return true
  })

  const playablePlayers = filteredPool
    .map((poolItem) =>
      (players as Player[]).find((p) => p.id === poolItem.playerId)
    )
    .filter(Boolean)

  return playablePlayers as Player[]
}

export function getRandomPlayer(filters: Filters = {}): Player | null {
  const list = getPlayablePlayers(filters)

  if (!list.length) return null

  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}