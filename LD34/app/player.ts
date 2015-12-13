/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private startX: number;
    private startY: number;

    private speed: number = 800;

    private size: number = 32; // size
    private frameSize: number; // size this frame (used for pulsing)

    private input: PlayerInput;
    private image: PlayerImage;
    private sprite: Phaser.Sprite;
    private body: Phaser.Physics.Arcade.Body;

    constructor(private playArea: PlayArea, private game: Phaser.Game) {
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;;
    }

    preload(): void {

    }

    create(): void {
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
    }

    update(): void {
        this.body.velocity.x = 0;
        //this.body.y = 250;
        //if (this.body.x < 40) this.body.x = 40;
        //if (this.body.x )
        
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