const abilitiesSelector = document.getElementById('abilities');
const abilitiesCard = document.querySelectorAll('#abilities li');

export function newUpgrades() {
    return new Promise(res => {
        abilitiesSelector.classList.remove('hide');
    });
}

const FOV = 53 * (Math.PI / 180);
const heightP = 1 / (2 * Math.tan(FOV / 2)); //PORÇÃO DA TELA QUE É A ALTURA
abilitiesCard.forEach(card => {
    card.addEventListener('mousemove', e => {
        abilitiesCard.forEach((other, key) => {
            const height = heightP * window.innerWidth;
            const rect = other.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.right) / 2;
            const dy = e.clientY - (rect.top + rect.bottom) / 2;
            const distanceX = height * height / (3 * dx - 3 * (rect.right - rect.left) / 2);
            const distanceY = height * height / (3 * dy - 3 * (rect.bottom - rect.top) / 2);

            if (card == other) {
                other.style.transform = `scale(1.1) perspective(calc(0.9 * 50vw / tan(var(--FOV) / 2))) rotateY(${Math.PI / 2 - Math.atan2(0.9 * height, dx)}rad) rotateX(${-(Math.PI / 2 - Math.atan2(0.9 * height, dy))}rad)`;
            } else {
                other.style.transform = `scale(0.75) perspective(calc((4 / 3) * 50vw / tan(var(--FOV) / 2))) rotateY(${Math.PI / 2 - Math.atan2((4 / 3) * height, dx)}rad) rotateX(${-(Math.PI / 2 - Math.atan2(2 * window.innerHeight, 3 * dy * Math.tan(FOV / 2)))}rad)`;
            }
        });
    });

    card.addEventListener('mouseleave', e => {
        abilitiesCard.forEach((other, key) => {
            other.style.removeProperty('transform');
        })
    })
});