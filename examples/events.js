import {
    defineLordIconIllustration
} from '../build/lord-icon-illustration.js';

defineLordIconIllustration(lottie.loadAnimation);

document.addEventListener('DOMContentLoaded', (event) => {
    const element = document.querySelector('lord-icon-illustration');

    element.addEventListener('state', e => {
        document.getElementById('state').innerText = e.detail.state;
    });
});