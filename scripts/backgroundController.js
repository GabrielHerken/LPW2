import { Transform, Vector2 } from "./stdModule.js";
import { addFrameListener, createGameObject } from "./gameController.js";
import { canvas } from './renderController.js';
import { checkCollision, createRectCollider } from "./collisionController.js";

let background;

export function createBackground() {
    let backgroundSprite = new Image();
    backgroundSprite.src = './sprites/backgroundd.webp';
    backgroundSprite.onload = () => {
        const canvasElement = canvas.backgroundLayer.element;
        const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
        const initialVelocity = new Vector2(0, 0);

        background = createGameObject(new Transform(initialPosition, 0, Vector2.one.multiplicar(2)), initialVelocity, backgroundSprite, 'backgroundLayer', 'Background');

        createWall(new Vector2(100, 292), 'Horizontal', 400);
        createWall(new Vector2(100, -92), 'Horizontal', 400);
        createWall(new Vector2(-92, 100), 'Vertical', 400-16*2);
        createWall(new Vector2(292, 100), 'Vertical', 400-16*2);
        createWall(new Vector2(58, 120), 'Horizontal', 100-16);
    };
}

const wallThickness = 16;

function createWall(position, axis, width) {
    const wallSprite = new Image();
    wallSprite.src = './sprites/wall.png';
    wallSprite.onload = () => {
        const wall = createGameObject(new Transform(position, 0, axis == 'Horizontal' ? new Vector2(width / 32.0, wallThickness / 32.0) : new Vector2(wallThickness / 32.0, width / 32.0)), Vector2.zero, wallSprite, 'backgroundLayer', 'wall');
        createRectCollider(Vector2.zero, axis == 'Horizontal' ? width : wallThickness, axis == 'Vertical' ? width : wallThickness, wall);
        wall.addTag('wall');
    }
}