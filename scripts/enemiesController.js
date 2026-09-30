import { createGameObject } from "./gameController.js";
import { Entity, Transform, Vector2 } from "./stdModule.js";

class Enemy {
    constructor(spriteURL, maxHealth) {
        this.sprite = new Image();
        this.sprite.src = spriteURL;
        this.maxHealth = maxHealth
    }
}

const enemies = {
    basicEnemy: new Enemy('./sprites/inimigo.png', 20)
}

function createEnemy(position) {
    return new Entity(createGameObject(new Transform(position, 0), Vector2.zero, enemies.basicEnemy.sprite, 'entitiesLayer'), enemies.basicEnemy.maxHealth);
}

createEnemy(new Vector2(100, 40));
createEnemy(new Vector2(30, 30));
createEnemy(new Vector2(170, 30));