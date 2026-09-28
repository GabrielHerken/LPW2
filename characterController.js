import { Vector2, GameObject } from '../stdModule.js';
import { addFrameListener, createGameObject, removeFrameListener, removeGameObject } from '../gameController.js';

let input = new Vector2(0, 0);
const inputMapper = {
    w: new Vector2(0, -1),
    a: new Vector2(-1, 0),
    s: new Vector2(0, 1),
    d: new Vector2(1, 0)
}

let character;

let characterSprite = new Image();
characterSprite.src = '../../sprites/protagonista.png';
characterSprite.addEventListener('load', () => {
    const initialPosition = new Vector2(400, 400);
    const initialVelocity = new Vector2(10, 10);
    const initialSize = new Vector2(128, 128);

    character = createGameObject(initialPosition, initialVelocity, initialSize, characterSprite);

    addFrameListener(repeatOnFrame);
});

function repeatOnFrame() {
    character.velocity = input.normalize().multiplicar(5);
}

function inputHandler(e, down) {
    if (e.repeat || !inputMapper[e.key]) return;

    input = input.somar(inputMapper[e.key].multiplicar(down == true ? 1 : -1));
}

document.addEventListener('keydown', e => inputHandler(e, true));
document.addEventListener('keyup', e => inputHandler(e, false));