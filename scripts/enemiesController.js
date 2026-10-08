import { basicEnemyStartAI } from "./basicEnemyAI.js";
import { createCircleCollider } from "./collisionController.js";
import { createDrop } from "./dropManager.js";
import { createGameObject, removeGameObject } from "./gameController.js";
import { Entity, Transform, Vector2 } from "./stdModule.js";
import { enemyKilled } from "./wavesManager.js";

export class Enemy {
    constructor(name, spriteURL, maxHealth, startAI, minCash, maxCash) {
        this.name = name;
        this.sprite = new Image();
        this.sprite.src = spriteURL;
        this.maxHealth = maxHealth;
        this.startAI = startAI;
        this.minCash = minCash;
        this.maxCash = maxCash;
    }
}

export const enemies = {
    basicEnemy: new Enemy('Basic Enemy', './sprites/inimigo.png', 10, basicEnemyStartAI, 5, 10)
}

export function createEnemy(enemy, position) {
    const enemyGO = createGameObject(new Transform(position), Vector2.zero, enemy.sprite, 'entitiesLayer', enemy.name);
    const newEnemy = new Entity(enemyGO, enemy.maxHealth);

    enemyGO.addTag('damageable');
    enemyGO.addTag('enemy');

    enemyGO.addComponent(Entity, newEnemy);
    
    createCircleCollider(Vector2.zero, 32 / 2, enemyGO);

    const endAI = enemy.startAI(newEnemy);
    newEnemy.die = () => die(newEnemy, endAI, enemy);

    return newEnemy;
}

function die(enemy, endAI, enemyObj) {
    endAI();

    createDrop(enemy.gameObject.globalTransform.position, 'cash', Math.round(enemyObj.minCash + Math.random() * (enemyObj.maxCash - enemyObj.minCash)));
    
    removeGameObject(enemy.gameObject);

    enemyKilled();
}