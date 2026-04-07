"use client"

import { useState, useMemo } from "react"
import players from "@/data/players.json"
import playerPool from "@/data/playerPool.json"

type Player = any

export default function Home() {
  const allPlayers = players as Player[]
  const pool = playerPool as any[]

  const [query, setQuery] = useState("")
  const [guesses, setGuesses] = useState<Player[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // ✅ Target from playerPool (random)
  const [target] = useState<Player>(() => {
    const poolIds = new Set(pool.map((p) => p.playerId))
    const poolPlayers = allPlayers.filter((p) => poolIds.has(p.id))
    if (!poolPlayers.length) return allPlayers[0]
    return poolPlayers[Math.floor(Math.random() * poolPlayers.length)]
  })

  const numericKeys = ["age", "draftPick", "draftYear", "jersey_number"]

  const categoryKeys = [
    "name",
    "position",
    "team",
    "age",
    "college",
    "draftPick",
    "draftYear",
    "jersey_number",
    "draftTeam"
  ]

  // ✅ Search (full DB)
  const filteredPlayers = useMemo(() => {
    if (!query) return []
    return allPlayers
      .filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 7)
  }, [query, allPlayers])

  const handleSelectPlayer = (player: Player) => {
    if (gameOver) return

    setGuesses((prev) => {
      if (prev.find((p) => p.id === player.id)) return prev
      if (prev.length >= 8) return prev

      const updated = [...prev, player]

      if (player.id === target.id) {
        setWon(true)
        setGameOver(true)
        setShowModal(true)
      }

      if (updated.length === 8 && player.id !== target.id) {
        setGameOver(true)
        setShowModal(true)
      }

      return updated
    })

    setQuery("")
  }

  function getCellStyle(key: string, guessVal: any, targetVal: any) {
    if (guessVal == null || targetVal == null) {
      return { background: "#111", color: "#fff", arrow: "" }
    }

    // Array match (position)
    if (Array.isArray(guessVal) && Array.isArray(targetVal)) {
      if (guessVal.some((g) => targetVal.includes(g))) {
        return { background: "#16a34a", color: "#fff", arrow: "" }
      }
    }

    // Exact match
    if (guessVal === targetVal) {
      return { background: "#16a34a", color: "#fff", arrow: "" }
    }

    // Numeric logic
    if (numericKeys.includes(key)) {
      const g = Number(guessVal)
      const t = Number(targetVal)

      if (!isNaN(g) && !isNaN(t)) {
        const diff = Math.abs(g - t)

        if (diff <= 2) {
          return {
            background: "#eab308",
            color: "#000",
            arrow: g < t ? "↑" : "↓"
          }
        }

        return {
          background: "#1f2937",
          color: "#9ca3af",
          arrow: g < t ? "↑" : "↓"
        }
      }
    }

    return { background: "#1f2937", color: "#9ca3af", arrow: "" }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #222"
        }}
      >
        <div style={{ color: "#14b8a6", fontWeight: 700 }}>PlayrIQ</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/about">About</a>
          <a href="/how-to-play">How to Play</a>
          <a href="/faq">FAQ</a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        
        {/* LOGO */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <img src="/main_logo.png" style={{ width: 200 }} />
        </div>

        {/* SUBTITLE */}
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: 16 }}>
          Guess the player in 8 tries or less
        </p>

        {/* LEGEND */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 20
          }}
        >
          {[
            { color: "#16a34a", text: "Correct" },
            { color: "#eab308", text: "Close" },
            { color: "#6b7280", text: "Incorrect" }
          ].map((item) => (
            <div
              key={item.text}
              style={{
                border: `2px solid ${item.color}`,
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                color: item.color
              }}
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player..."
            disabled={gameOver}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #14b8a6",
              background: "#111",
              color: "#fff"
            }}
          />

          {/* DROPDOWN */}
          {query && filteredPlayers.length > 0 && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                background: "#111",
                border: "1px solid #14b8a6",
                borderRadius: 10,
                marginTop: 6,
                zIndex: 10
              }}
            >
              {filteredPlayers.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlayer(p)}
                  style={{ padding: 12, cursor: "pointer" }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GIVE UP BUTTON */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          <button
            onClick={() => {
              setGameOver(true)
              setShowModal(true)
            }}
            disabled={gameOver}
            style={{
              padding: "10px 16px",
              background: "#14b8a6",
              color: "#000",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              opacity: gameOver ? 0.6 : 1
            }}
          >
            Give Up
          </button>
        </div>

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 12px"
            }}
          >
            <thead>
              <tr>
                {[
                  "Player",
                  "Position",
                  "Team",
                  "Age",
                  "College",
                  "Draft Pick",
                  "Draft Year",
                  "Jersey #",
                  "Drafted Team"
                ].map((col, idx) => (
                  <th
                    key={col}
                    style={{
                      color: "#14b8a6",
                      fontSize: 12,
                      textAlign: "left",
                      padding: "0 8px 6px 8px",
                      minWidth: idx === 0 ? 180 : 110
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(8)].map((_, i) => {
                const player = guesses[i]

                const values = [
                  player?.name,
                  player?.position?.[0],
                  player?.team,
                  player?.age,
                  player?.college,
                  player?.draftPick,
                  player?.draftYear,
                  player?.jersey_number,
                  player?.draftTeam
                ]

                return (
                  <tr key={i}>
                    {values.map((val, idx) => {
                      const key = categoryKeys[idx]
                      const style =
                        player && target
                          ? getCellStyle(key, player[key], target[key])
                          : { background: "#111", color: "#fff", arrow: "" }

                      return (
                        <td
                          key={idx}
                          style={{
                            background: style.background,
                            color: style.color,
                            border: "1px solid #222",
                            padding: 16,
                            borderRadius: 10,
                            minWidth: idx === 0 ? 180 : 110,
                            height: 60
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{val}</span>
                            {style.arrow && <span>{style.arrow}</span>}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                background: "#111",
                padding: 20,
                borderRadius: 12,
                width: "90%",
                maxWidth: 400,
                border: "1px solid #14b8a6"
              }}
            >
              <h2 style={{ color: "#14b8a6" }}>
                {won ? "You got it!" : "Player Revealed"}
              </h2>

              <p><strong>{target.name}</strong></p>
              <p>{target.position?.[0]} - {target.team}</p>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: 10,
                  padding: 10,
                  width: "100%",
                  background: "#14b8a6",
                  border: "none",
                  borderRadius: 8
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}