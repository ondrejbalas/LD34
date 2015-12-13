var PlayArea = (function () {
    function PlayArea(id, game, x, y, width, height, input) {
        this.id = id;
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = input;
        this.counter = 0;
        this.bgLayer = this.game.add.group();
        this.frontLayer = this.game.add.group();
    }
    PlayArea.prototype.setLevel = function (level) {
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        level.preload();
        level.create(this.frontLayer);
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
    };
    PlayArea.prototype.preload = function () {
    };
    PlayArea.prototype.create = function () {
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);
        this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
        this.bgLayer.add(this.bgSprite1);
        this.bgLayer.add(this.bgSprite2);
        this.player = new Player(this, this.game, this.frontLayer);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        this.currentLevel.update();
        var delta = (this.game.time.elapsedMS / 1000);
        var speed = 32;
        this.bgSprite1.tilePosition.y += delta * (speed / 2);
        this.bgSprite2.tilePosition.y += delta * (speed * 1.4);
    };
    return PlayArea;
})();
