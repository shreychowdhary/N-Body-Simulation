import { Vector } from "./vector.js";

export class Drawer {
    constructor(canvas, ctx, noiseLevel = 25) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.massToSizeScale = .175;
        this.canvasScaling = 1.25;
        this.noiseLevel = noiseLevel
    }

    draw(bodies) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        this.ctx.fillStyle = "#282123";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        bodies.forEach(body => {
            this.drawTrail(body);
        });

        bodies.forEach(body => {
            this.drawBody(body);
        });

    }
    
    drawTrail(body) {
        const [x,y] = this.calculateCanvasPosition(body.position);

        // Draw Trail
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = "5";
        this.ctx.strokeStyle = "rgba(199,193,195,1)";
        this.ctx.beginPath();
        const [startX, startY] = this.calculateCanvasPosition(body.pastPositions[0]);
        this.ctx.moveTo(startX, startY);
        for (let position of body.pastPositions) {
            const [curX, curY] = this.calculateCanvasPosition(position);
            this.ctx.lineTo(curX, curY);
        }
        this.ctx.stroke();
    }

    drawBody(body) {
        const [x,y] = this.calculateCanvasPosition(body.position);
        // Draw Body
        const radius = this.calculateBodyRadius(body);
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        const grad = this.ctx.createRadialGradient(x, y, radius * .5, x, y, radius);
        grad.addColorStop(0, "#f1735a");
        grad.addColorStop(0.075, "rgba(229, 135, 179, .95");
        grad.addColorStop(0.125, "rgba(229, 135, 179, .9)");
        grad.addColorStop(0.35, "rgba(130, 118, 179, .75)");
        grad.addColorStop(0.5, "rgba(70, 98, 165, .6)");
        grad.addColorStop(.7, "rgba(40, 53, 86, .4)");
        grad.addColorStop(1, "rgba(40, 33, 35, 0)");
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Draw noise
        this.drawNoise(body);
    }

    drawNoise(body) {
        const radius = this.calculateBodyRadius(body);
        const [centerX, centerY] = this.calculateCanvasPosition(body.position);
        const image = this.ctx.getImageData(centerX-radius,centerY-radius,radius*2,radius*2);
        let i = 0;
        for (let i = 0; i < image.data.length; i+=4) {
            let x = (i % (radius*8))/4 - radius;
            let y = (i / (radius*8)) - radius;
            const threshold = radius*(0.8 + Math.random()*0.2);
            const dist = new Vector([x,y]).magnitude;
            if (dist < threshold) {
                const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
                const noise = (Math.random() - 0.5) * this.noiseLevel;
                image.data[i] = clamp(image.data[i]+noise, 0, 255);
                image.data[i+1] = clamp(image.data[i+1]+noise, 0, 255);
                image.data[i+2] = clamp(image.data[i+2]+noise, 0, 255);
            } 
        }
        this.ctx.putImageData(image, centerX-radius, centerY-radius);
    }

    calculateCanvasPosition(position) {
        const canvasSize = Math.min(this.canvas.width, this.canvas.height);
        return [
            position.elements[0]*(canvasSize/(2*this.canvasScaling))+(this.canvas.width/2),
            position.elements[1]*(canvasSize/(2*this.canvasScaling))+(this.canvas.height/2)
        ];
    }

    calculateBodyRadius(body) {
        const canvasSize = Math.min(this.canvas.width, this.canvas.height);
        return (canvasSize/(2*this.canvasScaling)) * this.massToSizeScale * body.mass;
    }
}