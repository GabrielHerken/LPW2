import { abilitiesManager } from "./abilitiesManager.js";
import { character } from "./characterController.js";
import { Ability } from "./stdModule.js";

export const abilityOBJ = new Ability('Sede de Sangue', './sprites/bloodthirst.png', 'Se você matar 3 inimigos rapidamente, ganha um buff por tempo limitado, enquanto você continuar matando inimigos', { kills: 0, time: Date.now(), timer: null, unregister: null });

abilityOBJ.register = This => {
    const unregister = abilitiesManager.registerToEvent('combat:kill', args => {
        if (!args.killer == character) return;

        if (Date.now() - This.state.time <= 3000) {
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

        This.state.time = Date.now();
    });

    return () => {
        unregister();
        if (This.state.unregister != null) This.state.unregister();
    };
}