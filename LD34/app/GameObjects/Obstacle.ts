class Obstacle implements IHittable {
    constructor(public sprite: Phaser.Sprite, public circle: Phaser.Circle, public type: number) {
        
    }

    isColliding(player: Player): boolean {
        return Phaser.Circle.intersects(this.circle, player.collisionCircle);
    }
}