var App = (function () {
    function App(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        var leftArea = new PlayArea(this.game, 0, 0, 600, 600);
        App.register(leftArea);
        var rightArea = new PlayArea(this.game, 800, 0, 600, 600);
        App.register(rightArea);
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        _.each(App.objects, function (o) { return o.create(); });
    };
    App.prototype.update = function () {
        _.each(App.objects, function (o) { return o.update(); });
    };
    App.register = function (obj) {
        this.objects.push(obj);
    };
    App.objects = [];
    return App;
})();
window.onload = function () {
    var app = new App(1400, 600);
};
var PlayArea = (function () {
    function PlayArea(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    PlayArea.prototype.preload = function () { };
    PlayArea.prototype.create = function () {
        this.player = new Player(this.game, this);
        var g = this.game.add.graphics(this.x, this.y);
        g.lineStyle(6, 0x666666, 1);
        console.log("Creating rectangle with X: " + this.x);
        g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () { };
    return PlayArea;
})();
var Player = (function () {
    function Player(game, playArea) {
    }
    Player.prototype.create = function () { };
    Player.prototype.preload = function () { };
    Player.prototype.update = function () { };
    return Player;
})();

//# sourceMappingURL=tsc.js.map
