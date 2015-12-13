/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private startX: number;
    private startY: number;

    private g: Phaser.Graphics;
    private size: number = 20;
    private speed: number = 800;

    private minColor: number = 0x900000;
    private maxColor: number = 0xFF0000;
    private color: number = 0xFF0000;
    private colorIncrement: number = 0x010000;
    private isColorIncreasing: number = 1;

    private sizeMod: number;
    private frameSize: number;

    private input: PlayerInput;
    private sprite: Phaser.Sprite;
    private body: Phaser.Physics.Arcade.Body;

    constructor(private playArea: PlayArea, private game: Phaser.Game) {
        this.startX = playArea.width / 2;
        this.startY = playArea.height - 44;;
    }

    preload(): void {

    }

    create(): void {
        //console.log("creating player");
        this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY);
        this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        
        this.body.x = this.startX;
        this.body.y = this.startY;
        this.input = this.playArea.input;
    }

    update(): void {
        this.body.velocity.x = 0;
        //if (this.body.x < 40) this.body.x = 40;
        //if (this.body.x )

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
    }
}