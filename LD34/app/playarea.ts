/// <reference path="../typings/phaser.d.ts" />

class PlayArea {
    public player: Player;

    constructor(private game: Phaser.Game, private x: number, private y: number, private width: number, private height: number) {
        
    }

    create() {
        this.player = new Player(this.game, this);

        var g = this.game.add.graphics(this.x, this.y);
        g.lineStyle(4, 0xFF0000, 1);
        g.drawRect(this.x, this.y, this.width, this.height);

        //var rect = new Phaser.Rectangle(this.x, this.y, this.width, 5);
    }
}