import { abilitiesManager } from "./abilitiesManager.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Corsair Fury', './sprites/berserker.png', 'Pain fades, rage grows. Every wound fuels your next blow.');

abilityOBJ.register = () => {
    const unregisterVelocity = abilitiesManager.registerAttribute('velocity', 0, (value, params) => {
        if (params.owner.health / params.owner.maxHealth <= .5) return value * 1.5;
        return value;
    });

    return () => { unregisterVelocity(); };
}