//querySelectors, variables and arrays for the project
const spawnArea = document.querySelector(".asteroid-spawn");
const body = document.querySelector("body");

const startButton = document.querySelector("button");
const statsArea = document.querySelector(".stats");
const highScoreButton = document.querySelector("button:last-of-type");
const title = document.querySelector('h1');
const instructionsSection = document.querySelector('.instructions');
const instructionsPara = document.querySelector('p');
const header = document.querySelector('header');
const instructionsTitle = document.querySelector('h2');
const styles = [title, instructionsPara, instructionsTitle, highScoreButton, instructionsSection, startButton];
const asteroids = [];
let health = 5;
let score = 0;
let highScore = -Infinity;
let tracker = 0;

const removeIntervals = function() {
    clearInterval(makeInterval);
    clearInterval(moveInterval);
    clearInterval(scoreInterval);
    clearInterval(makeTracker);
    clearTimeout(makePause);

    body.removeEventListener("keydown", pause);
}

//Takes an asteroid object and removes from both the screen, and from the array
const removeAsteroid = function(ast) {
    ast.a.remove();
    asteroids.splice(asteroids.indexOf(ast), 1);
}

//Moves the asteroid and removes it if it hits
const moveAsteroid = function() {
    for (ast of asteroids) {
        //If the asteroid hits, remove it and take one from health
        if (ast.growth >= 500) {
            removeAsteroid(ast);
            health--;
            document.querySelector(".health").firstElementChild.textContent = health;

            //If you die, stop making asteroids and delete all of the existing ones, and stop iterating throught the array
            if (health <= 0) {
                removeIntervals();

                console.log("you died");
                for (a of asteroids) {
                    removeAsteroid(a);
                }

                if (score > highScore) {
                    highScore = score;
                }
            }
        //If the asteroid didn't hit, move the it
        } else {
            ast.height -= ast.velocity / 2 * ast.size;
            ast.size += ast.velocity * ast.size;
            ast.left -= ast.velocity / 2 * ast.size;
            ast.a.style.top = ast.height + "px";
            ast.a.style.width = ast.size + "px";
            ast.a.style.height = ast.size + "px";
            ast.a.style.left = ast.left + "px";
            ast.a.style.zIndex = ast.growth;
            ast.growth++;
        }
    }
}

//Makes an asteroid object, and adds it to the spawnArea and to an array
const makeAsteroid = function() {
    const rand = Math.random() * spawnArea.clientWidth;
    const rand2 = Math.random() * spawnArea.clientHeight;
    asteroid = {a: document.createElement("img"), height: rand2, velocity: .01, left: rand, size: 1, growth: 0};
    asteroid.a.setAttribute("src", "meteor.png");
    asteroid.a.style.width = 10 + "px";
    asteroid.a.style.height = 10 + "px";
    asteroid.a.style.borderRadius = "100%";
    asteroid.a.style.position = "absolute";
    asteroid.a.style.left = asteroid.left + "px";
    spawnArea.appendChild(asteroid.a);
    asteroids.push(asteroid);

    //Make it explode, then disappear when clicked
    const asteroidClick = (event) => {
        ast.a.setAttribute("src", "cosmic-explosion.jpg");
        ast.growth = ast.growth - 100;
        let bombTimer = setTimeout(() => {
            removeAsteroid(ast);
        }, 100);
    }
    const ast = asteroid;
    ast.a.addEventListener("mousedown", asteroidClick);
}

const pause = function(event) {
    if (event.key === " ") {
        removeIntervals();

        body.removeEventListener("keydown", pause);
        body.addEventListener("keydown", startIntervals);
    }
}

const startIntervals = function() {
  if (!event || event.key === " "){
      makeTracker = setInterval( () => {
          tracker++;

      if (tracker >= 1000) {
          tracker = 0;
      }
  }, 1);

  makePause = setTimeout( () => {
      makeAsteroid();

      makeInterval = setInterval( () => {
          makeAsteroid();
      }, 1000);
  }, tracker);

  moveInterval = setInterval( () => {
      moveAsteroid();
  }, 0);

  scoreInterval = setInterval( () => {
      score++;
      document.querySelector(".current-score").textContent = String(score).padStart(4, "0");
  }, 100);

  body.removeEventListener("keydown", startIntervals);
  body.addEventListener("keydown", pause);

  const healthInterval = setInterval( () =>{
    //If you die, stop making asteroids and delete all of the existing ones, and stop iterating throught the array
    if (health <= 0) {
      clearInterval(makeInterval);
      clearInterval(moveInterval);
      clearInterval(scoreInterval);
      console.log("you died");
      for (a of asteroids) {
          removeAsteroid(a);
      }
      for (index of styles) {
        index.style.color = "white";
      }
      header.style.zIndex = "10";
      startButton.style.border = "2px solid white";
      highScoreButton.style.border = "2px solid white";
      instructionsSection.style.border = "2px solid white";
      statsArea.style.color = "#00000000";
      instructionsTitle.textContent = "Your ship had been destroyed"
      instructionsPara.textContent = "You had a score of " + score + ". Good Job! \r\nWould you like to play again?";
      instructionsPara.style.whiteSpace = "pre-line";
      if (score > highScore) {
          highScore = score;

          document.querySelector(".high-score").textContent = String(highScore).padStart(4, "0");
      };
      clearInterval(healthInterval);
      startButton.addEventListener("click", startAgain => {
        console.log("I'm active");
      });
    };
  }, 0);
};

const startGame = function() {
    startIntervals();

    body.addEventListener("keydown", pause);
}

//Listener that starts game when start button is pressed
startButton.addEventListener("click", start => {
  startButton.removeEventListener("click", start);
  header.style.zIndex = "-10";
  for (index of styles) {
    index.style.color = "#00000000";
    index.style.border = "none";

  }

  statsArea.style.color = "white";
  startGame();
});
//startGame();
