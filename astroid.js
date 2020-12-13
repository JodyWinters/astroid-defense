//querySelectors for the project
const spawnArea = document.querySelector(".asteroid-spawn");
const body = document.querySelector("body");
const healthDisplay = document.querySelector(".health").firstElementChild;
const startButton = document.querySelector("button");
const statsArea = document.querySelector(".stats");
const highScoreButton = document.querySelector("button:last-of-type");
const title = document.querySelector('h1');
const instructionsSection = document.querySelector('.instructions');
const instructionsPara = document.querySelector('p');
const header = document.querySelector('header');
const instructionsTitle = document.querySelector('h2');
const scoreList = document.querySelector('.scoreList');
const places = document.querySelector('.placement');
const names = document.querySelector('.names');
const highScores = document.querySelector('.highScores');
const powerup = document.querySelector(".powerup");
const powerupLevelDisplay = powerup.firstElementChild;

let playerName = "";
let scoreTrade = 0;
let nameTrade = "";

//Various array used
const styles = [title, instructionsPara, instructionsTitle, highScoreButton, instructionsSection, startButton];
const asteroids = [];
const scorePlacement = [score1 = {score: 0, name: "???", number: "1st"},  score2 = {score: 0, name: "???", number: "2nd"}, score3 = {score: 0, name: "???", number: "3rd"}, score4 = {score: 0, name: "???", number: "4th"}, score5 = {score: 0, name: "???", number: "5th"}];

//Various variables used
let health = 5;
let score = 0;
let highScore = -Infinity;
let tracker = 0;
const startSpawnRate = 1000;
let spawnRate = startSpawnRate;
let spawnRateChange = 6;
let gameStop = false;
let blinkCounter = 0;
let shakeCounter = 0;
let onScoreScreen = false;
let powerupLevel = 0;
let powerupMax = false;
let powerupActivate = false;

//Preventing the images from being dragged
window.ondragstart = function() {
  return false;
};

const scoreBoardChange = function() {
  for (lines of scorePlacement) {
    if (score > lines.score) {
      scoreTrade = lines.score;
      lines.score = score;
      score = scoreTrade;

      nameTrade = lines.name;
      lines.name = playerName;
      playerName = nameTrade;
    };
  };
};

const removeIntervals = function() {
    clearInterval(moveInterval);
    clearInterval(scoreInterval);
    clearTimeout(makePause);
    gameStop = true;
}

//Takes an asteroid object and removes from both the screen, and from the array
const removeAsteroid = function(ast) {
    ast.a.remove();
    asteroids.splice(asteroids.indexOf(ast), 1);
}

const borderBlink = function() {
    blinkCounter++;
    body.style.border = "10px solid rgb(255, 0, 0, 0.6)";
    setTimeout( () => {
        body.style.border = "none";

        setTimeout( () => {
            if (blinkCounter < 2) {
                borderBlink();
            } else {
                blinkCounter = 0;
            }
        }, 100);
    }, 100);
}

const screenShake = function() {
    shakeCounter++;
    statsArea.style.left = "1vw";
    setTimeout( () => {
        statsArea.style.left = "2vw";

        setTimeout( () => {
            if (shakeCounter < 10) {
                screenShake();
            } else {
                shakeCounter = 0;
            }
        }, 10);
    }, 10);
}

//Moves the asteroid and removes it if it hits
const moveAsteroid = function() {
    for (ast of asteroids) {
        //If the asteroid hits, remove it and take one from health
        if (ast.growth >= 500) {
            removeAsteroid(ast);
            health--;
            healthDisplay.textContent = health;
            borderBlink();
            screenShake();

        //If the asteroid didn't hit, move it
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

//Make the asteroid explode, then disappear
asteroidClick = function(ast) {
    ast.a.setAttribute("src", "cosmic-explosion.jpg");
    ast.growth = ast.growth - 100;

    if (!powerupMax) {
        powerupLevel += 2;
        powerupLevelDisplay.style.width = powerupLevel + "%";

        if (powerupLevel >= 100) {
            powerupMax = true;

            body.addEventListener("keydown", checkKeyPower);
        }
    }

    let bombTimer = setTimeout(() => {
        removeAsteroid(ast);
    }, 100);
}

const checkKeyPower = function (event) {
    if (event.key === "Enter") {
        body.removeEventListener("keydown", checkKeyPower);
        event.preventDefault();

        for (ast of asteroids) {
            asteroidClick(ast);
        }
        powerupActivate = true;
        setTimeout( () => {
            powerupActivate = false;
            powerupLevelDisplay.style.width = "0";
            powerupLevel = 0;
            powerupMax = false;
        }, 1000);
    }
}

//Repeatedly makes an asteroid object, and adds it to the spawnArea and to an array
const makeAsteroid = function() {
    spawnRate -= spawnRateChange;
    spawnRateChange *= 0.99;

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

    const ast = asteroid;

    if (powerupActivate) {
        setTimeout( () => {
            asteroidClick(ast);
        }, 1000);
    }

    ast.a.addEventListener("mousedown", () => {
        asteroidClick(ast);
    });

    //Unless the game is paused or ended, make another asteroid after a set amount of time
    setTimeout( () => {
        if (!gameStop) {
            makeAsteroid();
        }
    }, spawnRate);
};

const startIntervals = function() {
    gameStop = false;
    body.addEventListener("keydown", checkKeyPause);

    makeTracker = setInterval( () => {
        tracker++;

        if (tracker >= 1000) {
            tracker = 0;
        }
    }, 1);

  makePause = setTimeout( () => {
    makeAsteroid();
  }, tracker);

  moveInterval = setInterval( () => {
      moveAsteroid();
  }, 0);

  scoreInterval = setInterval( () => {
      score++;
      document.querySelector(".current-score").textContent = String(score).padStart(4, "0");
  }, 100);

  const healthInterval = setInterval( () =>{
      if (gameStop) {
          clearInterval(healthInterval);
      }
    //If you die, stop making asteroids and delete all of the existing ones, and stop iterating throught the array
    if (health <= 0) {
        body.removeEventListener("keydown", checkKeyPause);
      removeIntervals();
      clearInterval(healthInterval);
      //remove image of asteroid and then remove asteroid object from array
      for (image of asteroids) {
        image.a.remove();
      };
      let iteration = asteroids.length;
      for (let count = 0; count < iteration; count++) {
        asteroids.splice(asteroids[0], 1);
      };
      //Bringing the title screen back with new message

      header.style.zIndex = "10";
      startButton.style.border = "2px solid white";
      highScoreButton.style.border = "2px solid white";
      instructionsSection.style.border = "2px solid white";
      statsArea.style.color = "#00000000";
      instructionsTitle.textContent = "Your ship has been destroyed"
      instructionsPara.textContent = "You had a score of " + score + ". Good Job! \r\nWould you like to play again?";
      highScoreButton.textContent = "HIGH SCORES";
      instructionsPara.style.whiteSpace = "pre-line";
      onScoreScreen = false;
      powerupLevel = 0;
      powerupLevelDisplay.style.width = 0;
      if (score > highScore) {
          highScore = score;

          document.querySelector(".high-score").textContent = String(highScore).padStart(4, "0");
      };
      for (index of styles) {
        index.style.color = "white";
      };
      setTimeout( () => {
        if (score > scorePlacement[4].score) {
          playerName = prompt("Insert a name for the score board!(Under 10 characters)");
          if (!playerName) {
            playerName = "The Guy";
          }
          while (playerName.length > 9) {
            playerName = prompt("Please use a smaller name.");
            if (!playerName) {
              playerName = "The Guy";
            };
          };
        };
        scoreBoardChange();
      }, 400);

      clearInterval(healthInterval);
      highScoreButton.addEventListener("click", swap = () => {
        highScoreButton.removeEventListener("click", swap);
        highScorePress();
      });

      //allows start button to be pressed again to try again
      startButton.addEventListener("click", startAgain = () => {
        startButton.removeEventListener("click", startAgain);
        header.style.zIndex = "-10";
        highScoreButton.style.border = "none";
        startButton.style.border = "none";
        instructionsSection.style.border = "none";
        for (index of styles) {
          index.style.color = "#00000000";
        };
        health = 5;
        healthDisplay.textContent = health;
        scoreList.style.color = "#00000000";
        score = 0;
        tracker = 0;
        statsArea.style.color = "white";
        powerup.style.display = "block";
        removeIntervals();
        gameStop = false;
        spawnRate = startSpawnRate;
        startGame();
      });
    };
  }, 0);
};

const highScorePress = function() {
  onScoreScreen = true;
  scoreList.style.color = "white";
  instructionsPara.style.color = "#00000000";
  instructionsTitle.textContent = "HIGH SCORES";
  highScoreButton.textContent = "RETURN";
  for (items of scorePlacement) {
    let placement = document.createElement("li");
    places.appendChild(placement);
    placement.textContent = items.number;
  };
  for (items of scorePlacement) {
    let userName = document.createElement("li");
    names.appendChild(userName);
    userName.textContent = items.name;
  };
  for (items of scorePlacement) {
    let userScores = document.createElement("li");
    highScores.appendChild(userScores);
    userScores.textContent = items.score;
  };
  highScoreButton.addEventListener("click", returnTo = () => {
    highScoreButton.removeEventListener("click", returnTo);
    returnButton();
  });
};

const returnButton = function() {
  onScoreScreen = false;
  for (let count = 0; count < 15; count++) {
    let thing = document.querySelector('li');
    thing.remove();
  };
  instructionsPara.style.color = "white";
  instructionsPara.textContent = "Your goal is to destroy all of the asteroids before they can harm your ship. Click on an asteroid with your mouse to destroy them. When your health reaches 0, it's game over. Press the space bar to pause, and press the enter key to activate the powerup. \r\nGood luck and have fun!";
  highScoreButton.textContent = "HIGH SCORE";
  instructionsTitle.textContent = "INSTRUCTIONS";

  highScoreButton.addEventListener("click", swap = () => {
    highScoreButton.removeEventListener("click", swap);
    highScorePress();
  });
};

const checkKeyPause = function(event) {
    if (event.key === " ") {
        body.removeEventListener("keydown", checkKeyPause);
        pause();
    }
}

const checkKeyResume = function(event) {
    if (event.key === " ") {
        body.removeEventListener("keydown", checkKeyResume);
        startIntervals();
    }
}

const pause = function() {
    removeIntervals();
    body.addEventListener("keydown", checkKeyResume);
}

const startGame = function() {
  if (onScoreScreen === true) {
    highScoreButton.removeEventListener("click", returnTo);
    for (let count = 0; count < 15; count++) {
      let thing = document.querySelector('li');
      thing.remove();
    };
  } else {
    highScoreButton.removeEventListener("click", swap);
  };
    startIntervals();
};

highScoreButton.addEventListener("click", swap = () => {
  highScoreButton.removeEventListener("click", swap);
  highScorePress();
});

//Listener that starts game when start button is pressed
startButton.addEventListener("click", start = () => {
  startButton.removeEventListener("click", start);
  header.style.zIndex = "-10";
  powerup.style.display = "block";
  for (index of styles) {
    index.style.color = "#00000000";
    index.style.border = "none";

  };
  scoreList.style.color = "#00000000";
  statsArea.style.color = "white";
  startGame();
});

//Keeps the score and health up to date when the game is paused
setInterval( () => {
    tracker = tracker;
    health = health;
    score = score;
}, 0);
