var App = (function () {
    function App(width, height) {
        this.gameStarted = false;
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
        this.kb = this.game.input.keyboard;
        this.kb.addKey(Phaser.Keyboard.ENTER);
        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        this.scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        var leftKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.A), this.kb.addKey(Phaser.Keyboard.D));
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
        var rightKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.LEFT), this.kb.addKey(Phaser.Keyboard.RIGHT));
        this.rightArea = new PlayArea(1, this.game, this.scoreArea, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys, callGameOver);
        App.register(this.rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        App.ranCreate = true;
        _.each(App.objects, function (o) { return o.create(); });
        this.instructionsText = this.game.add.text(this.game.width / 2, this.game.height / 2, "Welcome to my submission to Ludum Dare 34!\r\n\r\nYou will be controlling two balls of electricity.\r\n\r\nControl the left one by using the A and D keys, and the right one with the Left and Right arrow keys.\r\n\r\nThey cannot move independently and must be moved TOGETHER.\r\n\r\nTry it now by pressing the A key and LEFT arrow together.\r\n\r\nPress ENTER to play.", null);
        this.instructionsText.anchor.setTo(0.5, 0.5);
        this.instructionsText.fontSize = 28;
        var grd = this.instructionsText.context.createLinearGradient(0, 0, 0, this.instructionsText.canvas.height);
        grd.addColorStop(0, '#FFFBA4');
        grd.addColorStop(1, '#288A00');
        this.instructionsText.fill = grd;
        this.instructionsText.align = 'center';
        this.instructionsText.stroke = '#000000';
        this.instructionsText.strokeThickness = 2;
        this.instructionsText.setShadow(7, 7, 'rgba(0,0,0,0.5)', 5);
    };
    App.prototype.update = function () {
        if (this.kb.isDown(Phaser.Keyboard.ENTER)) {
            if (!this.gameStarted) {
                this.instructionsText.visible = false;
                this.gameStarted = true;
                App.register(this.scoreArea);
                this.leftArea.start();
                this.rightArea.start();
            }
        }
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
    var app = new App(1400, 700);
};
