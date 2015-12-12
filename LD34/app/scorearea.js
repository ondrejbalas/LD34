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
