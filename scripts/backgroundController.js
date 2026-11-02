import { Vector2 } from "./stdModule.js";
import { createGameObject } from "./gameController.js";
import { canvas } from './renderController.js';

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
        });
    }
    else {
        backgroundSprite.src = '../sprites/backgroundd.webp';
        backgroundSprite.addEventListener('load', () => {
            const initialPosition = new Vector2(canvasElement.width / 2, canvasElement.height / 2);
            const initialVelocity = new Vector2(0, 0);
            background = createGameObject(initialPosition, initialVelocity, backgroundSprite, 'backgroundLayer');
        });
    }
}       


window.addEventListener('load', () => {
    const canvasElement = canvas.backgroundLayer.element;

    window.addEventListener("click", (e) => {
        if (gameIsStarted) return;

        
        const rect = canvasElement.getBoundingClientRect();
   
        const cliqueFisicoX = e.clientX - rect.left;
        const cliqueFisicoY = e.clientY - rect.top;

        const mouseX = (cliqueFisicoX / canvasElement.clientWidth) * canvasElement.width;
        const mouseY = (cliqueFisicoY / canvasElement.clientHeight) * canvasElement.height;

  
        if (mouseX >= 0 && mouseX <= canvasElement.width && mouseY >= 0 && mouseY <= canvasElement.height) {
            
            console.log(`Clique perfeitamente calibrado -> X interno: ${Math.round(mouseX)}, Y interno: ${Math.round(mouseY)}`);


            if (
                mouseX >= startButton.x && 
                mouseX <= startButton.x + startButton.width && 
                mouseY >= startButton.y && 
                mouseY <= startButton.y + startButton.height
            ) {
                gameIsStarted = true;
                drawGame(); 
            } 
        }
    });

    drawGame();
});
