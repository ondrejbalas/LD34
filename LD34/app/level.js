var Level = (function () {
    function Level(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.sprites = [];
        this.x = playArea.x;
        this.y = playArea.y;
    }
    Level.prototype.preload = function () { };
    Level.prototype.create = function () {
        var image = ObstacleImage.create(this.game, this.playArea.width / this.lineWidth);
        var newSprite = this.game.add.sprite(this.x + 100, this.y + 100, image);
        newSprite.z = 100000;
    };
    Level.prototype.update = function () {
    };
    return Level;
})();
