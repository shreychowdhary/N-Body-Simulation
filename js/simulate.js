import { Body } from "./body.js";
import { Vector } from "./vector.js";

export class Simulator {
    constructor(bodies, G, softening = 0.005, speed = 0.2) {
        this.bodies = bodies;
        this.lastTimestep = 0;
        this.G = G;
        this.softening = softening;
        this.speed = speed;
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
            bodies.push(new Body(Vector.random([-.5,-.5], [.5,.5]), Vector.zero(2), 1));
        }

        return new Simulator(bodies, G);
    }

    step(canvas, ctx, timestamp) {
        const timeDelta =  this.speed * Math.min(timestamp - this.lastTimestep, 100)/1000;
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
            const x = position[0]*(canvas.width/2.5)+(canvas.width/2);
            const y = position[1]*(canvas.height/2.5)+(canvas.height/2);

            // Draw Trail
            ctx.lineCap = "round";
            ctx.lineWidth = "7";
            ctx.strokeStyle = "white";
            ctx.beginPath();
            const startX = body.pastPositions[0].elements[0]*(canvas.width/2.5)+(canvas.width/2);
            const startY = body.pastPositions[0].elements[1]*(canvas.height/2.5)+(canvas.height/2);
            ctx.moveTo(startX, startY);
            for (let position of body.pastPositions) {
                const curX = position.elements[0]*(canvas.width/2.5)+(canvas.width/2);
                const curY = position.elements[1]*(canvas.height/2.5)+(canvas.height/2);
                if (new Vector([curX,curY]).sub(new Vector([x,y])).magnitude < 25) {
                    break;
                } 
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        });

        this.bodies.forEach(body => {
            const position = body.position.elements;
            const x = position[0]*(canvas.width/2.5)+(canvas.width/2);
            const y = position[1]*(canvas.height/2.5)+(canvas.height/2);
            // Draw Body
            ctx.beginPath();
            ctx.arc(x, y, 80, 0, 2 * Math.PI);
            const grad = ctx.createRadialGradient(x, y, 25, x, y, 80);
            grad.addColorStop(0, "#f1735a");
            grad.addColorStop(0.075, "rgba(229, 135, 179, .95");
            grad.addColorStop(0.125, "rgba(229, 135, 179, .9)");
            grad.addColorStop(0.35, "rgba(130, 118, 179, .75)");
            grad.addColorStop(0.5, "rgba(70, 98, 165, .6)");
            grad.addColorStop(.675, "rgba(40, 53, 86, .4)");
            grad.addColorStop(1, "rgba(40, 33, 35, .1)");
            ctx.fillStyle = grad;
            ctx.fill();
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
