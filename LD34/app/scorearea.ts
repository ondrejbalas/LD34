class ScoreArea implements IGameObject {
    private g: Phaser.Graphics;
    private bgColor: number = 0x00309A;

    constructor(private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number) {
        }

    preload(): void {
        this.g = this.game.add.graphics(this.x, this.y);
    }

    create(): void {
        this.g.lineStyle(0);
        this.g.beginFill(this.bgColor, 1);
        this.g.drawRect(0, 0, this.width, this.height);
        this.g.endFill();
    }

    update(): void {

    }
}