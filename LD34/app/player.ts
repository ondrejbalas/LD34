/// <reference path="../typings/phaser.d.ts" />

class Player implements IGameObject {
    private x: number;
    private y: number;
    private g: Phaser.Graphics;
    private size: number = 100;

    constructor(private playArea: PlayArea) {
        this.x = playArea.width / 2;
        this.y = playArea.height - 44;
        this.g = playArea.g;
    }

    preload(): void { }

    create(): void {
        this.g.lineStyle(2, 0xFF0000, 1);
        this.g.beginFill(0xFF0000, 1);
        //this.g.drawRect(this.x - 3, this.y - 3, 6, 6);

        
        this.g.drawTriangle([new Phaser.Point(this.x - this.size, this.y), new Phaser.Point(this.x, this.y - (this.size * 1.5)), new Phaser.Point(this.x + this.size, this.y)], false);
        this.g.endFill();
    }

    update(): void {
        
    }
}