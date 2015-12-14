var Player = (function () {
    function Player(playArea, game, layer) {
        this.playArea = playArea;
        this.game = game;
        this.layer = layer;
        this.speed = 400;
        this.size = 8;
        this.isGameOver = false;
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;
        ;
    }
    Player.prototype.gameOver = function () {
        this.isGameOver = true;
        this.sprite.destroy();
    };
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        this.image = PlayerImage.create(this.game, 64, 64, 32);
        this.sprite = this.layer.create(this.startX, this.startY, this.image.data);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.body.offset.x = 16;
        this.body.offset.y = 16;
        this.input = this.playArea.input;
        this.collisionCircle = new Phaser.Circle(this.startX, this.startY, 32);
    };
    Player.prototype.update = function () {
        if (!this.isGameOver) {
            this.body.velocity.x = 0;
            var delta = (this.game.time.elapsedMS / 1000);
            this.size = Math.min(32, this.size + (delta / 2));
            this.body.offset.x = this.size * 2;
            this.body.offset.y = this.size * 2;
            this.sprite.scale.x = this.size / 16;
            this.sprite.scale.y = this.size / 16;
            this.frameSize = this.size;
            this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));
            this.collisionCircle.x = this.body.x;
            this.collisionCircle.y = this.body.y;
            this.collisionCircle.diameter = (this.size * 3);
            if (this.input.isLeft()) {
                this.body.velocity.x = -this.speed;
            }
            else if (this.input.isRight()) {
                this.body.velocity.x = this.speed;
            }
        }
    };
    return Player;
})();
