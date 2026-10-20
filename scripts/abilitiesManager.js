const abilitiesSelector = document.getElementById('abilities');

export function newUpgrades() {
    return new Promise(res => {
        abilitiesSelector.classList.remove('hide');

        res();
    });
}