import { startAllGames } from "./gameController.js";

let botaoJogar = document.querySelector("#botao-jogar");
let menuPrincipal = document.querySelector(".menu-principal");
let botaoAutores = document.querySelector("#botao-autores");
let janelaAutores = document.querySelector("#janela-autores");
let botaoSairAutores = document.querySelector("#botao-fecha-autores");

const img = new Image();
img.src = '../sprites/fundoMenuPrincipal.png';
img.onload = () => document.querySelector('#backgroundLayer').getContext('2d').drawImage(img, 0, 0);

botaoJogar.addEventListener('click', ()=>{
    startAllGames();

    menuPrincipal.style.display = 'none';
});

botaoAutores.addEventListener('click', () =>{
    janelaAutores.showModal();
})

botaoSairAutores.addEventListener('click', () =>{
    janelaAutores.close();
})