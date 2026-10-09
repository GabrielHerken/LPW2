import { pauseResumeFrames } from "./gameController.js";

const storeButton = document.getElementById('store-button');
const store = document.getElementById('store');

storeButton.addEventListener('click', () => {
    store.classList.toggle('hided');

    pauseResumeFrames();
});