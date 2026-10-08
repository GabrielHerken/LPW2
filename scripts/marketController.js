import { addElementToRender } from "./renderController.js";
import { Vector2 } from "./stdModule.js";

const cashP = document.getElementById('cash');

let currentCash = 0;

export function addCash(cash) {
    currentCash += cash;
    cashP.innerHTML = `<span>CASH:</span> $${currentCash}`;
}

export function resetCash() {
    currentCash = 0;
    cashP.innerHTML = `<span>CASH:</span> $0`;
}