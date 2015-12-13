/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private startX: number;
    private startY: number;

    private speed: number = 400;

    private size: number = 8; // size
    private frameSize: number; // size this frame (used for pulsing)

    private input: PlayerInput;
    private image: PlayerImage;
    private sprite: Phaser.Sprite;
    private body: Phaser.Physics.Arcade.Body;

    constructor(private playArea: PlayArea, private game: Phaser.Game, private layer: Phaser.Group) {
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;;
    }

    preload(): void {

    }

    create(): void {
        this.image = PlayerImage.create(this.game, 64, 64, 32);
        this.sprite = this.layer.create(this.startX, this.startY, this.image.data);
        //this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY, this.image.data);
        //this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        this.sprite.scale.x = .5;
        this.sprite.scale.y = .5;

        this.body.offset.x = 64;
        this.body.offset.y = 64;

        this.input = this.playArea.input;
    }

    update(): void {
        this.body.velocity.x = 0;
        //this.body.y = 250;
        //if (this.body.x < 40) this.body.x = 40;
        //if (this.body.x )

        var delta = (this.game.time.elapsedMS / 1000);
        this.size = Math.min(32, this.size + (delta / 2));

        this.sprite.scale.x = this.size / 16;
        this.sprite.scale.y = this.size / 16;
        this.frameSize = this.size;

        // contain to the play area
        this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));

        if (this.input.isLeft()) {
            this.body.velocity.x = -this.speed;
        }
        else if (this.input.isRight()) {
            this.body.velocity.x = this.speed;
        }
    }
}