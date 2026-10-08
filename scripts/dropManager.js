import { character } from "./characterController.js";
import { addFrameListener, createGameObject, removeFrameListener, removeGameObject } from "./gameController.js";
import { addCash } from "./marketController.js";
import { Transform, Vector2 } from "./stdModule.js";

const cashSprite = new Image();
cashSprite.src = './sprites/cashDrop.png';

const initialVelocity = 100;
const gravitationalConstant = 1 / 3;

export function createDrop(position, type, amount) {
    for (let i=0; i<amount; i++) {
        const drop = createGameObject(new Transform(position, 0, Vector2.one), new Vector2(Math.cos(2*Math.PI*i/amount), Math.sin(2*Math.PI*i/amount)).multiplicar(initialVelocity), cashSprite, 'objectsLayer', 'cashDrop');

        const func = dt => {
            const distance = character.gameObject.globalTransform.position.somar(drop.globalTransform.position.multiplicar(-1));
            drop.velocity = drop.velocity.somar(distance.normalize().multiplicar(gravitationalConstant * Math.pow(distance.magnitude(), 2) * dt / 1000));

            if (distance.magnitude() <= 32) {
                removeFrameListener(func);
                addCash(1);
                removeGameObject(drop);
            }
        }
        addFrameListener(func);
    }
}