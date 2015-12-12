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
