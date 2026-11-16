const musics = {
    menu: new Audio("../musics/musicaMenu.m4a"),
    game: new Audio("../musics/musicaBatalha.m4a"),
    win: new Audio("../musics/musicaVitoria.m4a"),
    lose: new Audio("../musics/musicaDerrota.m4a")
};

let currentMusic = null;
let silenceMusic = false;
const audioButton = document.querySelector("#botao-audio");


audioButton.addEventListener('click', () => {
    silenceMusic = !silenceMusic;

    if (silenceMusic) {
        audioButton.src = "../sprites/mutedButton.png";
    } else {
        audioButton.src = "../sprites/audioBotao.png";
    }

    if (currentMusic) {
        if (silenceMusic) {
            currentMusic.pause();
        } else {
            currentMusic.play();
        }
    }
});

export function playMusic(name, loop) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    currentMusic = musics[name];
    currentMusic.loop = loop;
    currentMusic.volume = 0.3;
    if(!silenceMusic)
        currentMusic.play();
}

cheet('r b g b', function (){
    document.querySelector("#mensagem-secreta").style.display = "block";
    musics.game = new Audio("../musics/musicaSecreta.m4a");
});