var PlayArea = (function () {
    function PlayArea(id, game, scoreArea, x, y, width, height, input, flagGameOver) {
        this.id = id;
        this.game = game;
        this.scoreArea = scoreArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = input;
        this.flagGameOver = flagGameOver;
        this.gameIsOver = false;
        this.counter = 0;
        this.bgLayer = this.game.add.group();
        this.obstacleLayer = this.game.add.group();
        this.playerLayer = this.game.add.group();
    }
    PlayArea.prototype.setLevel = function (levelNumber) {
        var _this = this;
        this.scoreArea.setLevel(levelNumber);
        console.log("setLevel: " + levelNumber);
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        var level = LevelFactory.createLevel(this, this.game, levelNumber);
        level.preload();
        level.create(this.obstacleLayer, function () {
            level.destroy();
            _this.setLevel(levelNumber + 1);
        });
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);
        if (!this.bgSprite1) {
            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        }
        else {
            this.bgSprite1.destroy();
            this.bgSprite2.destroy();
            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        }
        this.bgSprite1.autoScroll(0, 16);
        this.bgSprite2.autoScroll(0, 32 * 1.4);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
    };
    PlayArea.prototype.preload = function () {
    };
    PlayArea.prototype.create = function () {
        this.setLevel(1);
        this.player = new Player(this, this.game, this.playerLayer);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        this.currentLevel.update();
        var colliding = this.currentLevel.isPlayerColliding(this.player);
        if (colliding && colliding.type === 1) {
            console.log(this.flagGameOver);
            this.flagGameOver();
        }
    };
    PlayArea.prototype.gameOver = function () {
        this.gameIsOver = true;
        this.currentLevel.gameOver = true;
        this.currentLevel.destroy();
        this.scoreArea.showGameOver();
        this.player.gameOver();
    };
    return PlayArea;
})();
