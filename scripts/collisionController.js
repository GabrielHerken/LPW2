import { CircleCollider, clamp, GameObject, RectCollider, Transform, Vector2 } from "./stdModule.js";
import { createGameObject, removeGameObject } from './gameController.js';

const allColiders = [];
const showColliders = false;
const circleColliderSprite = new Image();
circleColliderSprite.src = './sprites/circleCollider.png';
const rectColliderSprite = new Image();
rectColliderSprite.src = './sprites/rectCollider.png';

export function createCircleCollider(position, radius, owner) {
    const collider = new CircleCollider(new Transform(position), radius, owner);
    allColiders.push(collider);

    owner.colliders.push(collider);

    if (showColliders)
        createGameObject(new Transform(position, 0, Vector2.one.multiplicar(2 * radius / 64)), Vector2.zero, circleColliderSprite, 'overlayLayer', 'CircleCollider', owner);

    return collider;
}

export function createRectCollider(position, width, height, owner) {
    const collider = new RectCollider(new Transform(position), width, height, owner);
    allColiders.push(collider);

    owner.colliders.push(collider);

    if (showColliders)
        createGameObject(new Transform(position, 0, new Vector2(width / 64.0, height / 64.0)), Vector2.zero, rectColliderSprite, 'overlayLayer', 'RectCollider', owner);

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

function checkRectCircleCollision(collider1, collider2, filter) {
    let toReturn;
    filter.forEach(filterTag => {
        const index = collider2.owner.tags.indexOf(filterTag);

        if ((filterTag[0] == '!' && index != -1) || (filterTag[0] != '!' && index == -1)) {
            toReturn = true;
            return;
        }
    });
    if (toReturn) return false;

    let c;
    let r;
    if (collider1 instanceof CircleCollider) {
        c = collider1;
        r = collider2;
    } else {
        c = collider2;
        r = collider1;
    }

    return c.globalTransform.position.checkDistance(new Vector2(clamp(r.globalTransform.position.x - r.width / 2, r.globalTransform.position.x + r.width / 2, c.globalTransform.position.x), clamp(r.globalTransform.position.y - r.height / 2, r.globalTransform.position.y + r.height / 2, c.globalTransform.position.y)), c.radius);
}

export function checkCollision(collider, filter=[]) {
    const collidersPassed = [];

    if (collider instanceof CircleCollider) {
        allColiders.forEach(otherCollider => {
            if (otherCollider instanceof CircleCollider) if (checkCircleCircleCollision(collider, otherCollider, filter)) collidersPassed.push(otherCollider);
            if (otherCollider instanceof RectCollider) if (checkRectCircleCollision(collider, otherCollider, filter)) collidersPassed.push(otherCollider);
        })
    } else if (collider instanceof RectCollider) {
        allColiders.forEach(otherCollider => {
            if (otherCollider instanceof CircleCollider) if (checkRectCircleCollision(collider, otherCollider, filter)) collidersPassed.push(otherCollider);
        })
    }

    return collidersPassed;
}