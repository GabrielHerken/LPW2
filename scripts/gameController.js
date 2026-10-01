import { removeCollider } from './collisionController.js';
import { renderFrame, addElementToRender, removeElementToRender } from './renderController.js';
import { Vector2, GameObject, Transform } from './stdModule.js';

//GAME OBJECT HANDLING

export const root = new GameObject(null, null, new Transform(Vector2.zero, 0), Vector2.zero, null, 'root');
const gameObjects = [root];

export function createGameObject(localTransform, velocity, sprite, layer, name, parent=root) {
    const newGameObject = new GameObject(sprite, layer, localTransform, velocity, parent, name);
    parent.children.push(newGameObject);
    gameObjects.push(newGameObject);
    addElementToRender(newGameObject, layer);

    return newGameObject;
}

export function removeGameObject(gameObject) {
    gameObject.parent.children.splice(gameObject.parent.children.indexOf(gameObject), 1);
    gameObject.colliders.forEach(removeCollider);
    const childs = [];
    gameObject.children.forEach((child) => childs.push(child));
    childs.forEach(removeGameObject);
    removeElementToRender(gameObject, gameObject.layer);
    gameObjects.splice(gameObjects.indexOf(gameObject), 1);
}

export function gameObjectExists(gameObject) {
    return gameObjects.indexOf(gameObject) != -1;
}

//FRAME

const frameListeners = [];

export function addFrameListener(listener) {
    frameListeners.push(listener);
}

export function removeFrameListener(listener) {
    frameListeners.splice(frameListeners.indexOf(listener), 1);
}

var lastTimestamp;

function stepFrame(timestamp) {
    if (!lastTimestamp)
        lastTimestamp = timestamp;

    var deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    frameListeners.forEach(listener => listener(deltaTime));

    handlePhysics(deltaTime);

    renderFrame();

    requestAnimationFrame(stepFrame);
}

requestAnimationFrame(stepFrame);

//PHYSICS

function handlePhysics(dt) {
    gameObjects.forEach(gameObject => {
        if (gameObject.velocity != Vector2.zero) handleVelocity(dt, gameObject);

        gameObject.setGlobalTransform();
    });
    
}

function handleVelocity(dt, gameObject) {
    gameObject.localTransform.position = gameObject.localTransform.position.somar(gameObject.velocity.multiplicar(dt / 1000));
}