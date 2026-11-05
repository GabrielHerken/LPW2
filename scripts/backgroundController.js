import { Vector2 } from "./stdModule.js";
import { createGameObject } from "./gameController.js";
import { canvas } from './renderController.js';
import {drawPerson} from './characterController.js'

let botaoJogo = document.querySelector("#botao-jogar");
let tituloMenu = document.querySelector("#titulo-jogo");
let gameIsStarted = false;


function drawGame() {
    const canvasElement = canvas.backgroundLayer.element;
    
    let background;
    let backgroundSprite = new Image();
    
    if (gameIsStarted) {
        backgroundSprite.src = '../sprites/backgrounddPiratas.png';
        backgroundSprite.addEventListener('load', () => {
            const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
            const initialVelocity = new Vector2(0, 0);
            background = createGameObject(initialPosition, initialVelocity, backgroundSprite, 'backgroundLayer');
            drawPerson();
        });    
    }    
    else {
        backgroundSprite.src = '../sprites/fundoMenuPrincipal.png';
        backgroundSprite.addEventListener('load', () => {
            const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
            const initialVelocity = new Vector2(0, 0);
            background = createGameObject(initialPosition, initialVelocity, backgroundSprite, 'backgroundLayer');
        });    
    }    
}           
drawGame()

botaoJogo.addEventListener('click', () => {
    gameIsStarted = true;
    tituloMenu.style.display = "none";
    botaoJogo.style.display = "none";
    drawGame();
})
