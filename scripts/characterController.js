import { Vector2, GameObject, Attack, Entity, Transform } from './stdModule.js';
import { addFrameListener, characterDied, createGameObject, removeFrameListener, removeGameObject } from './gameController.js';
import { canvas, getMousePosition } from './renderController.js';
import { tryToAttack } from './attackController.js';
import { getSwordAttackObject } from './swordAttack.js';
import { createCircleCollider } from './collisionController.js';
import { startWaves } from './wavesManager.js';
import { abilitiesManager } from './abilitiesManager.js';
import { attributes } from './storeManager.js';
import { getBowAttackObject } from './bowAttack.js';

//PROPERTIES
const initialMaxHealth = 50;
const initialVelocity = 100;
const velocityMultiplier = 10.0;
const forceMultiplier = 5.0;
const defenseMultiplier = 20.0;
let velocity = initialVelocity;
const regenTime = 5;
const regenFactor = 0.1;
const regenMultiplier = 0.15;

//CHARACTER CREATION

export let character = null;

export function createCharacter() {
    input = Vector2.zero;
    const characterSprite = new Image();
    characterSprite.src = './sprites/protagonista.png';
    characterSprite.onload = () => {
        const canvasElement = canvas.entitiesLayer.element;
        const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height * 0.75);

        character = new Entity(createGameObject(new Transform(initialPosition), Vector2.zero, characterSprite, 'entitiesLayer', 'Personagem'), initialMaxHealth);
        createCircleCollider(Vector2.zero, 32 / 2, character.gameObject);

        character.gameObject.addTag('damageable');
        character.gameObject.addTag('character');

        character.gameObject.addComponent(Entity, character);

        character.lastHit = regenTime * 1000;
        character.damageCalculation = damage => {
            character.lastHit = 0;
            return damage * (1 - (attributes.defense - 1) / defenseMultiplier);
        }
        
        character.die = params => {
            removeFrameListener(repeatOnFrame);
            document.removeEventListener('keydown', keyDownEvent);
            document.removeEventListener('keyup', keyUpEvent);
            document.removeEventListener('click', clickEvent);
            removeGameObject(character.gameObject);
            character = null;
            characterDied();
        };

        attacks = [];
        attacks.push(getSwordAttackObject(character.gameObject));

        addFrameListener(repeatOnFrame);

        const keyDownEvent = e => inputHandler(e, true);
        const keyUpEvent = e => inputHandler(e, false);
        const clickEvent =  e => {const mp = getMousePosition(e); if (mp.x >= 0 && mp.x <= canvasElement.width && mp.y >= 0 && mp.y <= canvasElement.height) tryToAttack(attacks[0], {direction: getMousePosition(e).somar(character.gameObject.localTransform.position.multiplicar(-1)).normalize(), filter: 'enemy', multiplier: 1 + (attributes.force - 1) / forceMultiplier})};
        document.addEventListener('keydown', keyDownEvent);
        document.addEventListener('keyup', keyUpEvent);
        document.addEventListener('click', clickEvent);

        startWaves();
    }
}

//ATTACKS

let attacks = [];
const attackObjects = { sword: getSwordAttackObject, bow: getBowAttackObject };

export function setAttack(arma) {
    attacks[0] = attackObjects[arma](character.gameObject);
}

//INPUTS

let input = new Vector2(0, 0);
const inputMapper = {
    w: new Vector2(0, -1),
    a: new Vector2(-1, 0),
    s: new Vector2(0, 1),
    d: new Vector2(1, 0)
}

function repeatOnFrame(deltaTime) {
    character.gameObject.velocity = input.multiplicar(abilitiesManager.getAttribute('velocity', initialVelocity * (1 + (attributes.velocity - 1) / velocityMultiplier), {owner: character}));

    
    console.log(character.lastHit);
    if (character.health < character.maxHealth && character.lastHit == regenTime * 1000) {
        character.health = Math.min(character.maxHealth, character.health * (1 + deltaTime / 1000 * regenFactor * (1 + (attributes.regen - 1) / regenMultiplier)));
    } else if (character.lastHit < regenTime * 1000) {
        character.lastHit = Math.min(regenTime * 1000, character.lastHit + deltaTime);
    }

    //CONSERTAR REGEN
}

function inputHandler(e, down) {
    if (e.repeat || !inputMapper[e.key]) return;

    input = input.somar(inputMapper[e.key].multiplicar(down == true ? 1 : -1));
    input = new Vector2(Math.min(Math.max(input.x, -1), 1), Math.min(Math.max(input.y, -1), 1));
}