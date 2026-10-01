import { createCircleCollider } from "./collisionController.js";
import { createGameObject, removeGameObject } from "./gameController.js";
import { Entity, Transform, Vector2 } from "./stdModule.js";

class Enemy {
    constructor(name, spriteURL, maxHealth) {
        this.name = name;
        this.sprite = new Image();
        this.sprite.src = spriteURL;
        this.maxHealth = maxHealth
    }
}

const enemies = {
    basicEnemy: new Enemy('Basic Enemy', './sprites/inimigo.png', 20)
}

function createEnemy(enemy, position) {
    const enemyGO = createGameObject(new Transform(position), Vector2.zero, enemy.sprite, 'entitiesLayer', enemy.name);
    const newEnemy = new Entity(enemyGO, enemy.maxHealth);

    enemyGO.addTag('damageable');
    enemyGO.addTag('enemy');

    enemyGO.addComponent(Entity, newEnemy);
    
    enemyGO.colliders.push(createCircleCollider(Vector2.zero, 32 / 2, enemyGO));

    newEnemy.die = () => die(newEnemy);

    return newEnemy;
}

function die(enemy) {
    removeGameObject(enemy.gameObject);
}

createEnemy(enemies.basicEnemy, new Vector2(100, 40));
createEnemy(enemies.basicEnemy, new Vector2(30, 30));
createEnemy(enemies.basicEnemy, new Vector2(170, 30));