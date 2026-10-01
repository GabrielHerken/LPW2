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
    static right = new Vector2(1, 0);
    static one = new Vector2(1, 1);
}

export class Transform {
    constructor(position=Vector2.zero, rotation=0, scale=Vector2.one) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
}

export class GameObject {
    constructor(sprite, layer, localTransform, velocity, parent, name) {
        this.sprite = sprite;
        this.layer = layer;
        this.localTransform = localTransform;
        this.velocity = velocity;
        this.colliders = [];
        this.children = [];
        this.parent = parent;
        this.name = name;
        if (parent != null) {
            this.setGlobalTransform();
        } else {
            this.globalTransform = localTransform;
        }
    }

    setGlobalTransform() {
        if (this.parent == null) {
            return;
        }

        const globalTransform = new Transform();
        globalTransform.position = new Vector2();
        globalTransform.position.x = this.parent.globalTransform.position.x
                                   + this.localTransform.position.x * Math.cos(this.parent.globalTransform.rotation * Math.PI / 180)
                                   - this.localTransform.position.y * Math.sin(this.parent.globalTransform.rotation * Math.PI / 180);
        globalTransform.position.y = this.parent.globalTransform.position.y
                                   + this.localTransform.position.x * Math.sin(this.parent.globalTransform.rotation * Math.PI / 180)
                                   + this.localTransform.position.y * Math.cos(this.parent.globalTransform.rotation * Math.PI / 180);
        globalTransform.rotation = this.localTransform.rotation + this.parent.globalTransform.rotation;
        globalTransform.scale = new Vector2(this.parent.globalTransform.scale.x * this.localTransform.scale.x, this.parent.globalTransform.scale.y * this.localTransform.scale.y);
        this.globalTransform = globalTransform;
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

export class Entity {
    constructor(gameObject, maxHealth) {
        this.gameObject = gameObject;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }
}

export class CircleCollider {
    constructor(position, radius, owner) {
        this.position = position;
        this.radius = radius;
        this.owner = owner
    }
}