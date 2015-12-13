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
    PlayArea.prototype.setLevel = function (level) {
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
    };
    PlayArea.prototype.preload = function () {
    };
    PlayArea.prototype.create = function () {
        this.g = this.game.add.graphics(this.x, this.y);
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 2);
        this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
        this.bgSprite3 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[2]);
        this.bgSprite3.tileScale.x = 4;
        this.bgSprite3.tileScale.y = 4;
        this.bgSprite4 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[3]);
        this.bgSprite4.tileScale.x = 4;
        this.bgSprite4.tileScale.y = 4;
        this.player = new Player(this, this.game);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        var speed = 0.5;
        this.bgSprite1.tilePosition.y += speed / 2;
        this.bgSprite2.tilePosition.y += speed * 1.5;
        this.bgSprite3.tilePosition.y += speed * 3;
        this.bgSprite4.tilePosition.y += speed * 8;
    };
    return PlayArea;
})();
