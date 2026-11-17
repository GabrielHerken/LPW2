import { newUpgrades } from "./abilitiesManager.js";
import { playMusic } from "./audioManager.js";
import { createEnemy, enemies } from "./enemiesController.js";
import { characterDied, createGameObject } from "./gameController.js";
import { delay, Transform, Vector2 } from "./stdModule.js";
import { refreshStore } from "./storeManager.js";


class WaveBurst {
    constructor(type, quantity, interval) {
        this.type = type;
        this.quantity = quantity;
        this.interval = interval;
    }
}

class Wave {
    constructor(bursts) {
        this.bursts = bursts;

        let total = 0;
        bursts.forEach(burst => {
            if (burst.type != null) total += burst.quantity;
        })
        this.total = total;
    }
}

const waves = [
    new Wave([
        new WaveBurst(enemies.basicEnemy, 3, 1)
    ]),
    new Wave([
        new WaveBurst(enemies.basicEnemy, 7, .5)
    ]),
    new Wave([
        new WaveBurst(enemies.basicEnemy, 10, .2)
    ]),
    new Wave([
        new WaveBurst(enemies.finalBoss, 1, 1)
    ]),
    new Wave([
        new WaveBurst(enemies.basicEnemy, 15, .2)
    ]),
    new Wave([
        new WaveBurst(enemies.finalBoss, 1, 1),
        new WaveBurst(enemies.basicEnemy, 5, 0.4)
    ]),
    new Wave([
        new WaveBurst(enemies.basicEnemy, 10, .2),
        new WaveBurst(enemies.finalBoss, 2, 10)
    ])
];

let spawners = [];
let spawnerIndex = 0;
const spawnerSprite = new Image();
spawnerSprite.src = './sprites/portal.png';

let wave = 0;
let killedEnemies = 0;

const timers = { functions: [] };
let toStop = false;

const WAVES_PER_ABILITY = 1;
let wavesUntilAbilities = WAVES_PER_ABILITY;

export function pauseWaves() {
    timers.functions.forEach(timer => timer.pause());
}

export function resumeWaves() {
    timers.functions.forEach(timer => timer.resume());
}

export function stopWaves() {
    timers.functions.forEach(timer => timer.pause());
    timers.functions = [];
    toStop = true;
}

function nextWave() {
   
    killedEnemies = 0;

    (async () => {

        if (wavesUntilAbilities == 0) {
            setTimeout(() => newUpgrades(),1000);
            

            wavesUntilAbilities = WAVES_PER_ABILITY;
        }
        document.querySelector("#new-wave").style.display = "block";
        wavesUntilAbilities--;

        for (let i = 0; i < waves[wave].bursts.length; i++) {
            const burst = waves[wave].bursts[i];
            if (burst.type == null) {
                const res = await delay(burst.interval, timers);
                if (res) {
                    timers.functions.splice(timers.functions.indexOf(res), 1);
                } else {
                    break;
                }
            } else {
                spawnBurst(burst);
            }

            if (toStop) break;
        }
    })();
}

async function spawnBurst(burst) {
    for (let i = 0; i < burst.quantity; i++) {
        createEnemy(burst.type, spawners[spawnerIndex].globalTransform.position);
        spawnerIndex++;
        if (spawnerIndex == spawners.length) spawnerIndex = 0;

        const res = await delay(burst.interval, timers);
        if (res) {
            timers.functions.splice(timers.functions.indexOf(res), 1);
        } else {
            break;
        }
    }
}

export function startWaves() {

    wavesUntilAbilities = WAVES_PER_ABILITY
    toStop = false;
    wave = 0;
    spawners = [];
    const spawnSpawner = (minX, maxX) => {
        spawners.push(createGameObject(new Transform(new Vector2(Math.floor(minX + (maxX - minX) * Math.random()), 40)), Vector2.zero, spawnerSprite, 'objectsLayer', 'EnemySpawner'));
    }

    spawnSpawner(32, 84);
    spawnSpawner(116, 168);

    nextWave();
}

const tela = document.querySelector(".tela-conclusao");
const mensagem = document.querySelector("#mensagem-conclusao");
export function enemyKilled() {
    killedEnemies++;

    if (killedEnemies == waves[wave].total) {
        wave++;

        if (wave < waves.length) {
            nextWave();
            refreshStore();
        } else {
            document.querySelector("#botao-tentar-novamente").textContent = "Play again"
            mensagem.textContent = "Play again";
            tela.classList.remove("derrota");
            tela.classList.add("vitoria");
            mensagem.textContent = "You win!";
            tela.classList.add("ativa");
            playMusic("win", false);
        }
    }
}
