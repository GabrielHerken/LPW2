import { Vector2, GameObject, Attack, Entity, Transform } from './stdModule.js';
import { addFrameListener, createGameObject, removeFrameListener, removeGameObject } from './gameController.js';
import { canvas, getMousePosition } from './renderController.js';
import { tryToAttack } from './attackController.js';
import { getSwordAttackObject } from './swordAttack.js';
import { createCircleCollider } from './collisionController.js';

//PROPERTIES
const initialMaxHealth = 100;
const velocity = 100;

//CHARACTER CREATION

let character;

let characterSprite = new Image();
characterSprite.src = './sprites/protagonista.png';
characterSprite.addEventListener('load', () => {
    const canvasElement = canvas.entitiesLayer.element;
    const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);

    character = new Entity(createGameObject(new Transform(initialPosition), Vector2.zero, characterSprite, 'entitiesLayer', 'Personagem'), initialMaxHealth);
    character.gameObject.colliders.push(createCircleCollider(Vector2.zero, 32, character.gameObject));

    attacks.push(getSwordAttackObject(character.gameObject));

    addFrameListener(repeatOnFrame);
});

//ATTACKS

const attacks = [];

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
}

document.addEventListener('keydown', e => inputHandler(e, true));
document.addEventListener('keyup', e => inputHandler(e, false));
document.addEventListener('click', e => tryToAttack(attacks[0], getMousePosition(e).somar(character.gameObject.localTransform.position.multiplicar(-1)).normalize()));