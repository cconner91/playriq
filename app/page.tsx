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
    const filteredPool = pool.filter(
      (p) =>
        p.league === selectedLeague &&
        p.difficulty === selectedDifficulty
    )

    const ids = new Set(filteredPool.map((p) => p.playerId))
    const eligible = allPlayers.filter((p) => ids.has(p.id))

    if (!eligible.length) return

    const random =
      eligible[Math.floor(Math.random() * eligible.length)]

    setTarget(random)
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

  // 🎨 CELL COLOR LOGIC + ARROWS
  function getCellStyle(key: string, guessVal: any, targetVal: any) {
    let background = "#111"
    let color = "#fff"
    let arrow = ""

    if (guessVal == null || targetVal == null) {
      return { background, color, arrow }
    }

    if (Array.isArray(guessVal) && Array.isArray(targetVal)) {
      const match = guessVal.some((g) => targetVal.includes(g))
      if (match) return { background: "#16a34a", color: "#fff", arrow: "" }
    }

    if (guessVal === targetVal) {
      return { background: "#16a34a", color: "#fff", arrow: "" }
    }

    if (["age", "draftPick", "draftYear", "jersey_number"].includes(key)) {
      const g = Number(guessVal)
      const t = Number(targetVal)

      if (!isNaN(g) && !isNaN(t)) {
        if (Math.abs(g - t) <= 2) {
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <img src="/main_logo.png" style={{ width: 200 }} />
        </div>

        {/* SUBTITLE */}
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: 16 }}>
          Guess the player in 8 tries or less
        </p>

        {/* LEGEND */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap"
        }}>
          {[
            { color: "#16a34a", text: "Correct" },
            { color: "#eab308", text: "Close" },
            { color: "#6b7280", text: "Incorrect" }
          ].map((item) => (
            <div key={item.text} style={{
              border: `2px solid ${item.color}`,
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 12,
              color: item.color
            }}>
              {item.text}
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div style={{ marginBottom: 16 }}>

          <div style={{ textAlign: "center", fontSize: 12, color: "#888", marginBottom: 6 }}>
            League
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {["NFL"].map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background: selectedLeague === league ? "#14b8a6" : "transparent",
                  color: selectedLeague === league ? "#000" : "#14b8a6",
                  fontWeight: 600
                }}
              >
                {league}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: "#888", margin: "10px 0 6px" }}>
            Difficulty
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {[1,2,3].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background: selectedDifficulty === d ? "#14b8a6" : "transparent",
                  color: selectedDifficulty === d ? "#000" : "#14b8a6",
                  fontWeight: 600
                }}
              >
                {d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard"}
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
                <div key={p.id} onClick={() => handleSelectPlayer(p)} style={{ padding: 12 }}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GIVE UP */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
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
        <div style={{ width: "100%", overflowX: "hidden" }}>
          <table style={{
            width: "100%",
            tableLayout: "fixed",
            borderCollapse: "separate",
            borderSpacing: "0 8px"
          }}>
            <thead>
              <tr>
                {["Player","Position","Team","Age","College","Draft Pick","Draft Year","Jersey #","Drafted Team"].map((h,i)=>(
                  <th key={h} style={{
                    fontSize:11,
                    padding:"4px",
                    color:"#14b8a6"
                  }}>{h}</th>
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
                          : { background:"#111", color:"#fff", arrow:"" }

                      return (
                        <td key={idx} style={{
                          padding:10,
                          fontSize:12,
                          wordBreak:"break-word",
                          border:"1px solid #222",
                          borderRadius:8,
                          background:style.background,
                          color:style.color
                        }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
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
              borderRadius:12,
              border:"1px solid #14b8a6"
            }}>
              <h2 style={{ color:"#14b8a6" }}>
                {won ? "You got it!" : "Player Revealed"}
              </h2>
              <p><strong>{target.name}</strong></p>
              <button onClick={()=>setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}