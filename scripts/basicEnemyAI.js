import { tryToAttack } from "./attackController.js";
import { character as mainCharacter } from "./characterController.js";
import { addFrameListener, removeFrameListener } from "./gameController.js";
import { getSwordAttackObject } from "./swordAttack.js";

//PROPERTIES
const velocity = 30;

//AI
export function basicEnemyStartAI(enemy) {
    const gameObject = enemy.gameObject;

    const attacks = [];
    attacks.push(getSwordAttackObject(gameObject));

    const listener = dt => everyFrame(gameObject, attacks, dt);
    addFrameListener(listener);
    const removeListener = () => removeFrameListener(listener);
    return removeListener;
}

function everyFrame(gameObject, attacks, dt) {
    if (mainCharacter == null) {
        //console.log(null);
        return;
    }
        
    //PATHFINDING
    goToPlayer(gameObject, mainCharacter.gameObject);

    //ATTACKING
    if (gameObject.globalTransform.position.checkDistance(mainCharacter.gameObject.globalTransform.position, 40)) {
        tryToAttack(attacks[0], mainCharacter.gameObject.globalTransform.position.somar(gameObject.globalTransform.position.multiplicar(-1)).normalize(), 'character');
    }
}

function goToPlayer(gameObject, character) {

    gameObject.velocity = character.localTransform.position.somar(gameObject.localTransform.position.multiplicar(-1)).normalize().multiplicar(velocity);
}