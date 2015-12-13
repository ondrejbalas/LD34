var Player = (function () {
    function Player(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.speed = 800;
        this.size = 32;
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;
        ;
    }
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        console.log("creating player at " + this.startX + ", " + this.startY);
        this.image = PlayerImage.create(this.game, 64, 64, this.size);
        this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY, this.image.data);
        this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;
        this.body.offset.x = 64;
        this.body.offset.y = 64;
        this.input = this.playArea.input;
    };
    Player.prototype.update = function () {
        this.body.velocity.x = 0;
        this.frameSize = this.size;
        this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));
        if (this.input.isLeft()) {
            this.body.velocity.x = -this.speed;
        }
        else if (this.input.isRight()) {
            this.body.velocity.x = this.speed;
        }
    };
    return Player;
})();
