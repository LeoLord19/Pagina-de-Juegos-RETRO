const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Obtiene referencias a elementos en el archivo HTML (id="")
const StartGameBtn = document.querySelector("#start-game-button");
const Popup = document.querySelector("#popup");
const scoreEl = document.querySelector("#score");
const popupScore = document.querySelector("#popup-score");

//Establece la anchura y la altura del lienzo en la anchura y la altura interiores del navegador
canvas.width = innerWidth;
canvas.height = innerHeight;

//Crea una plantilla para las propiedades que debe tener un jugador
class Player {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}
}

//Crea una plantilla para las propiedades que debe tener un proyectil
class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}
	draw() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}

	update() {
		this.draw();
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
	}
}

//Crea una plantilla para las propiedades que deben tener los enemigos.
class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}
	draw() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.fillStyle = this.color;
		context.fill();
	}

	update() {
		this.draw();
		this.x = this.x + this.velocity.x;
		this.y = this.y + this.velocity.y;
	}
}

const x = canvas.width / 2;
const y = canvas.height / 2;

//Crear el jugador
const player = new Player(x, y, 10, "white");

//Creamos una serie de proyectiles y enemigos a los que añadiremos
var projectiles = [];
var enemies = [];

//Realizar un seguimiento de la puntuación del jugador (inicialmente en 0)
let score = 0;

var spawnEnemies;

//Actualiza continuamente la pantalla con animaciones
function animate() {
	animationId = requestAnimationFrame(animate);

	//Llena la pantalla con Color y dibuja el reproductor
	context.fillStyle = "rgba(0,0,0, 0.1)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	player.draw();

	//Por cada proyectil, comprueba si está fuera de la pantalla o choca con un enemigo
	projectiles.forEach((projectile, pidx) => {
		projectile.update();
		if (
			projectile.x + projectile.radius < 0 ||
			projectile.y + projectile.radius < 0 ||
			projectile.x - projectile.radius > canvas.width ||
			projectile.y - projectile.radius > canvas.height
		) {
			projectiles.splice(pidx, 1);
		}

		enemies.forEach((enemy, idx) => {
			const dist = Math.hypot(
				projectile.x - enemy.x,
				projectile.y - enemy.y
			);
			if (dist - enemy.radius - projectile.radius < 0.5) {
				if (enemy.radius - 10 > 10) {
					score += 100;
					scoreEl.innerHTML = score;
					enemy.radius -= 10;
				} else {
					score += 250;
					scoreEl.innerHTML = score;
					enemies.splice(idx, 1);
				}
				projectiles.splice(pidx, 1);
			}
		});
	});

	//Para cada enemigo, comprueba si está chocando con el jugador
	enemies.forEach((enemy) => {
		enemy.update();
		const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationId);
			clearInterval(spawnEnemies);
			popupScore.innerHTML = score;
			Popup.style.display = "flex";
		}
	});
}

StartGameBtn.addEventListener("click", () => {
	//Cierra el Popup resetea el proyectil, enemigos, y score
	Popup.style.display = "none";
	projectiles = [];
	enemies = [];
	score = 0;
	scoreEl.innerHTML = 0;

	//spawnea y mueve los enemigos
	animate();
	spawnEnemies = setInterval(() => {
		const radius = 15 * Math.random() + 10;

		let x;
		let y;

		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
			y = Math.random() * canvas.height;
		} else {
			x = Math.random() * canvas.width;
			y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
		}

		const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
		const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
		const velocity = {
			x: Math.cos(angle),
			y: Math.sin(angle),
		};
		enemies.push(new Enemy(x, y, radius, color, velocity));
	}, 1000);

	//Agregue un oyente para hacer clic para disparar proyectiles
	addEventListener("click", (event) => {
		const angle = Math.atan2(
			event.clientY - canvas.height / 2,
			event.clientX - canvas.width / 2
		);
		const velocity = {
			x: Math.cos(angle) * 5,
			y: Math.sin(angle) * 5,
		};
		projectiles.push(
			new Projectile(
				canvas.width / 2,
				canvas.height / 2,
				5,
				"white",
				velocity
			)
		);
	});
});
