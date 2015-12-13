/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;

    private bg: Background;
    private bgSprite1: Phaser.TileSprite;
    private bgSprite2: Phaser.TileSprite;

    private bgLayer: Phaser.Group;
    private frontLayer: Phaser.Group;

    private currentLevel: Level;
    public setLevel(level: Level): void {
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        level.preload();
        level.create(this.frontLayer);
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
    }
    public playerY: number;

    constructor(private id: number, private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number, public input: PlayerInput) {
        this.bgLayer = this.game.add.group();
        this.frontLayer = this.game.add.group();
    }

    preload(): void {
    }

    create(): void {
        

        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);
        this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
        this.bgLayer.add(this.bgSprite1);
        this.bgLayer.add(this.bgSprite2);

        this.player = new Player(this, this.game, this.frontLayer);

        App.register(this.player);


    }

    private counter: number = 0;
    update(): void {
        this.currentLevel.update();

        var delta = (this.game.time.elapsedMS / 1000);
        var speed = 32;

        this.bgSprite1.tilePosition.y += delta * (speed / 2);
        this.bgSprite2.tilePosition.y += delta * (speed * 1.4);
    }
}