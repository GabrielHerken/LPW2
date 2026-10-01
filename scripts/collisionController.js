import { CircleCollider, GameObject, Transform, Vector2 } from "./stdModule.js";
import { createGameObject, removeGameObject } from './gameController.js';

const allColiders = [];
const showColliders = false;
const circleColliderSprite = new Image();
circleColliderSprite.src = './sprites/circleCollider.png';

export function createCircleCollider(position, radius, owner) {
    const collider = new CircleCollider(position, radius, owner);
    allColiders.push(collider);

    owner.colliders.push(collider);

    if (showColliders)
        createGameObject(new Transform(position, 0, Vector2.one.multiplicar(radius / 64)), Vector2.zero, circleColliderSprite, 'overlayLayer', 'CircleCollider', owner);

    return collider;
}

export function removeCollider(collider) {
    allColiders.splice(allColiders.indexOf(collider), 1);
}

function checkCircleCircleCollision(collider1, collider2) {
    return Math.pow(collider1.position.x - collider2.position.x, 2) + Math.pow(collider1.position.y - collider2.position.y, 2) <= Math.pow(collider1.radius + collider2.radius, 2);
}

export function checkCollision(collider) {
    const collidersPassed = [];

    if (typeof(collider) == CircleCollider) {
        allColiders.forEach(otherCollider => {
            if (typeof(otherCollider) == CircleCollider) if (checkCircleCircleCollision(collider, otherCollider)) collidersPassed.push(otherCollider);
        })
    }

    return collidersPassed;
}