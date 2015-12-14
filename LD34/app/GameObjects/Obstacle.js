var Obstacle = (function () {
    function Obstacle(sprite, circle, type) {
        this.sprite = sprite;
        this.circle = circle;
        this.type = type;
    }
    Obstacle.prototype.isColliding = function (player) {
        return Phaser.Circle.intersects(this.circle, player.collisionCircle);
    };
    return Obstacle;
})();
