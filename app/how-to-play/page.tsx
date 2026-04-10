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
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
        How to Play
      </h1>

      <p style={{ marginBottom: "16px" }}>
        The goal of PlayrIQ is to guess the former or current player based on various
        categories such as draft year, position, college team, and career stats.
        A random player is selected as the target.
      </p>
      <p style={{ marginBottom: "16px" }}>
        You will first need to select a league and a difficulty setting. Once you do this, a "target player"
        is generated through a randomizer.
      </p>
      <p style={{ marginBottom: "16px" }}>
        Make your first player guess by typing their name into the search bar
      </p>

      <p style={{ marginBottom: "16px" }}>
        After each guess, results are revealed for each category. Numerical values such as
        (Age, Draft Year, Jersey Number, stats) will show:
      </p>

      <ul style={{ marginBottom: "16px", paddingLeft: "20px" }}>
        <li><strong>Correct</strong> – exact match</li>
        <li><strong>Over</strong> – higher than target</li>
        <li><strong>Under</strong> – lower than target</li>
      </ul>

      <p style={{ marginBottom: "24px" }}>
        Close guesses are highlighted in yellow to indicate proximity to that of the "target player".
        You will need to utilize this information in order to make an educated guess on who that "target player" is. 
      </p>

      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "12px" }}>
        Game Modes
      </h2>

      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
        Daily Play
      </h3>

      <p style={{ marginBottom: "16px" }}>
        One player per day, same for all users. Track stats like streaks and
        average guesses.
      </p>

      <p style={{ color: "#facc15", fontWeight: "bold", marginBottom: "24px" }}>
        Future: multiple difficulties and multi-sport modes.
      </p>

      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
        Challenge Mode
      </h3>

      <p style={{ marginBottom: "16px" }}>
        Customize your game and play multiple times per day.
      </p>

      <ul style={{ paddingLeft: "20px" }}>
        <li>Choose single or multiple sports</li>
        <li>Select difficulty</li>
        <li>Pick categories</li>
        <li>Set number of guesses</li>
      </ul>
    </div>
  );
}