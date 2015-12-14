/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private startX: number;
    private startY: number;

    private speed: number = 400;

    public size: number = 8; // size
    private frameSize: number; // size this frame (used for pulsing)

    private input: PlayerInput;
    private image: PlayerImage;
    private sprite: Phaser.Sprite;
    private body: Phaser.Physics.Arcade.Body;

    public isGameOver: boolean = false;
    public gameOver(): void {
        this.isGameOver = true;
        this.sprite.destroy();
    }

    public collisionCircle: Phaser.Circle;

    constructor(private playArea: PlayArea, private game: Phaser.Game, private layer: Phaser.Group) {
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;;
    }

    preload(): void {

    }

    create(): void {
        this.image = PlayerImage.create(this.game, 64, 64, 32);
        this.sprite = this.layer.create(this.startX, this.startY, this.image.data);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        //this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY, this.image.data);
        //this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        

        //this.sprite.scale.x = .5;
        //this.sprite.scale.y = .5;

        this.body.offset.x = 16;
        this.body.offset.y = 16;

        this.input = this.playArea.input;

        this.collisionCircle = new Phaser.Circle(this.startX, this.startY, 32);
    }

    update(): void {
        if (!this.isGameOver) {
            this.body.velocity.x = 0;
            //this.body.y = 250;
            //if (this.body.x < 40) this.body.x = 40;
            //if (this.body.x )

            var delta = (this.game.time.elapsedMS / 1000);
            this.size = Math.min(32, this.size + (delta / 2));
            this.body.offset.x = this.size * 2;
            this.body.offset.y = this.size * 2;

            this.sprite.scale.x = this.size / 16;
            this.sprite.scale.y = this.size / 16;
            this.frameSize = this.size;

            // contain to the play area
            this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));

            this.collisionCircle.x = this.body.x;
            this.collisionCircle.y = this.body.y;
            this.collisionCircle.diameter = (this.size * 3);

            //this.game.debug.geom(new Phaser.Point(this.startX, this.startY), 'rgb(255,0,0)');
            //this.game.debug.geom(new Phaser.Point(this.body.x, this.body.y), 'rgb(255,255,0)');
            //this.game.debug.text("Size: " + this.size, this.playArea.x + 100, 100);
            //this.game.debug.geom(this.collisionCircle, 'rgb(255,0,0)', false);

            if (this.input.isLeft()) {
                this.body.velocity.x = -this.speed;
            }
            else if (this.input.isRight()) {
                this.body.velocity.x = this.speed;
            }
        }
    }
}