/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;
    public g: Phaser.Graphics;

    constructor(private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number) {
        
    }

    preload(): void { }

    create():void {
        this.g = this.game.add.graphics(this.x, this.y);
        this.g.lineStyle(6, 0x666666, 1);
        this.g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);

        this.player = new Player(this);
        App.register(this.player);       
    }
    
    update(): void {}
}