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
            new Body(new Vector([0,0]), new Vector([-0.93240737144104,-0.86473146092102]), 1),
            new Body(new Vector([0.97000435669734,-0.24308753153583]), new Vector([0.93240737144104/2,0.86473146092102/2]), 1),
            new Body(new Vector([-0.97000435669734,0.24308753153583]), new Vector([0.93240737144104/2,0.86473146092102/2]), 1),
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
        this.draw(canvas, ctx);
        this.lastTimestep = timestamp;
        window.requestAnimationFrame((time) => this.step(canvas, ctx, time));
    }

    draw(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.fillStyle = "#282123";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.bodies.forEach(body => {
            const position = body.position.elements;
            ctx.beginPath();
            ctx.arc(position[0]*(canvas.width/4)+(canvas.width/2), position[1]*(canvas.height/4)+(canvas.height/2), 8, 0, 2 * Math.PI);
            ctx.strokeStyle = "white";
            ctx.stroke();
        });

    }

    // Using leapfrog method
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

                bodyA.velocity = bodyA.velocity.add(acceleration.multiply(timeDelta/2));
            });
        });

        // Update Position
        this.bodies.forEach((body) => {
            body.position = body.position.add(body.velocity.multiply(timeDelta));
        });

        // Update Velocity 
        this.bodies.forEach((bodyA) => {
            this.bodies.forEach((bodyB) => {
                if (bodyA === bodyB) {
                    return;
                }
                const difference = bodyA.position.sub(bodyB.position);
                const magnitude = difference.magnitude;
                
                const acceleration = difference.multiply(- this.G * bodyB.mass / Math.pow(magnitude, 3));

                bodyA.velocity = bodyA.velocity.add(acceleration.multiply(timeDelta/2));
            });
        });
    }
}
