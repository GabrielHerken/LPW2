import { Vector2, GameObject } from './stdModule.js';
import { addFrameListener, createGameObject, removeFrameListener, removeGameObject } from './gameController.js';
import { canvas } from './renderController.js';

let input = new Vector2(0, 0);
const inputMapper = {
    w: new Vector2(0, -1),
    a: new Vector2(-1, 0),
    s: new Vector2(0, 1),
    d: new Vector2(1, 0)
}

let character;

let characterSprite = new Image();
characterSprite.src = '../sprites/protagonista.png';
characterSprite.addEventListener('load', () => {
    const canvasElement = canvas.entitiesLayer.element;
    const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
    const initialVelocity = new Vector2(0, 0);

    character = createGameObject(initialPosition, initialVelocity, characterSprite, 'entitiesLayer');

    addFrameListener(repeatOnFrame);
});

function repeatOnFrame() {
    character.velocity = input;
}

function inputHandler(e, down) {
    if (e.repeat || !inputMapper[e.key]) return;

    input = input.somar(inputMapper[e.key].multiplicar(down == true ? 1 : -1));
}

document.addEventListener('keydown', e => inputHandler(e, true));
document.addEventListener('keyup', e => inputHandler(e, false));