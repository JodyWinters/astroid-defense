const spawnArea = document.querySelector(".asteroid-spawn");

const asteroids = [];

const moveasteroid = function() {
    for (ast of asteroids) {
        if (ast.growth >= 1100) {
            ast.a.remove();
            asteroids.splice(asteroids.indexOf(ast), 1);
        }else {
            ast.height -= ast.velocity / 2 * ast.size;
            ast.size += ast.velocity * ast.size;
            ast.left -= ast.velocity / 2 * ast.size;
            ast.a.style.top = ast.height + "px";
            ast.a.style.width = ast.size + "px";
            ast.a.style.height = ast.size + "px";
            ast.a.style.left = ast.left + "px";
            ast.a.style.zIndex = ast.growth;
            ast.growth++;
            if (ast.listener === "false") {
              ast.a.addEventListener("click", destroy = () => {
                asteroids.splice(asteroids.indexOf(ast), 1);
                ast.a.remove();
                ast.a.removeEventListener("click", destroy);
              });
              ast.listener = "true";

            }
        }
    }
}

const makeAsteroid = function() {
    const rand = Math.random() * spawnArea.clientWidth;
    const rand2 = Math.random() * spawnArea.clientHeight;
    asteroid = {a: document.createElement("img"), listener: "false", height: rand2, velocity: .005, left: rand, size: 1, growth: 0};
    asteroid.a.setAttribute("src", "meteor.png");
    asteroid.a.style.width = 10 + "px";
    asteroid.a.style.height = 10 + "px";
    asteroid.a.style.borderRadius = "100%";
    asteroid.a.style.position = "absolute";
    asteroid.a.style.left = asteroid.left + "px";
    spawnArea.appendChild(asteroid.a);
    asteroids.push(asteroid);
}

makeAsteroid();

setInterval( () => {
    makeAsteroid();
}, 10000)

setInterval( () => {
    moveasteroid();
}, 30);
