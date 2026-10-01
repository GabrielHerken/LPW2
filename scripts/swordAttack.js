import { checkCollision, createCircleCollider } from "./collisionController.js";
import { createGameObject, gameObjectExists, removeGameObject } from "./gameController.js";
import { Attack, Entity, Transform, Vector2 } from "./stdModule.js";

//PROPERTIES

const spriteDistanceFromOwner = 30;
const gameObjectDuration = .25;
const maxCooldown = 0.5;
const damage = 10;
const colliders = [
    {
        position: Vector2.up.multiplicar(6),
        radius: 10
    },
    {
        position: Vector2.right.multiplicar(18).somar(Vector2.up.multiplicar(3)),
        radius: 10
    },
    {
        position: Vector2.right.multiplicar(-18).somar(Vector2.up.multiplicar(3)),
        radius: 10
    }
];

//ATTACK OBJECT

export function getSwordAttackObject(owner) {
    return new Attack(owner, swordAttack, maxCooldown);
}

//ATTACK EFFECT

const sprite = new Image();
sprite.src = './sprites/ataqueEspada.png';

function spawnGO(attackObject, direction) {
    const rotation = 90 + Math.atan2(direction.y, direction.x) * 180 / Math.PI;
    const gameObject = createGameObject(new Transform(direction.multiplicar(spriteDistanceFromOwner), rotation), Vector2.zero, sprite, 'attacksLayer', 'SwordAttack', attackObject.owner);

    colliders.forEach(collider => createCircleCollider(collider.position, collider.radius, gameObject));

    return gameObject;
}

function despawnGO(gameObject) {
    removeGameObject(gameObject);
}

function swordAttack(attackObject, direction, filter) {
    const gameObject = spawnGO(attackObject, direction);

    const hitted = [];
    gameObject.colliders.forEach(collider => {
        const collided = checkCollision(collider, filter == '' ? ['damageable'] : ['damageable', filter]);
        collided.forEach(collider => {if (hitted.indexOf(collider.owner) == -1) hitted.push(collider.owner)});
    })

    hitted.forEach(enemy => {
        enemy.getComponent(Entity).getHit(damage);
    });

    setTimeout(() => despawnGO(gameObject), gameObjectDuration * 1000);
}