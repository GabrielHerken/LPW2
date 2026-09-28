import { renderFrame, addElementToRender, removeElementToRender } from './renderization/renderController.js';
import { Vector2, GameObject } from './stdModule.js';

//GAME OBJECT HANDLING

const gameObjects = []

export function createGameObject(position, velocity, size, sprite) {
    const newGameObject = new GameObject(sprite, position, velocity, size);

    gameObjects.push(newGameObject);
    addElementToRender(newGameObject);

    return newGameObject;
}

export function removeGameObject(gameObject) {
    removeElementToRender(gameObject);
    gameObjects.splice(gameObjects.indexOf(gameObject), 1);
}

//FRAME

const frameListeners = [];

export function addFrameListener(listener) {
    frameListeners.push(listener);
}

export function removeFrameListener(listener) {
    frameListeners.splice(frameListeners.indexOf(listener), 1);
}

function stepFrame(timestamp) {
    frameListeners.forEach(listener => listener());

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