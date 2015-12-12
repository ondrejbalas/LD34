/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private x: number;
    private y: number;
    private g: Phaser.Graphics;
    private size: number = 20;

    private minColor: number = 0x900000;
    private maxColor: number = 0xFF0000;
    private color: number = 0xFF0000;
    private colorIncrement: number = 0x010000;
    private isColorIncreasing: number = 1;

    private sizeMod: number;
    private frameSize: number;

    constructor(private playArea: PlayArea) {
        this.x = playArea.width / 2;
        this.y = playArea.height - 44;
        this.g = playArea.g;
    }

    preload(): void { }

    create(): void {
        
    }

    update(): void {
        this.sizeMod = (0.05 * ((this.color - this.minColor) / (this.maxColor - this.minColor)));
        this.frameSize = this.size * (1 + this.sizeMod);

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
    }
}