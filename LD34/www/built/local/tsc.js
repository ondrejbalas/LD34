var Game = (function () {
    function Game(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    Game.prototype.preload = function () {
    };
    Game.prototype.create = function () {
    };
    Game.prototype.update = function () {
    };
    return Game;
})();
window.onload = function () {
    var game = new Game(800, 600);
};

//# sourceMappingURL=tsc.js.map
