import { basicEnemyStartAI } from "./basicEnemyAI.js";
import { createCircleCollider } from "./collisionController.js";
import { createGameObject, removeGameObject } from "./gameController.js";
import { Entity, Transform, Vector2 } from "./stdModule.js";

class Enemy {
    constructor(name, spriteURL, maxHealth, startAI) {
        this.name = name;
        this.sprite = new Image();
        this.sprite.src = spriteURL;
        this.maxHealth = maxHealth;
        this.startAI = startAI;
    }
}

const enemies = {
    basicEnemy: new Enemy('Basic Enemy', './sprites/inimigo.png', 20, basicEnemyStartAI)
}

function createEnemy(enemy, position) {
    const enemyGO = createGameObject(new Transform(position), Vector2.zero, enemy.sprite, 'entitiesLayer', enemy.name);
    const newEnemy = new Entity(enemyGO, enemy.maxHealth);

    enemyGO.addTag('damageable');
    enemyGO.addTag('enemy');

    enemyGO.addComponent(Entity, newEnemy);
    
    createCircleCollider(Vector2.zero, 32 / 2, enemyGO);

    const endAI = enemy.startAI(newEnemy);
    newEnemy.die = () => die(newEnemy, endAI);

    return newEnemy;
}

function die(enemy, endAI) {
    endAI();

    removeGameObject(enemy.gameObject);
}

export function start() {
    createEnemy(enemies.basicEnemy, new Vector2(100, 30));
    createEnemy(enemies.basicEnemy, new Vector2(30, 30));
    createEnemy(enemies.basicEnemy, new Vector2(170, 30));
}