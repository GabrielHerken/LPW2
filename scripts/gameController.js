import { attackControllerStart } from './attackController.js';
import { createBackground } from './backgroundController.js';
import { createCamera } from './cameraManager.js';
import { createCharacter } from './characterController.js';
import { checkCollision, removeCollider } from './collisionController.js';
import { renderFrame, addElementToRender, removeElementToRender } from './renderController.js';
import { Vector2, GameObject, Transform, clamp } from './stdModule.js';
import { stopWaves } from './wavesManager.js';

//GAME OBJECT HANDLING

export const root = new GameObject(null, null, new Transform(Vector2.zero, 0), Vector2.zero, null, 'root');
const gameObjects = [root];

export function createGameObject(localTransform, velocity, sprite, layer, name, parent=root) {
    const newGameObject = new GameObject(sprite, layer, localTransform, velocity, parent, name);
    parent.children.push(newGameObject);
    gameObjects.push(newGameObject);
    if (layer != null)
        addElementToRender(newGameObject, layer);

    return newGameObject;
}

export function removeGameObject(gameObject) {
    if (gameObject.parent == null)
        return;

    const index = gameObject.parent.children.indexOf(gameObject)

    if (index == -1)
        return;

    gameObject.parent.children.splice(index, 1);
    Array.from(gameObject.colliders).forEach(removeCollider);
    Array.from(gameObject.children).forEach(removeGameObject);
    if (gameObject.layer != null)
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
    const index = frameListeners.indexOf(listener);
    if (index != -1)
        frameListeners.splice(index, 1);
}

var lastTimestamp;

function stepFrame(timestamp) {
    //DELTA TIME
    if (!lastTimestamp)
        lastTimestamp = timestamp;

    var deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    //EVENT TRIGGERS
    frameListeners.forEach(listener => listener(deltaTime));

    //FRAME EVENTS
    gameObjects.forEach(gameObject => {
        handlePhysics(gameObject, deltaTime);

        if (gameObject.parent != null) {    
            gameObject.globalTransform = gameObject.localTransform.returnGlobalTransform(gameObject.parent.globalTransform);

            gameObject.colliders.forEach(collider => collider.globalTransform = collider.localTransform.returnGlobalTransform(gameObject.globalTransform));
        }
    });

    //RENDERIZATION
    renderFrame();

    requestAnimationFrame(stepFrame);
}

requestAnimationFrame(stepFrame);

//PHYSICS

function handlePhysics(gameObject, dt) {
    if (gameObject.velocity != Vector2.zero) handleVelocity(dt, gameObject);
}

function handleVelocity(dt, gameObject) {
    if (gameObject.colliders.length > 0) {
        const wallHit = checkCollision(gameObject.colliders[0], ['wall']);
        if (wallHit.length > 0) {
            gameObject.localTransform.position = gameObject.localTransform.position.somar((new Vector2(clamp(wallHit[0].globalTransform.position.x - wallHit[0].width / 2, wallHit[0].globalTransform.position.x + wallHit[0].width / 2, gameObject.globalTransform.position.x), clamp(wallHit[0].globalTransform.position.y - wallHit[0].height / 2, wallHit[0].globalTransform.position.y + wallHit[0].height / 2, gameObject.globalTransform.position.y))).somar(gameObject.globalTransform.position.multiplicar(-1)).normalize().multiplicar(-1));
        } else {
            gameObject.localTransform.position = gameObject.localTransform.position.somar(gameObject.velocity.multiplicar(dt / 1000));
        }
    } else {
            gameObject.localTransform.position = gameObject.localTransform.position.somar(gameObject.velocity.multiplicar(dt / 1000));
    }
}

//GAME STATE HANDLING

export function characterDied() {
    stopWaves();
    Array.from(frameListeners).forEach(removeFrameListener);
    Array.from(gameObjects).forEach(removeGameObject);

    setTimeout(() => {
        attackControllerStart();
        createCharacter();
        createBackground();
        createCamera();
    }, 1000);
}

attackControllerStart();
createCharacter();
createBackground();
createCamera();