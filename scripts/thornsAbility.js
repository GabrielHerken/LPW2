import { abilitiesManager } from "./abilitiesManager.js";
import { character } from "./characterController.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Espinhos', './sprites/thorns.png', 'Toda vez que um inimigo te inflinja dano, reflita parte do dano de volta à ele.');

abilityOBJ.register = () => {
    const unregister = abilitiesManager.registerToEvent('combat:hit', args => {
        if (args.owner != character) {
            args.owner.getHit({ owner: character, damage: 10 });
            abilitiesManager.fireEvent('combat:hit', { owner: character });
        }
    });

    return () => unregister();
}