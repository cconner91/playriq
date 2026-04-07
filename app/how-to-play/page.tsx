export default function About() {
  return (
    <div style={{ padding: 20, color: "white", background: "#0a0a0a", minHeight: "100vh" }}>
      <h1>How to Play</h1>
      <p>The goal of PlayrIQ is to guess the former or current player based on various categories which include an 
        assortment of player’s personal attributes such as the year they were drafted, their position, their college team 
        and then various player career statistical categories . Using a player pool randomizer, PlayrIQ will determine the 
        target player.</p>
        
    <p> A user will guess a player in the specific sport mode (NFL, NBA, MLB) they’re playing.  

        Upon that guess, PlayrIQ will reveal results for each category. There will be numerical categories 
        such as Age, Draft Year, Jersey Number, and the various statistical categories. These numerical 
        categories will reveal an Over, Under or Correct referencing the values of the target player. 
        If the guess is within a threshold, it will also render a yellow highlight over that particular category 
        box indicating that the guessed player’s attribute is “close” to the target player’s attribute. </p>


       <h2>##PlayrIQ has two game modes:</h2>

    <h3>Daily Play:</h3>
        <p> PlayrIQ will have a target player selected once per day which will be the same for all users 
        which is in The Daily Play Center. This game will contain the same categories and amount of guesses for all users. 
        Users will be able to retain their statistics which include streaks, average number of guesses, success rates etc…</p>
        
        <p>***** EVENTUALLY WE WILL HAVE MULTIPLE DAILY MODES INCLUDING 4 DIFFICULTY RATINGS and DIFFERENT SPORTS INCLUDING MULTI SPORT</p>

   <h3>##Challenge Mode:</h3> 
    <p>PlayrIQ’s ‘Challenge Mode’ allows users to customize their game settings and challenge other users. 
        In Challenge Mode users can play multiple times per day.</p>

        <p>In Challenge Mode, users may also customize their game settings, choosing a single 
            sport (or a unique combination of sports e.g. MLB & NBA or NFL, MLB & NBA).</p>
            
        <p>They may also customize the difficulty, the categories to be used, and the number of guesses allowed for 
            that game. .</p>
    </div>
  )
}