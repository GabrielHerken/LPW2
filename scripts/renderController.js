import { Vector2, GameObject } from './stdModule.js';

export const canvas = {
    backgroundLayer: {},
    entitiesLayer: {}
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
    entitiesLayer: []
};

//RENDERING FUNCTIONS

function renderImage(image, position, ctx) {
    ctx.drawImage(image, position.x - image.width / 2, position.y - image.height / 2);
}

export function renderFrame() {
    //CLEARING
    Object.values(canvas).forEach(cnv => cnv.context.clearRect(0, 0, cnv.element.width, cnv.element.height));

    //RENDERING EACH LAYER
    Object.keys(canvas).forEach(key => layersToRender[key].forEach(element => renderImage(element.sprite, element.position, canvas[key].context)));
}

export function addElementToRender(element, layer) {
    layersToRender[layer].push(element);
    console.log(layersToRender);
}

export function removeElementToRender(element, layer) {
    layersToRender[layer].splice(elementsToRender.indexOf(element), 1);
}