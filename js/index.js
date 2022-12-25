import { Simulator } from "./simulate.js";
import { Drawer } from "./drawer.js";

function resizeCanvas(canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    resizeCanvas(canvas);
    window.onresize = () => resizeCanvas(canvas);
    const drawer = new Drawer(canvas, ctx);
    const simulator = Simulator.figure8(drawer);
    window.requestAnimationFrame(timestep => simulator.step(timestep));
}

main();