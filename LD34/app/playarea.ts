/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;
    public g: Phaser.Graphics;

    private playAreaColor: number = 0x000000;

    constructor(private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number, public input: PlayerInput) {
    }

    preload(): void {
        this.g = this.game.add.graphics(this.x, this.y);
    }

    create(): void {
        this.player = new Player(this);
        App.register(this.player);       
    }
    
    update(): void {
        this.g.clear();
        
        this.g.lineStyle(6, this.playAreaColor, 1);
        this.g.beginFill(this.playAreaColor, 1);
        this.g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);
        this.g.endFill();
    }
}