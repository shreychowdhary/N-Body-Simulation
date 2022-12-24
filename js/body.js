import { Vector } from "./vector.js";

export class Body {
    constructor(position, velocity,  mass) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
    }
}