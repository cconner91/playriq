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
            arrow: g < t ? "⬆" : "⬇"
          }
        }

        return {
          background: "#1f2937",
          color: "#9ca3af",
          arrow: g < t ? "⬆" : "⬇"
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
        <p style={{ textAlign: "center", fontSize: 16, color: "#ffffffff", marginBottom: 25 }}>
          Guess the player in 8 tries or less 
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#aaaaaacd", marginBottom: 8 }}>
          The attribute/statistic of each guess will be reflected with the following colors:
        </p>

        {/* LEGEND */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginBottom: 30,
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
              fontSize: 10,
              color: item.color
            }}>
              {item.text}
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div style={{ marginBottom: 16 }}>

          <div style={{ textAlign: "center", fontSize: 12, color: "#888", marginBottom: 6 }}>
            Select a League
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {[
              { name: "NFL", logo: "/nfl_logo.png", enabled: true },
              { name: "NBA", logo: "/nba_logo.png", enabled: false },
              { name: "MLB", logo: "/mlb_logo.png", enabled: false },

            
            ].map((league) => (
              <button
                key={league.name}
                onClick={() => league.enabled && setSelectedLeague(league.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background: 
                    selectedLeague === league.name ? "#14b8a6" : "transparent",
                  color: 
                    selectedLeague === league.name ? "#000" : "#14b8a6",
                  opacity: league.enabled ? 1 : 0.5,
                  cursor: league.enabled ? "pointer" : "not-allowed",
                  fontWeight: 600
                }}
              >
                <img src={league.logo} style={{ width: 16, height: 16 }} />
                  {league.name}
                  {!league.enabled && (
                  <span style={{ fontSize: 10, marginLeft: 4 }}>
                  </span>
                    )}
            </button>
            ))}
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: "#888", margin: "10px 0 6px" }}>
            Choose Difficulty
          </div>

          <div
          style={{
          position: "relative", // 🔥 enables absolute positioning
          margin: "16px 0"
            }}
          >

  {/* Difficulty Buttons (centered, untouched) */}
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap"
    }}
  >
    {[1, 2, 3].map((d) => (
      <button
        key={d}
        onClick={() => setSelectedDifficulty(d)}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #14b8a6",
          background:
            selectedDifficulty === d ? "#14b8a6" : "transparent",
          color:
            selectedDifficulty === d ? "#000" : "#14b8a6",
          fontWeight: 600
        }}
      >
        {d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard"}
      </button>
    ))}
  </div>
  </div>

  {/* Give Up (independent position) */}
  <button
    onClick={() => {
      const confirmed = confirm("Are you sure you want to give up?")
      if (!confirmed) return

      setGameOver(true)
      setShowModal(true)
    }}
    style={{
      position: "relative",
      maxWidth: 400,
      margin: "16px auto",
      top: "50%",
      transform: "translateY(-50%)",

      padding: "14px 16px", 
      borderRadius: 10,
      border: "1px solid #727272ff",
      background: "#c76a64ff",
      color: "#ffffffff",
      fontWeight: 600
    }}
  >
    Give Up 😩
  </button>
</div>
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
        {/* TABLE */}
        <div style={{ width: "100%", overflowX: "auto" }}>
  <table
    style={{
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "6px 10px",
      tableLayout: "fixed"
    }}
  >
    <thead>
      <tr>
        {[
          { label: "Player", width: "30%" },
          { label: "Team", width: "10%" },
          { label: "Position", width: "8%" },
          { label: "Age", width: "9%" },
          { label: "College", width: "13%" },
          { label: "Draft Year", width: "9%" },
          { label: "Draft Pick", width: "9%" },
          { label: "Jersey #", width: "9%" }
        ].map((col) => (
          <th
            key={col.label}
            style={{
              width: col.width,
              fontSize: 12,
              color: "#14b8a6",
              textAlign: "center",
              padding: "4px 6px"
            }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {[...Array(8)].map((_, i) => {
        const player = guesses[i]

        const values = [
          player?.name,
          player?.team,
          player?.position?.[0],
          player?.age,
          player?.college.split(";").pop().trim(),
          player?.draftYear,
          player?.draftPick,
          player?.jersey_number
        ]

        return (
          <tr key={i}>
            {values.map((val, idx) => {
              const key = [
                "name",
                "position",
                "team",
                "age",
                "college",
                "draftPick",
                "draftYear",
                "jersey_number"
              ][idx]

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
                  borderRadius: 10,

            // 🔥 THIS is what actually increases height
                height: 80,
                minHeight: 80,

            // spacing inside the cell
                padding: idx === 0 ? "16px 12px" : "14px 8px",

                fontSize: idx === 0 ? 16 : 13,
                lineHeight: 1.3,

                verticalAlign: "middle"
                  }}
                  >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative"
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: idx === 0 ? "normal" : "nowrap"
                      }}
                    >
                      {val}
                    </span>

                    {style.arrow && (
                      <span 
                        style={{
                          position: "absolute",
                          right: 6,
                          fontSize: 14,
                          lineHeight: 1,
                          display: "flex",
                          alignItems: "center"
                        }}
                        >

                        {style.arrow}
                      </span>
                    )}
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