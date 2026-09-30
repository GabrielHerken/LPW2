import { Vector2, GameObject } from './stdModule.js';

export const canvas = {
    backgroundLayer: {},
    entitiesLayer: {},
    attacksLayer: {},
    overlayLayer: {}
}

Object.keys(canvas).forEach(key => {
    canvas[key].element = document.getElementById(key),
    canvas[key].context = canvas[key].element.getContext('2d')
})

//RENDERING DEFINITIONS

Object.values(canvas).forEach(ctx => {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
});

const layersToRender = {
    backgroundLayer: [],
    entitiesLayer: [],
    attacksLayer: [],
    overlayLayer: []
};

//RENDERING FUNCTIONS

function renderImage(image, position, rotation, ctx) {
    ctx.save();

    ctx.translate(position.x, position.y);
    ctx.rotate((Math.PI / 180) * rotation);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    ctx.restore();
}

export function renderFrame() {
    //CLEARING
    Object.values(canvas).forEach(cnv => cnv.context.clearRect(0, 0, cnv.element.width, cnv.element.height));

    //RENDERING EACH LAYER
    Object.keys(canvas).forEach(key => layersToRender[key].forEach(gameObject => renderImage(gameObject.sprite, gameObject.globalTransform.position, gameObject.globalTransform.rotation, canvas[key].context)));
}

export function addElementToRender(element, layer) {
    layersToRender[layer].push(element);
}

export function removeElementToRender(element, layer) {
    layersToRender[layer].splice(layersToRender[layer].indexOf(element), 1);
}

//AUXILIARY FUNCTIONS

export function getMousePosition(e) {
    var rect = canvas.backgroundLayer.element.getBoundingClientRect(),
    scaleX = canvas.backgroundLayer.element.width / rect.width,
    scaleY = canvas.backgroundLayer.element.height / rect.height;

  return new Vector2((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
}