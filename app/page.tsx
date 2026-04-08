"use client"

import { useState, useMemo, useEffect } from "react"
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

  const [selectedLeague, setSelectedLeague] = useState("NFL")
  const [selectedDifficulty, setSelectedDifficulty] = useState(1)

  const [target, setTarget] = useState<Player | null>(null)

  // 🎯 TARGET LOGIC
  useEffect(() => {
    const poolFiltered = pool.filter(
      (p) =>
        p.league === selectedLeague &&
        p.difficulty === selectedDifficulty
    )

    const poolIds = new Set(poolFiltered.map((p) => p.playerId))

    const eligiblePlayers = allPlayers.filter((p) =>
      poolIds.has(p.id)
    )

    if (!eligiblePlayers.length) return

    const randomPlayer =
      eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)]

    setTarget(randomPlayer)

    // reset game
    setGuesses([])
    setGameOver(false)
    setWon(false)
  }, [selectedLeague, selectedDifficulty])

  // 🔍 SEARCH
  const filteredPlayers = useMemo(() => {
    if (!query) return []

    return allPlayers
      .filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 7)
  }, [query, allPlayers])

  const handleSelectPlayer = (player: Player) => {
    if (gameOver || !target) return

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

  // 🎨 CELL COLORS
  function getCellStyle(key: string, guessVal: any, targetVal: any) {
    if (!targetVal) return { background: "#111", color: "#fff" }

    if (guessVal === targetVal) {
      return { background: "#16a34a", color: "#fff" }
    }

    if (["age", "draftPick", "draftYear", "jersey_number"].includes(key)) {
      const g = Number(guessVal)
      const t = Number(targetVal)

      if (!isNaN(g) && !isNaN(t)) {
        if (Math.abs(g - t) <= 2) {
          return { background: "#eab308", color: "#000" }
        }
      }
    }

    return { background: "#1f2937", color: "#9ca3af" }
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #222"
      }}>
        <div style={{ color: "#14b8a6", fontWeight: 700 }}>PlayrIQ</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/about">About</a>
          <a href="/how-to-play">How to Play</a>
          <a href="/faq">FAQ</a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>

        {/* LOGO */}
        <div style={{ textAlign: "center" }}>
          <img src="/main_logo.png" style={{ width: 180 }} />
        </div>

        {/* SUBTITLE */}
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: 16 }}>
          Guess the player in 8 tries
        </p>

        {/* CONTROLS */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          marginBottom: 16
        }}>
          
          {/* LEAGUE */}
          <div style={{ display: "flex", gap: 8 }}>
            {["NFL"].map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background:
                    selectedLeague === league ? "#14b8a6" : "transparent",
                  color:
                    selectedLeague === league ? "#000" : "#14b8a6",
                  fontWeight: 600
                }}
              >
                {league}
              </button>
            ))}
          </div>

          {/* DIFFICULTY */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Easy", value: 1 },
              { label: "Medium", value: 2 },
              { label: "Hard", value: 3 }
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDifficulty(d.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background:
                    selectedDifficulty === d.value ? "#14b8a6" : "transparent",
                  color:
                    selectedDifficulty === d.value ? "#000" : "#14b8a6",
                  fontWeight: 600
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player..."
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #14b8a6",
              background: "#111",
              color: "#fff"
            }}
          />

          {query && filteredPlayers.length > 0 && (
            <div style={{
              position: "absolute",
              width: "100%",
              background: "#111",
              border: "1px solid #14b8a6",
              borderRadius: 10,
              marginTop: 6
            }}>
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

        {/* GIVE UP */}
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <button
            onClick={() => {
              setGameOver(true)
              setShowModal(true)
            }}
            style={{
              padding: "10px 16px",
              background: "#14b8a6",
              color: "#000",
              borderRadius: 8
            }}
          >
            Give Up
          </button>
        </div>

        {/* TABLE */}
        <div style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch"
        }}>
          <table style={{
            width: "100%",
            minWidth: 900
          }}>
            <thead>
              <tr>
                {["Player","Pos","Team","Age","College","Pick","Year","#","Draft"].map(h => (
                  <th key={h} style={{ color:"#14b8a6", padding:8 }}>{h}</th>
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
                      const key = ["name","position","team","age","college","draftPick","draftYear","jersey_number","draftTeam"][idx]

                      const style =
                        player && target
                          ? getCellStyle(key, player[key], target[key])
                          : { background:"#111", color:"#fff" }

                      return (
                        <td key={idx} style={{
                          padding:12,
                          background:style.background,
                          color:style.color,
                          border:"1px solid #222"
                        }}>
                          {val}
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
        {showModal && target && (
          <div style={{
            position:"fixed",
            top:0,left:0,width:"100%",height:"100%",
            background:"rgba(0,0,0,0.8)",
            display:"flex",justifyContent:"center",alignItems:"center"
          }}>
            <div style={{
              background:"#111",
              padding:20,
              borderRadius:10
            }}>
              <h2>{won ? "Correct!" : "Answer"}</h2>
              <p>{target.name}</p>
              <button onClick={()=>setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}