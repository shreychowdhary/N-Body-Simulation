import { Vector } from "./vector.js";

export class Body {
    constructor(position, velocity,  mass) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.pastPositions = [];
        this.pastPositionCounter = 0;
    }

    updatePosition(position) {
        if (this.pastPositionCounter % 5 === 0) {
            if (this.pastPositions.length >= 200) {
                this.pastPositions.shift();
            }
            this.pastPositions.push(this.position);
            this.pastPositionCounter = 1;
        }
        this.pastPositionCounter++;
        this.position = position;
    } 

    
}