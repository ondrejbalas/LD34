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
