var Player = (function () {
    function Player(playArea, game, layer) {
        this.playArea = playArea;
        this.game = game;
        this.layer = layer;
        this.speed = 400;
        this.size = 8;
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;
        ;
    }
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        this.image = PlayerImage.create(this.game, 64, 64, 32);
        this.sprite = this.layer.create(this.startX, this.startY, this.image.data);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = .5;
        this.sprite.scale.y = .5;
        this.body.offset.x = 64;
        this.body.offset.y = 64;
        this.input = this.playArea.input;
    };
    Player.prototype.update = function () {
        this.body.velocity.x = 0;
        var delta = (this.game.time.elapsedMS / 1000);
        this.size = Math.min(32, this.size + (delta / 2));
        this.sprite.scale.x = this.size / 16;
        this.sprite.scale.y = this.size / 16;
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
