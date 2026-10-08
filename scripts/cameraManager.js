import { character } from "./characterController.js";
import { addFrameListener, createGameObject } from "./gameController.js";
import { Transform, Vector2 } from "./stdModule.js";

export let camera = null;
const margin = 40;

export function createCamera() {
    camera = createGameObject(new Transform(Vector2.one.multiplicar(100)), Vector2.zero, null, null, 'Camera');

    addFrameListener(dt => {
        if (character == null) return;

        const diff = character.gameObject.globalTransform.position.somar(camera.globalTransform.position.multiplicar(-1));

        if (Math.abs(diff.x) >= 100 - margin) {
            camera.localTransform.position = camera.localTransform.position.somar(Vector2.right.multiplicar(Math.sign(diff.x)));
        }
        if (Math.abs(diff.y) >= 100 - margin) {
            camera.localTransform.position = camera.localTransform.position.somar(Vector2.up.multiplicar(-1*Math.sign(diff.y)));
        }
    });
}