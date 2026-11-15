import { Transform, Vector2 } from "./stdModule.js";
import { createGameObject } from "./gameController.js";
import { canvas } from './renderController.js';
import { createRectCollider } from "./collisionController.js"; 

let background;

export function createBackground() {
    let backgroundSprite = new Image();
    backgroundSprite.src = '../sprites/backgrounddPiratas.png';
    backgroundSprite.onload = () => {
        const canvasElement = canvas.backgroundLayer.element;
        const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
        const initialVelocity = new Vector2(0, 0);

        background = createGameObject(new Transform(initialPosition, 0, Vector2.one), initialVelocity, backgroundSprite, 'backgroundLayer', 'Background');

        createWall(new Vector2(100, -40), 'Horizontal', 400);
        createWall(new Vector2(100, 240), 'Horizontal', 400);
        createWall(new Vector2(-40, 100), 'Vertical', 400-16*2);
        createWall(new Vector2(240, 100), 'Vertical', 400-16*2);
       
    };
}

const wallThickness = 16;

function createWall(position, axis, width) {
    const wallSprite = new Image();
    wallSprite.src = '../sprites/wallGame.png';
    wallSprite.onload = () => {
        const wall = createGameObject(new Transform(position, 0, axis == 'Horizontal' ? new Vector2(width / 32.0, wallThickness / 32.0) : new Vector2(wallThickness / 32.0, width / 32.0)), Vector2.zero, wallSprite, 'backgroundLayer', 'wall');
        createRectCollider(Vector2.zero, axis == 'Horizontal' ? width : wallThickness, axis == 'Vertical' ? width : wallThickness, wall);
        wall.addTag('wall');
    }
}
