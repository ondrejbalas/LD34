var App = (function () {
    function App(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
    };
    App.prototype.create = function () {
        this.mainArea = new PlayArea(this.game, 0, 0, 600, 600);
        this.mainArea.create();
    };
    App.prototype.update = function () {
    };
    return App;
})();
window.onload = function () {
    var app = new App(1200, 600);
};
var PlayArea = (function () {
    function PlayArea(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    PlayArea.prototype.create = function () {
        this.player = new Player(this.game, this);
        var g = this.game.add.graphics(this.x, this.y);
        g.lineStyle(4, 0xFF0000, 1);
        g.drawRect(this.x, this.y, this.width, this.height);
    };
    return PlayArea;
})();
var Player = (function () {
    function Player(game, playArea) {
    }
    Player.prototype.create = function () {
    };
    return Player;
})();

//# sourceMappingURL=tsc.js.map
