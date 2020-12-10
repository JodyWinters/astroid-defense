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

//Preventing the images from being dragged
window.ondragstart = function() {
  return false;
};

const removeIntervals = function() {
    clearInterval(moveInterval);
    clearInterval(scoreInterval);
    clearTimeout(makePause);
    gameStop = true;
    body.removeEventListener("keydown", removeIntervals);
    setTimeout( () => {
        body.addEventListener("keydown", startIntervals);
    }, 100);
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

    //Unless the game is paused or ended, make another asteroid after a set amount of time
    setTimeout( () => {
        if (!gameStop) {
            makeAsteroid();
        }
    }, spawnRate);
};

const startIntervals = function() {
    if (!event || event.key === " "){
        makeTracker = setInterval( () => {
            tracker++;

            if (tracker >= 1000) {
                tracker = 0;
            }
        }, 1);
    }

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

  body.removeEventListener("keydown", startIntervals);
  setTimeout( () => {
      body.addEventListener("keydown", removeIntervals);
  }, 1000);

  const healthInterval = setInterval( () =>{
    //If you die, stop making asteroids and delete all of the existing ones, and stop iterating throught the array
    if (health <= 0) {
      removeIntervals();
      //remove image of asteroid and then remove asteroid object from array
      for (image of asteroids) {
        image.a.remove();
      };
      let iteration = asteroids.length;
      for (let count = 0; count < iteration; count++) {
        asteroids.splice(asteroids[0], 1);
      };

      //Bringing the title screen back with new message
      for (index of styles) {
        index.style.color = "white";
      };

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
      if (score > highScore) {
          highScore = score;

          document.querySelector(".high-score").textContent = String(highScore).padStart(4, "0");
      };
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
  instructionsPara.textContent = "Your goal is to destroy all of the asteroids before they can harm your ship. Click on an asteroid with your mouse to destroy them. When your health reaches 0, it's game over. Press the space bar to pause. \r\nGood luck and have fun!";
  highScoreButton.textContent = "HIGH SCORE";
  instructionsTitle.textContent = "INSTRUCTIONS";

  highScoreButton.addEventListener("click", swap = () => {
    highScoreButton.removeEventListener("click", swap);
    highScorePress();
  });
};

const startGame = function() {
  if (onScoreScreen === true) {
    console.log("if ran");
    highScoreButton.removeEventListener("click", returnTo);
    for (let count = 0; count < 15; count++) {
      let thing = document.querySelector('li');
      thing.remove();
    };
  } else {
    console.log("else ran");
    highScoreButton.removeEventListener("click", swap);
  };
    startIntervals();
//    body.addEventListener("keydown", pause);
};

highScoreButton.addEventListener("click", swap = () => {
  highScoreButton.removeEventListener("click", swap);
  highScorePress();
});

//Listener that starts game when start button is pressed
startButton.addEventListener("click", start = () => {
  startButton.removeEventListener("click", start);
  header.style.zIndex = "-10";
  for (index of styles) {
    index.style.color = "#00000000";
    index.style.border = "none";

  };
  scoreList.style.color = "#00000000";
  statsArea.style.color = "white";
  startGame();
});
//startGame();
