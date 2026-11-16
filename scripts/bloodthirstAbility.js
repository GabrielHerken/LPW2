import { abilitiesManager } from "./abilitiesManager.js";
import { character } from "./characterController.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Blood Thirsty', './sprites/bloodThirsty.png', 'Every strike feeds the blade. The more you cut, the stronger you become.', { kills: 0, inTime: null, timer: null, unregister: null });

abilityOBJ.register = This => {
    const unregister = abilitiesManager.registerToEvent('combat:kill', args => {
        if (!args.killer == character) return;

        if (This.state.inTime != null) {
            abilitiesManager.stopScheduler(This.state.inTime);
            This.state.kills++;

            if (This.state.kills >= 3) {
                if (This.state.timer == null) {
                    const unregisterAttribute = abilitiesManager.registerAttribute('velocity', 0, (value, params) => {
                        return value * 1.5;
                    })
                    This.state.unregister = unregisterAttribute;
                } else {
                    abilitiesManager.stopScheduler(This.state.timer);
                }

                This.state.timer = abilitiesManager.createScheduler(3000, () => {
                    This.state.kills = 0;
                    This.state.timer = null;
                    This.state.unregister();
                    This.state.unregister = null;
                });
            }
        } else {
            This.state.kills = 1;
        }

        This.state.inTime = abilitiesManager.createScheduler(3000, () => This.state.inTime = null);
    });

    return () => {
        unregister();
        if (This.state.unregister != null) This.state.unregister();
    };
}