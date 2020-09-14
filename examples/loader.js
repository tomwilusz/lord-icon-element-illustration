import {
    defineLordIconIllustration
} from '../build/lord-icon-illustration.js';

defineLordIconIllustration(lottie.loadAnimation);

async function loadIllustration(name) {
    const data = await fetch(`./illustration/${name}.json`);
    return await data.json();
}

async function assignIllustration() {
    const element = document.querySelector('lord-icon-illustration');

    const data = await Promise.all([
        loadIllustration('1-il-meeting-in'),
        loadIllustration('1-il-meeting-loop'),
        loadIllustration('1-il-meeting-action'),
    ]);

    element.illustration = data;
}

document.addEventListener('DOMContentLoaded', (event) => {
    assignIllustration();
});