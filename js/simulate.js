import { Body } from "./body.js";
import { Vector } from "./vector.js";

export class Simulator {
    constructor(drawer, bodies, G = 1, softening = 0.005, speed = 0.2) {
        this.drawer = drawer;
        this.bodies = bodies;
        this.G = G;
        this.softening = softening;
        this.speed = speed;
        this.lastTimestep = 0;
    }

    static figure8(drawer) {
        return new Simulator(drawer, [
            new Body(new Vector([0,0]), new Vector([-0.93240737144104,-0.86473146092102]), 1),
            new Body(new Vector([0.97000435669734,-0.24308753153583]), new Vector([0.93240737144104/2,0.86473146092102/2]), 1),
            new Body(new Vector([-0.97000435669734,0.24308753153583]), new Vector([0.93240737144104/2,0.86473146092102/2]), 1),
        ]);
    }
    
    static random(drawer, numBodies) {
        const bodies = [];

        for (let i = 0; i < numBodies; i++) {
            bodies.push(new Body(Vector.random([-.5,-.5], [.5,.5]), Vector.zero(2), 1));
        }

        return new Simulator(drawer, bodies);
    }

    step(timestamp) {
        const timeDelta = this.speed * Math.min(timestamp - this.lastTimestep, 100) / 1000;
        this.updateProperties(timeDelta);
        this.drawer.draw(this.bodies);

        this.lastTimestep = timestamp;
        window.requestAnimationFrame(timestep => this.step(timestep));
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
                
                const acceleration = difference.multiply(- this.G * bodyB.mass / Math.max(Math.pow(magnitude, 3), this.softening));

                bodyA.velocity = bodyA.velocity.add(acceleration.multiply(timeDelta/2));
            });
        });

        // Update Position
        this.bodies.forEach((body) => {
            body.updatePosition(body.position.add(body.velocity.multiply(timeDelta)));
        });

        // Update Velocity 
        this.bodies.forEach((bodyA) => {
            this.bodies.forEach((bodyB) => {
                if (bodyA === bodyB) {
                    return;
                }
                const difference = bodyA.position.sub(bodyB.position);
                const magnitude = difference.magnitude;
                
                const acceleration = difference.multiply(- this.G * bodyB.mass / Math.max(Math.pow(magnitude, 3), this.softening));

                bodyA.velocity = bodyA.velocity.add(acceleration.multiply(timeDelta/2));
            });
        });
    }
}
