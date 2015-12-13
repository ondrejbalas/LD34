/// <reference path="../typings/underscore/underscore.d.ts" />

class Level implements IGameObject {
    public speed: number;
    public data: Uint8Array[]; // 0 = empty, 1 = obstacle, 2 = good drop, 3 = bad drop
    public background: Background;
    public lineWidth: number;
    private sprites: Phaser.Sprite[] = [];
    private x: number;
    private y: number;

    constructor(private playArea: PlayArea, private game: Phaser.Game) {
        this.x = playArea.x;
        this.y = playArea.y;
    }

    preload(): void {}

    create(): void {
        var image = ObstacleImage.create(this.game, this.playArea.width / this.lineWidth);
        var newSprite = this.game.add.sprite(this.x + 100, this.y + 100, image);
        newSprite.z = 100000;
    }

    update(): void {
        
    }
}