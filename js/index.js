import { Simulator } from "./simulate.js";

function resizeCanvas(canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loop(timestamp) {
    var progress = timestamp - lastRender

    update(progress)
    draw()

    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    resizeCanvas(canvas);
    window.onresize = () => resizeCanvas(canvas);

    const simulator = Simulator.figure8();
    window.requestAnimationFrame((time) => simulator.step(canvas, ctx, time));
}

main();