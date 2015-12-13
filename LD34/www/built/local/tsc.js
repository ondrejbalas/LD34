var App = (function () {
    function App(width, height) {
        this.width = width;
        this.height = height;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        App.ranCreate = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
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
    App.requireTwoInputs = false;
    return App;
})();
window.onload = function () {
    var app = new App(1600, 800);
};
var Level = (function () {
    function Level() {
    }
    Level.create = function (speed, lines, lineWidth, goodDropRate, badDropRate, obstacleRate, maxObstaclesPerLine) {
        var lv = new Level();
        lv.data = [];
        var blankLines = lineWidth * 2;
        for (var i = 0; i < blankLines; i++) {
            lv.data.push(this.createEmptyLine(lineWidth));
        }
        var goodDrops = 0;
        var badDrops = 0;
        var obstacles = 0;
        for (var j = 0; j < lines; j++) {
            var line = this.createEmptyLine(lineWidth);
        }
        return new Level();
    };
    Level.createEmptyLine = function (width) {
        var newArray = new Uint8Array(width);
        newArray[0] = 1;
        newArray[width - 1] = 1;
        return newArray;
    };
    Level.howManyInThisRow = function (lineNumber, rate, totalSoFar, maxPerLine) {
        var expectedRate = rate * lineNumber;
        var shortBy = expectedRate - totalSoFar;
        if (shortBy < 0)
            return 0;
        if ()
            ;
    };
    return Level;
})();
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
    };
    PlayArea.prototype.create = function () {
        this.g = this.game.add.graphics(this.x, this.y);
        this.player = new Player(this, this.game);
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
    function Player(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.size = 20;
        this.speed = 800;
        this.minColor = 0x900000;
        this.maxColor = 0xFF0000;
        this.color = 0xFF0000;
        this.colorIncrement = 0x010000;
        this.isColorIncreasing = 1;
        this.startX = playArea.width / 2;
        this.startY = playArea.height - 44;
        ;
    }
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY);
        this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.body.x = this.startX;
        this.body.y = this.startY;
        this.g = this.playArea.g;
        this.input = this.playArea.input;
    };
    Player.prototype.update = function () {
        this.body.velocity.x = 0;
        this.sizeMod = (0.05 * ((this.color - this.minColor) / (this.maxColor - this.minColor)));
        this.frameSize = this.size * (1 + this.sizeMod);
        this.body.x = Math.min(Math.max(this.body.x, 0 + (this.frameSize + 40)), this.playArea.width - (this.frameSize + 40));
        if (this.input.isLeft()) {
            this.body.velocity.x = -this.speed;
        }
        else if (this.input.isRight()) {
            this.body.velocity.x = this.speed;
        }
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
        this.g.drawTriangle([new Phaser.Point(this.body.x - this.frameSize, this.body.y), new Phaser.Point(this.body.x, this.body.y - (this.frameSize * 1.5)), new Phaser.Point(this.body.x + this.frameSize, this.body.y)], false);
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
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.leftKey.isDown);
        }
        return this.leftKey.isDown;
    };
    PlayerInput.prototype.isRight = function () {
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.rightKey.isDown);
        }
        return this.rightKey.isDown;
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
    ScoreArea.prototype.create = function () {
    };
    ScoreArea.prototype.update = function () {
        this.g.lineStyle(0);
        this.g.beginFill(this.bgColor, 1);
        this.g.drawRect(0, 0, this.width, this.height);
        this.g.endFill();
    };
    return ScoreArea;
})();

//# sourceMappingURL=tsc.js.map
