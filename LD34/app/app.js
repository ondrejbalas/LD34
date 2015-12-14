var App = (function () {
    function App(width, height) {
        this.isGameOver = false;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        var _this = this;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.setBackgroundColor(0x00309A);
        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        var kb = this.game.input.keyboard;
        this.scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        var leftKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.A), kb.addKey(Phaser.Keyboard.D));
        var callGameOver = function () {
            if (!_this.isGameOver) {
                _this.isGameOver = true;
                _this.scoreArea.running = false;
                _this.scoreArea.showGameOver();
                _this.leftArea.gameOver();
                _this.rightArea.gameOver();
            }
        };
        this.leftArea = new PlayArea(0, this.game, this.scoreArea, 0, 0, playAreaWidth, this.game.height, leftKeys, callGameOver);
        App.register(this.leftArea);
        var rightKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.LEFT), kb.addKey(Phaser.Keyboard.RIGHT));
        this.rightArea = new PlayArea(1, this.game, this.scoreArea, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys, callGameOver);
        App.register(this.rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        App.register(this.scoreArea);
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
