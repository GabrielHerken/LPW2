import { renderFrame, addElementToRender, removeElementToRender } from './renderController.js';
import { Vector2, GameObject } from './stdModule.js';

//GAME OBJECT HANDLING

const gameObjects = []

export function createGameObject(position, velocity, rotation, sprite, layer) {
    const newGameObject = new GameObject(sprite, layer, position, velocity, rotation);

    gameObjects.push(newGameObject);
    addElementToRender(newGameObject, layer);

    return newGameObject;
}

export function removeGameObject(gameObject) {
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

    handlePhysics();

    renderFrame();

    requestAnimationFrame(stepFrame);
}

requestAnimationFrame(stepFrame);

//PHYSICS

function handlePhysics() {
    handleVelocities();
}

function handleVelocities() {
    gameObjects.forEach(gameObject => {
        gameObject.position = gameObject.position.somar(gameObject.velocity);
    });
}