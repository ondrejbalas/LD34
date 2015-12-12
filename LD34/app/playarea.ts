/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;

    constructor(private game: Phaser.Game, private x: number, private y: number, private width: number, private height: number) {
        
    }

    preload(): void { }

    create():void {
        this.player = new Player(this.game, this);

        var g = this.game.add.graphics(this.x, this.y);
        g.lineStyle(6, 0x666666, 1);
        console.log("Creating rectangle with X: " + this.x);
        g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);

        App.register(this.player);       
    }
    
    update(): void {}
}