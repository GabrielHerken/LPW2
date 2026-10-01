import { character as mainCharacter } from "./characterController.js";
import { addFrameListener, removeFrameListener } from "./gameController.js";

//PROPERTIES
const velocity = 30;

//AI
export function basicEnemyStartAI(enemy) {
    const gameObject = enemy.gameObject;

    const listener = dt => everyFrame(gameObject, dt);
    addFrameListener(listener);
    const removeListener = () => removeFrameListener(listener);
    return removeListener;
}

function everyFrame(gameObject, dt) {
    goToPlayer(gameObject, mainCharacter.gameObject);
}

function goToPlayer(gameObject, character) {
    gameObject.velocity = character.localTransform.position.somar(gameObject.localTransform.position.multiplicar(-1)).normalize().multiplicar(velocity);
}