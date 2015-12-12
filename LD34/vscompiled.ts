var App = (function () {
    function App(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        var leftArea = new PlayArea(this.game, 0, 0, 600, 600);
        App.register(leftArea);
        var rightArea = new PlayArea(this.game, 800, 0, 600, 600);
        App.register(rightArea);
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        App.ranCreate = true;
        _.each(App.objects, function (o) { return o.create(); });
    };
    App.prototype.update = function () {
        _.each(App.objects, function (o) { return o.update(); });
    };
    App.register = function (obj) {
        this.objects.push(obj);
        if (App.ranPreload) {
            obj.preload();
        }
        if (App.ranCreate) {
            obj.create();
        }
    };
    App.objects = [];
    App.ranPreload = false;
    App.ranCreate = false;
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
        this.g = this.game.add.graphics(this.x, this.y);
        this.g.lineStyle(6, 0x666666, 1);
        this.g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);
        this.player = new Player(this);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () { };
    return PlayArea;
})();
var Player = (function () {
    function Player(playArea) {
        this.playArea = playArea;
        this.size = 100;
        this.x = playArea.width / 2;
        this.y = playArea.height - 44;
        this.g = playArea.g;
    }
    Player.prototype.preload = function () { };
    Player.prototype.create = function () {
        this.g.lineStyle(2, 0xFF0000, 1);
        this.g.beginFill(0xFF0000, 1);
        this.g.drawTriangle([new Phaser.Point(this.x - this.size, this.y), new Phaser.Point(this.x, this.y - (this.size * 1.5)), new Phaser.Point(this.x + this.size, this.y)], false);
        this.g.endFill();
    };
    Player.prototype.update = function () {
    };
    return Player;
})();
//# sourceMappingURL=vscompiled.ts.map