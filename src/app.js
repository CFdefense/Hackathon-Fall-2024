import * as PIXI from 'pixi.js';

(async () => {
    const app = new PIXI.Application();
    await app.init({
        width: 640,
        height: 360,
        backgroundColor: 0x1099bb
    });

    document.body.appendChild(app.canvas);
})();