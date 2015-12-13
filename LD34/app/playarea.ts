/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;

    private bg: Background;
    private bgSprite1: Phaser.TileSprite;
    private bgSprite2: Phaser.TileSprite;

    private bgLayer: Phaser.Group;
    private obstacleLayer: Phaser.Group;
    private playerLayer: Phaser.Group;

    private currentLevel: Level;
    public setLevel(levelNumber: number): void {
        console.log("setLevel: " + levelNumber);
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }

        var level = LevelFactory.createLevel(this, this.game, levelNumber);
        level.preload();
        level.create(this.obstacleLayer, () => {
            level.destroy();
            this.setLevel(levelNumber + 1);
        });
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);

        if (!this.bgSprite1) {
            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);

            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        } else {
            this.bgSprite1.destroy();
            this.bgSprite2.destroy();

            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);

            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        }
        
        this.bgSprite1.autoScroll(0, 16);
        this.bgSprite2.autoScroll(0, 32 * 1.4);

        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
    }
    public playerY: number;

    constructor(private id: number, private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number, public input: PlayerInput) {
        this.bgLayer = this.game.add.group();
        this.obstacleLayer = this.game.add.group();
        this.playerLayer = this.game.add.group();
    }

    preload(): void {
    }

    create(): void {
        this.setLevel(1);
        
        this.player = new Player(this, this.game, this.playerLayer);

        App.register(this.player);
    }

    private counter: number = 0;
    update(): void {
        this.currentLevel.update();
    }
}