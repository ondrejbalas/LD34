/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;
    public g: Phaser.Graphics;

    private bg: Background;
    private bgSprite1: Phaser.TileSprite;
    private bgSprite2: Phaser.TileSprite;
    private bgSprite3: Phaser.TileSprite;
    private bgSprite4: Phaser.TileSprite;

    private currentLevel: Level;
    public setLevel(level: Level): void {
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
    }
    public playerY: number;

    private playAreaColor: number = 0x000000;

    constructor(private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number, public input: PlayerInput) {
    }

    preload(): void {
    }

    create(): void {
        this.g = this.game.add.graphics(this.x, this.y);

        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 2);
        this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
        this.bgSprite3 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[2]);
        this.bgSprite3.tileScale.x = 4;
        this.bgSprite3.tileScale.y = 4;
        this.bgSprite4 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[3]);
        this.bgSprite4.tileScale.x = 4;
        this.bgSprite4.tileScale.y = 4;

        this.player = new Player(this, this.game);

        App.register(this.player);
    }
    
    update(): void {
        var speed = 0.5;
        this.bgSprite1.tilePosition.y += speed/2;
        this.bgSprite2.tilePosition.y += speed * 1.5;
        this.bgSprite3.tilePosition.y += speed * 3;
        this.bgSprite4.tilePosition.y += speed * 8;

        //this.g.clear();

        //this.g.lineStyle(6, this.playAreaColor, 1);
        //this.g.beginFill(this.playAreaColor, 1);
        //this.g.drawRect(0 + 3, 0 + 3, this.width - 6, this.height - 6);
        //this.g.endFill();
    }
}