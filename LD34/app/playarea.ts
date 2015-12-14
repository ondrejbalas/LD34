/// <reference path="../typings/phaser.d.ts" />

class PlayArea implements IGameObject {
    public player: Player;

    private bg: Background;
    private bgSprite1: Phaser.TileSprite;
    private bgSprite2: Phaser.TileSprite;

    private bgLayer: Phaser.Group;
    private obstacleLayer: Phaser.Group;
    private playerLayer: Phaser.Group;

    private gameIsOver: boolean = false;
    private started: boolean = false;

    public start(): void {
        this.currentLevel.gameOver = false;
    }

    private currentLevel: Level;
    public setLevel(levelNumber: number, running: boolean): void {
        this.scoreArea.setLevel(levelNumber);
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }

        var level = LevelFactory.createLevel(this, this.game, levelNumber);
        level.gameOver = !running;
        level.preload();
        level.create(this.obstacleLayer, () => {
            level.destroy();
            this.setLevel(levelNumber + 1, true);
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

    constructor(private id: number, private game: Phaser.Game, private scoreArea: ScoreArea, public x: number, public y: number, public width: number, public height: number, public input: PlayerInput, private flagGameOver: () => void) {
        this.bgLayer = this.game.add.group();
        this.obstacleLayer = this.game.add.group();
        this.playerLayer = this.game.add.group();
    }

    preload(): void {
    }

    create(): void {
        this.setLevel(1, false);
        
        this.player = new Player(this, this.game, this.playerLayer);

        App.register(this.player);
    }

    private counter: number = 0;
    update(): void {
        this.currentLevel.update();

        var colliding = this.currentLevel.isPlayerColliding(this.player);
        if (colliding) {
            if (colliding.type === 1) {
                console.log(this.flagGameOver);
                this.flagGameOver();
            }
            if (colliding.type === 2) {
                this.player.size = 6;
            }
        }
        //this.game.debug.text("Colliding: " + colliding.type, this.x + 100, 120);
    }

    public gameOver(): void {
        this.gameIsOver = true;
        this.currentLevel.gameOver = true;
        this.currentLevel.destroy();
        this.scoreArea.showGameOver();
        this.player.gameOver();
    }
}