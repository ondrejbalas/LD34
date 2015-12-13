var App = (function () {
    function App(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var spacerSize = 40;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        var kb = this.game.input.keyboard;
        var leftKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.A), kb.addKey(Phaser.Keyboard.D));
        var leftArea = new PlayArea(0, this.game, 0, 0, playAreaWidth, this.game.height, leftKeys);
        App.register(leftArea);
        var rightKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.LEFT), kb.addKey(Phaser.Keyboard.RIGHT));
        var rightArea = new PlayArea(1, this.game, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys);
        App.register(rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        var scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        App.register(scoreArea);
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
    App.requireTwoInputs = true;
    return App;
})();
window.onload = function () {
    var app = new App(1400, 800);
};
