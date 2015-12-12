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
