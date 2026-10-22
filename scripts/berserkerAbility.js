import { abilitiesManager } from "./abilitiesManager.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Berserker', './sprites/berserker.png', 'Se você estiver com menos da metade da vida, receba buffs');

abilityOBJ.register = () => {
    const unregisterVelocity = abilitiesManager.registerAttribute('velocity', 0, (value, params) => {
        if (params.owner.health / params.owner.maxHealth <= .5) return value * 1.5;
        return value;
    });

    return () => { unregisterVelocity(); };
}