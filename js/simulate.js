import { Body } from "./body.js";
import { Vector } from "./vector.js";

export class Simulator {
    constructor(bodies, G) {
        this.bodies = bodies;
        this.lastTimestep = 0;
        this.G = G;
    }

    static figure8() {
        return new Simulator([
            new Body(new Vector([0,0]), new Vector([-0.9324,-.8647]), 1),
            new Body(new Vector([0.97,-0.243]), new Vector([0.9324/2,.8647/2]), 1),
            new Body(new Vector([-0.97,0.243]), new Vector([0.9324/2,.8647/2]), 1),
        ], 1);
    }
    
    static random(numBodies, G) {
        const bodies = [];

        for (let i = 0; i < numBodies; i++) {
            this.bodies.push(new Body(Vector.random([-.5,-.5], [.5,.5]), Vector.zero(2), 1));
        }
        return new Simulator(bodies, G);
    }

    step(canvas, ctx, timestamp) {
        const timeDelta =  Math.min(timestamp - this.lastTimestep, 100)/1000;
        this.updateProperties(timeDelta);
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        this.bodies.forEach(body => {
            const position = body.position.elements;
            ctx.beginPath();
            ctx.arc(position[0]*(canvas.width/4)+(canvas.width/2), position[1]*(canvas.height/4)+(canvas.height/2), 5, 0, 2 * Math.PI);
            ctx.stroke();
        });

        this.lastTimestep = timestamp;
        window.requestAnimationFrame((time) => this.step(canvas, ctx, time));
    }

    updateProperties(timeDelta) {
        // Update Velocity
        this.bodies.forEach((bodyA) => {
            this.bodies.forEach((bodyB) => {
                if (bodyA === bodyB) {
                    return;
                }
                const difference = bodyA.position.sub(bodyB.position);
                const magnitude = difference.magnitude;
                
                const acceleration = difference.multiply(- this.G * bodyB.mass / Math.pow(magnitude, 3));

                bodyA.velocity = bodyA.velocity.add(acceleration.multiply(timeDelta));
            });
        });

        // Update Acceleration
        this.bodies.forEach((body) => {
            body.position = body.position.add(body.velocity.multiply(timeDelta));
        });
    }
}
