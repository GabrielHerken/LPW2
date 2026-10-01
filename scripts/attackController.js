import { addFrameListener, gameObjectExists } from "./gameController.js";
import { Vector2 } from "./stdModule.js";

const attacksInCooldown = [];

export function tryToAttack(attack, direction, filter='') {
    if (attack.currentCooldown <= 0) {
        attack.currentCooldown = attack.maxCooldown;
        attacksInCooldown.push(attack);
        attack.attackEffect(attack, direction, filter);
    }
}

function deduceCooldowns(deltaTime) {
    const removeElements = [];

    attacksInCooldown.forEach(attack => {
        if (!gameObjectExists(attack.owner)) {
            removeElements.push(attack)
        } else {
            attack.currentCooldown -= deltaTime / 1000;

            if (attack.currentCooldown <= 0)
                removeElements.push(attack);
        }
    });

    removeElements.forEach(attack => attacksInCooldown.splice(attacksInCooldown.indexOf(attack), 1));
}

export function attackControllerStart() {
    addFrameListener(deduceCooldowns);
}