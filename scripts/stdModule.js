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

    returnGlobalTransform(parentTransform) {
        if (parentTransform == null)
            return;

        const globalTransform = new Transform();
        globalTransform.position = new Vector2();
        globalTransform.position.x = parentTransform.position.x
                                   + this.position.x * Math.cos(parentTransform.rotation * Math.PI / 180)
                                   - this.position.y * Math.sin(parentTransform.rotation * Math.PI / 180);
        globalTransform.position.y = parentTransform.position.y
                                   + this.position.x * Math.sin(parentTransform.rotation * Math.PI / 180)
                                   + this.position.y * Math.cos(parentTransform.rotation * Math.PI / 180);
        globalTransform.rotation = this.rotation + parentTransform.rotation;
        globalTransform.scale = new Vector2(parentTransform.scale.x * this.scale.x, parentTransform.scale.y * this.scale.y);
        
        return globalTransform
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
            this.globalTransform = this.localTransform.returnGlobalTransform(this.parent.globalTransform);
        } else {
            this.globalTransform = localTransform;
        }
        this.tags = [];
        this.components = {};
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    addComponent(type, component) {
        this.components[type] = component;
    }

    getComponent(component) {
        return this.components[component];
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

    damageCalculation(damage) {
        return damage;
    }

    getHit(damage) {
        this.health -= this.damageCalculation(damage);

        if (this.health <= 0)
            this.die();
    }

    die() {
        throw new Error('Função die não implementada');
    }
}

export class CircleCollider {
    constructor(localTransform, radius, owner) {
        this.localTransform = localTransform;
        this.globalTransform = localTransform.returnGlobalTransform(owner.globalTransform);
        this.radius = radius;
        this.owner = owner
    }
}