import { createEnemy, enemies } from "./enemiesController.js";
import { createGameObject } from "./gameController.js";
import { delay, Transform, Vector2 } from "./stdModule.js";

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
        new WaveBurst(enemies.basicEnemy, 10, 1)
    ]),
    new Wave([
        new WaveBurst(enemies.basicEnemy, 20, .5)
    ])
];

let spawners = [];
let spawnerIndex = 0;
const spawnerSprite = new Image();
spawnerSprite.src = './sprites/portal.png';

let wave = 0;
let killedEnemies = 0;

const stops = { functions: [] };
let toStop = false;

export function stopWaves() {
    stops.functions.forEach(stop => stop());
    stops.functions = [];
    toStop = true;
}

function nextWave() {
    killedEnemies = 0;

    (async () => {
        for (let i=0; i<waves[wave].bursts.length; i++) {
            const burst = waves[wave].bursts[i];
            if (burst.type == null) {
                const res = await delay(burst.interval, stops);
                if (res) {
                    stops.functions.splice(stops.functions.indexOf(res), 1);
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
    for (let i=0; i<burst.quantity; i++) {
        createEnemy(burst.type, spawners[spawnerIndex].globalTransform.position);
        spawnerIndex++;
        if (spawnerIndex == spawners.length) spawnerIndex = 0;

        const res = await delay(burst.interval, stops);
        if (res) {
            stops.functions.splice(stops.functions.indexOf(res), 1);
        } else {
            break;
        }
    }
}

export function startWaves() {
    toStop = false;
    wave = 0;
    spawners = [];
    const spawnSpawner = (minX, maxX) => {
        spawners.push(createGameObject(new Transform(new Vector2(Math.floor(minX + (maxX - minX) * Math.random()), 30)), Vector2.zero, spawnerSprite, 'objectsLayer', 'EnemySpawner'));
    }

    spawnSpawner(16, 84);
    spawnSpawner(116, 184);

    nextWave();
}

export function enemyKilled() {
    killedEnemies++;

    if (killedEnemies == waves[wave].total) {
        wave++;

        if (wave < waves.length) {
            nextWave();
        } else {
            console.log('cabô');
        }
    }
}