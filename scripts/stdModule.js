export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    somar(outro) {
        return new Vector2(this.x + outro.x, this.y + outro.y);
    }

    multiplicar(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    normalize() {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length == 0) return Vector2.zero;
        return new Vector2(this.x / length, this.y / length);
    }

    static zero = new Vector2(0, 0);
    static up = new Vector2(0, -1);
}

export class GameObject {
    constructor(sprite, layer, position, velocity, rotation) {
        this.sprite = sprite;
        this.layer = layer;
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
    }
}

export class Attack {
    constructor(owner, attackEffect, maxCooldown) {
        this.owner = owner;
        this.attackEffect = attackEffect;
        this.maxCooldown = maxCooldown;
        this.currentCooldown = 0;
    }
}