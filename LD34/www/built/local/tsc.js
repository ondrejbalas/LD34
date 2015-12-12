var App = (function () {
    function App(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        var spacerSize = 280;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        var kb = this.game.input.keyboard;
        var leftKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.A), kb.addKey(Phaser.Keyboard.D));
        var leftArea = new PlayArea(this.game, 0, 0, playAreaWidth, this.game.height, leftKeys);
        App.register(leftArea);
        var rightKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.LEFT), kb.addKey(Phaser.Keyboard.RIGHT));
        var rightArea = new PlayArea(this.game, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys);
        App.register(rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        var scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        App.register(scoreArea);
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
    var app = new App(1600, 800);
};
var PlayArea = (function () {
    function PlayArea(game, x, y, width, height, input) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = input;
        this.playAreaColor = 0x000000;
    }
    PlayArea.prototype.preload = function () {
        this.g = this.game.add.graphics(this.x, this.y);
    };
    PlayArea.prototype.create = function () {
        this.player = new Player(this);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        this.g.clear();
        this.g.lineStyle(6, this.playAreaColor, 1);
        this.g.beginFill(this.playAreaColor, 1);
        this.g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);
        this.g.endFill();
    };
    return PlayArea;
})();
var Player = (function () {
    function Player(playArea) {
        this.playArea = playArea;
        this.size = 20;
        this.minColor = 0x900000;
        this.maxColor = 0xFF0000;
        this.color = 0xFF0000;
        this.colorIncrement = 0x010000;
        this.isColorIncreasing = 1;
        this.x = playArea.width / 2;
        this.y = playArea.height - 44;
        this.g = playArea.g;
        this.input = playArea.input;
    }
    Player.prototype.preload = function () { };
    Player.prototype.create = function () {
    };
    Player.prototype.update = function () {
        this.sizeMod = (0.05 * ((this.color - this.minColor) / (this.maxColor - this.minColor)));
        this.frameSize = this.size * (1 + this.sizeMod);
        if (this.input.isLeft()) {
            this.x -= 12;
        }
        else if (this.input.isRight()) {
            this.x += 12;
        }
        this.x = Math.min(Math.max(this.x, 0 + (this.frameSize + 40)), this.playArea.width - (this.frameSize + 40));
        this.color += (this.colorIncrement * this.isColorIncreasing);
        if (this.color >= this.maxColor) {
            this.isColorIncreasing = -1;
            this.color = this.maxColor;
        }
        if (this.color <= this.minColor) {
            this.isColorIncreasing = 32;
            this.color = this.minColor;
        }
        this.g.lineStyle(2, this.color, 1);
        this.g.beginFill(this.color, 1);
        this.g.drawTriangle([new Phaser.Point(this.x - this.frameSize, this.y), new Phaser.Point(this.x, this.y - (this.frameSize * 1.5)), new Phaser.Point(this.x + this.frameSize, this.y)], false);
        this.g.endFill();
    };
    return Player;
})();
var PlayerInput = (function () {
    function PlayerInput(leftKey, rightKey) {
        this.leftKey = leftKey;
        this.rightKey = rightKey;
    }
    PlayerInput.prototype.isKeyPressed = function () {
        return (this.leftKey.isDown || this.rightKey.isDown);
    };
    PlayerInput.prototype.otherInputHasKeyPressed = function () {
        if (!this.otherInput) {
            return true;
        }
        return this.otherInput.isKeyPressed();
    };
    PlayerInput.prototype.isLeft = function () {
        return this.otherInputHasKeyPressed() && (this.leftKey.isDown);
    };
    PlayerInput.prototype.isRight = function () {
        return this.otherInputHasKeyPressed() && (this.rightKey.isDown);
    };
    return PlayerInput;
})();
var ScoreArea = (function () {
    function ScoreArea(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bgColor = 0x00309A;
    }
    ScoreArea.prototype.preload = function () {
        this.g = this.game.add.graphics(this.x, this.y);
    };
    ScoreArea.prototype.create = function () { };
    ScoreArea.prototype.update = function () {
        this.g.lineStyle(0);
        this.g.beginFill(this.bgColor, 1);
        this.g.drawRect(0, 0, this.width, this.height);
        this.g.endFill();
    };
    return ScoreArea;
})();

//# sourceMappingURL=tsc.js.map
