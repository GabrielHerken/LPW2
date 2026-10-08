import { Vector2, GameObject, Attack, Entity, Transform } from './stdModule.js';
import { addFrameListener, characterDied, createGameObject, removeFrameListener, removeGameObject } from './gameController.js';
import { canvas, getMousePosition } from './renderController.js';
import { tryToAttack } from './attackController.js';
import { getSwordAttackObject } from './swordAttack.js';
import { createCircleCollider } from './collisionController.js';
import { startWaves } from './wavesManager.js';

//PROPERTIES
const initialMaxHealth = 50;
const velocity = 100;

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

        character.die = () => {
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
        const clickEvent =  e => tryToAttack(attacks[0], getMousePosition(e).somar(character.gameObject.localTransform.position.multiplicar(-1)).normalize(), 'enemy');
        document.addEventListener('keydown', keyDownEvent);
        document.addEventListener('keyup', keyUpEvent);
        document.addEventListener('click', clickEvent);

        startWaves();
    }
}

//ATTACKS

let attacks = [];

//INPUTS

let input = new Vector2(0, 0);
const inputMapper = {
    w: new Vector2(0, -1),
    a: new Vector2(-1, 0),
    s: new Vector2(0, 1),
    d: new Vector2(1, 0)
}

function repeatOnFrame(deltaTime) {
    character.gameObject.velocity = input.multiplicar(velocity);
}

function inputHandler(e, down) {
    if (e.repeat || !inputMapper[e.key]) return;

    input = input.somar(inputMapper[e.key].multiplicar(down == true ? 1 : -1));
    input = new Vector2(Math.min(Math.max(input.x, -1), 1), Math.min(Math.max(input.y, -1), 1));
}