import { Transform, Vector2 } from "./stdModule.js";
import { createGameObject } from "./gameController.js";
import { canvas } from './renderController.js';

let background;

let backgroundSprite = new Image();
backgroundSprite.src = './sprites/backgroundd.webp';
backgroundSprite.addEventListener('load', () => {
    const canvasElement = canvas.backgroundLayer.element;
    const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
    const initialVelocity = new Vector2(0, 0);

    background = createGameObject(new Transform(initialPosition, 0), initialVelocity, backgroundSprite, 'backgroundLayer');
});