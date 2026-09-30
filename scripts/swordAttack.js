import { createGameObject, gameObjectExists, removeGameObject } from "./gameController.js";
import { Attack, Vector2 } from "./stdModule.js";

//PROPERTIES

const spriteDistanceFromOwner = 30;
const gameObjectDuration = .25;
const maxCooldown = 0.5;

//ATTACK OBJECT

export function getSwordAttackObject(owner) {
    return new Attack(owner, swordAttack, maxCooldown);
}

//ATTACK EFFECT

const sprite = new Image();
sprite.src = './sprites/ataqueEspada.png';

function spawnGO(attackObject, direction) {
    const position = attackObject.owner.position.somar(direction.multiplicar(spriteDistanceFromOwner));
    const rotation = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
    
    return createGameObject(position, Vector2.zero, rotation, sprite, 'attacksLayer');
}

function despawnGO(gameObject) {
    removeGameObject(gameObject);
}

function swordAttack(attackObject, direction) {
    const gameObject = spawnGO(attackObject, direction);

    setTimeout(() => despawnGO(gameObject), gameObjectDuration * 1000);
}