import { character } from "./characterController.js";
import { pauseResumeFrames } from "./gameController.js";

const storeButton = document.getElementById('store-button');
const store = document.getElementById('store');
const cashP = document.getElementById('cash');
let currentCash = 0;

export let attributes = { force: 1, velocity: 1, defense: 1, life: 1, regen: 1 };

storeButton.addEventListener('click', () => {
    store.classList.toggle('hided');

    pauseResumeFrames();
});

document.querySelectorAll('#atributos button').forEach(button => {
    button.addEventListener('click', () => {
        const priceSpan = button.previousSibling;
        
        if (priceSpan.innerHTML <= currentCash) {
            addCash(-priceSpan.innerHTML);
            priceSpan.innerHTML = Math.floor(priceSpan.innerHTML * 1.4);

            attributes[button.parentElement.parentElement.dataset.attribute]++;
            button.parentElement.parentElement.dataset.quantity = attributes[button.parentElement.parentElement.dataset.attribute];
            button.parentElement.parentElement.firstElementChild.firstElementChild.innerHTML = attributes[button.parentElement.parentElement.dataset.attribute];

            if (button.parentElement.parentElement.dataset.attribute == 'life')
                character.increaseMaxHealth(5); //Vida a mais
        }
    });
});

export function addCash(cash) {
    currentCash += cash;
    cashP.innerHTML = `<span>CASH:</span> $${currentCash}`;
}

export function resetStore() {
    currentCash = 0;
    cashP.innerHTML = `<span>CASH:</span> $0`;

    document.querySelectorAll('#atributos li').forEach(li => {
        li.dataset.quantity = 1;
        li.firstElementChild.firstElementChild.innerHTML = '1';
        li.lastElementChild.firstElementChild.innerHTML = '10';
    });

    attributes = { force: 1, velocity: 1, defense: 1, life: 1, regen: 1 };
}