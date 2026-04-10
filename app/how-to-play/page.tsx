export default function About() {
  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#0a0a0a",
        minHeight: "100vh",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      <h1>How to Play</h1>

      <p>
        The goal of PlayrIQ is to guess the former or current player based on various
        categories such as draft year, position, college team, and career stats.
        A random player is selected as the target.
      </p>

      <p>
        After each guess, results are revealed for each category. Numerical values
        (Age, Draft Year, Jersey Number, stats) will show:
      </p>

      <ul>
        <li><strong>Correct</strong> – exact match</li>
        <li><strong>Over</strong> – higher than target</li>
        <li><strong>Under</strong> – lower than target</li>
      </ul>

      <p>
        Close guesses are highlighted in yellow to indicate proximity.
      </p>

      <h2>Game Modes</h2>

      <h3>Daily Play</h3>
      <p>
        One player per day, same for all users. Track stats like streaks and
        average guesses.
      </p>

      <p style={{ color: "#facc15", fontWeight: "bold" }}>
        Future: multiple difficulties and multi-sport modes.
      </p>

      <h3>Challenge Mode</h3>
      <p>
        Customize your game and play multiple times per day.
      </p>

      <ul>
        <li>Choose single or multiple sports</li>
        <li>Select difficulty</li>
        <li>Pick categories</li>
        <li>Set number of guesses</li>
      </ul>
    </div>
  );
}