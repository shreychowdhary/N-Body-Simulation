export class Vector {
    constructor(elements) {
        this.elements = elements;
    }

    static random(minValues, maxValues) {
        return new Vector(minValues.map((min, index) => Math.random() * (maxValues[index] - min) + min));
    }
    
    static zero(length) {
        const elements = new Array(length);
        for (let i = 0; i < length; i++) {
            elements[i] = 0;
        }
        return new Vector(elements);
    }

    multiply(scalar) {
        return new Vector(this.elements.map((x) => x * scalar));
    }

    add(vector) {
        if (this.length !== vector.length) {
            throw(`Can't add vector of length: ${this.length} with vector of length: ${vector.length}`);
        }
        return new Vector(this.elements.map((x, index) => x + vector.elements[index]));
    }

    sub(vector) {
        if (this.length !== vector.length) {
            throw(`Can't subtract vector of length: ${this.length} with vector of length: ${vector.length}`);
        }
        return new Vector(this.elements.map((x, index) => x - vector.elements[index]));
    }

    get magnitude() {
        return Math.sqrt(this.elements.map((x) => x * x).reduce((sum, cur) => sum+cur, 0));
    }

    get length() {
        return this.elements.length;
    }    
}