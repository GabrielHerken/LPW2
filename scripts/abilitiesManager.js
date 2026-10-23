import { abilityOBJ as thornsAbilityOBJ } from "./thornsAbility.js";
import { abilityOBJ as berserkerAbilityOBJ} from "./berserkerAbility.js";
import { abilityOBJ as bloodthirstAbilityOBJ} from "./bloodthirstAbility.js";

const abilitiesSelector = document.getElementById('abilities');
const abilitiesCard = document.querySelectorAll('#abilities li');

const abilities = [thornsAbilityOBJ, berserkerAbilityOBJ, bloodthirstAbilityOBJ];

function selectUpgrade(ability) {
    abilitiesManager.addAbility(ability);
    abilitiesManager.resumeSchedulers();
}

export function newUpgrades() {
    abilitiesManager.pauseSchedulers();

    return new Promise(res => {
        abilitiesSelector.classList.remove('hide');

        const listeners = [];
        abilitiesCard.forEach(card => {
            const ability = abilities[Math.floor(Math.random() * abilities.length)];
            card.querySelector('h2').innerHTML = ability.title;
            card.querySelector('img').src = ability.spriteURL;
            card.querySelector('p').innerHTML = ability.description;

            const tempFunc = () => {
                selectUpgrade(ability);

                abilitiesSelector.classList.add('hide');

                abilitiesCard.forEach((c, key) => {
                    c.removeEventListener('click', listeners[key]);
                });

                res();
            }

            listeners.push(tempFunc);
            card.addEventListener('click', tempFunc);
        });
    });
}

const FOV = 53 * (Math.PI / 180);
const heightP = 1 / (2 * Math.tan(FOV / 2)); //PORÇÃO DA TELA QUE É A ALTURA
abilitiesCard.forEach(card => {
    card.addEventListener('mousemove', e => {
        abilitiesCard.forEach((other, key) => {
            const height = heightP * window.innerWidth;
            const rect = other.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.right) / 2;
            const dy = e.clientY - (rect.top + rect.bottom) / 2;
            const distanceX = height * height / (3 * dx - 3 * (rect.right - rect.left) / 2);
            const distanceY = height * height / (3 * dy - 3 * (rect.bottom - rect.top) / 2);

            if (card == other) {
                other.style.transform = `scale(1.1) perspective(calc(0.9 * 50vw / tan(var(--FOV) / 2))) rotateY(${Math.PI / 2 - Math.atan2(0.9 * height, dx)}rad) rotateX(${-(Math.PI / 2 - Math.atan2(0.9 * height, dy))}rad)`;
            } else {
                other.style.transform = `scale(0.75) perspective(calc((4 / 3) * 50vw / tan(var(--FOV) / 2))) rotateY(${Math.PI / 2 - Math.atan2((4 / 3) * height, dx)}rad) rotateX(${-(Math.PI / 2 - Math.atan2(2 * window.innerHeight, 3 * dy * Math.tan(FOV / 2)))}rad)`;
            }
        });
    });

    card.addEventListener('mouseleave', e => {
        abilitiesCard.forEach((other, key) => {
            other.style.removeProperty('transform');
        })
    })
});

class AbilitiesManager {
    constructor() {
        this.Abilities = new Map();
        this.Events = new Map();
        this.Attributes = new Map();
        this.Schedulers = new Set();
    }

    addAbility(ability) {
        if (this.Abilities.has(ability.title)) return false;

        this.Abilities.set(ability.title, ability.register(ability));
    }

    registerToEvent(event, callback) {
        if (!this.Events.has(event)) {
            this.Events.set(event, new Set());
        }

        this.Events.get(event).add(callback);

        return () => {
            this.Events.get(event).delete(callback);

            if (this.Events.get(event).size == 0) {
                this.Events.delete(event);
            }
        };
    }

    fireEvent(event, args) {
        if (this.Events.has(event)) {
            this.Events.get(event).forEach(callback => callback(args));
        }
    }

    getAttribute(attributeName, initialValue, params) {
        if (!this.Attributes.has(attributeName)) return initialValue;

        let newValue = initialValue;
        this.Attributes.get(attributeName).forEach(({priority, func}) => {
            newValue = func(newValue, params);
        });

        return newValue;
    }

    registerAttribute(attributeName, priority, func) {
        if (!this.Attributes.has(attributeName)) {
            this.Attributes.set(attributeName, new Set());
        }

        const obj = {priority: priority, func: func};
        const newArr = Array.from(this.Attributes.get(attributeName));
        newArr.push(obj);
        newArr.sort((a, b) => b.priority - a.priority);
        this.Attributes.set(attributeName, new Set(newArr));

        return () => {
            this.Attributes.get(attributeName).delete(obj);

            if (this.Attributes.get(attributeName).size == 0) {
                this.Attributes.delete(attributeName);
            }
        };
    }

    createScheduler(time, callback) {
        const mutatedCallback = () => {
            this.Schedulers.delete(scheduler);

            callback();
        }
        const timerID = setTimeout(mutatedCallback, time);
        const scheduler = { id: timerID, playing: true, remainingTime: time, startTime: Date.now(), callback: mutatedCallback };

        this.Schedulers.add(scheduler);

        return scheduler;
    }

    stopScheduler(scheduler) {
        this.Schedulers.delete(scheduler);
        clearTimeout(scheduler.id);
    }

    pauseSchedulers() {
        this.Schedulers.forEach(scheduler => {
            if (scheduler.playing == true) {
                clearTimeout(scheduler.id);
                scheduler.remainingTime -= Date.now() - scheduler.startTime;
                scheduler.playing = false;
            }
        });
    }

    resumeSchedulers() {
        this.Schedulers.forEach(scheduler => {
            if (scheduler.playing == false) {
                setTimeout(scheduler.callback, scheduler.remainingTime);
                scheduler.playing = true;
            }
        });
    }

    //USAR pauseSchedulers E resumeSchedulers QUANDO ABRIR A LOJA

    clearAbilitiesManager() {
        this.Schedulers.forEach(scheduler => {
            clearTimeout(scheduler.id);
        });

        this.Abilities.forEach((unsubscribe, key_) => unsubscribe())

        this.Schedulers.clear();
        this.Events.clear();
        this.Attributes.clear();
        this.Abilities.clear();
    }
}

export const abilitiesManager = new AbilitiesManager();