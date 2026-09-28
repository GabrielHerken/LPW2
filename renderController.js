import { Vector2, GameObject } from '../stdModule.js';

const canvas = document.getElementById('mainCanvas');
const context = canvas.getContext('2d');

//RENDERING DEFINITIONS

context.mozImageSmoothingEnabled = false;
context.webkitImageSmoothingEnabled = false;
context.msImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

const elementsToRender = [];

//RENDERING FUNCTIONS

function renderImage(image, position, size) {
    context.drawImage(image, position.x - size.x / 2, position.y - size.y / 2, size.x, size.y);
}

export function renderFrame() {
    context.clearRect(0, 0, 800, 800);

    elementsToRender.forEach(element => {
        renderImage(element.sprite, element.position, element.size);
    });
}

export function addElementToRender(element) {
    elementsToRender.push(element);
}

export function removeElementToRender(element) {
    elementsToRender.splice(elementsToRender.indexOf(element), 1);
}