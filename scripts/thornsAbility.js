import { abilitiesManager } from "./abilitiesManager.js";
import { character } from "./characterController.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Reef Thorns', './sprites/thorns.png', 'Whoever hits you feels the pain return. Striking you is a very bad deal.');

abilityOBJ.register = () => {
    const unregister = abilitiesManager.registerToEvent('combat:hit', args => {
        if (args.owner != character) {
            args.owner.getHit({ owner: character, damage: 10 });
            abilitiesManager.fireEvent('combat:hit', { owner: character });
        }
    });

    return () => unregister();
}