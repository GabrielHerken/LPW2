import { CircleCollider, GameObject, Transform, Vector2 } from "./stdModule.js";
import { createGameObject, removeGameObject } from './gameController.js';

const allColiders = [];
const showColliders = false;
const circleColliderSprite = new Image();
circleColliderSprite.src = './sprites/circleCollider.png';

export function createCircleCollider(position, radius, owner) {
    const collider = new CircleCollider(new Transform(position), radius, owner);
    allColiders.push(collider);

    owner.colliders.push(collider);

    if (showColliders)
        createGameObject(new Transform(position, 0, Vector2.one.multiplicar(2 * radius / 64)), Vector2.zero, circleColliderSprite, 'overlayLayer', 'CircleCollider', owner);

    return collider;
}

export function removeCollider(collider) {
    allColiders.splice(allColiders.indexOf(collider), 1);
}

function checkCircleCircleCollision(collider1, collider2, filter) {
    if (collider1 == collider2) return false;
    let toReturn;
    filter.forEach(filterTag => {
        const index = collider2.owner.tags.indexOf(filterTag);

        if ((filterTag[0] == '!' && index != -1) || (filterTag[0] != '!' && index == -1)) {
            toReturn = true;
            return;
        }
    });
    if (toReturn) return false;

    return collider1.globalTransform.position.checkDistance(collider2.globalTransform.position, collider1.radius + collider2.radius);
}

export function checkCollision(collider, filter=[]) {
    const collidersPassed = [];

    if (collider instanceof CircleCollider) {
        allColiders.forEach(otherCollider => {
            if (otherCollider instanceof CircleCollider) if (checkCircleCircleCollision(collider, otherCollider, filter)) collidersPassed.push(otherCollider);
        })
    }

    return collidersPassed;
}