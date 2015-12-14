/// <reference path="../typings/phaser.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

class App {
    private game: Phaser.Game;
    private static objects: Array<IGameObject> = [];
    private static ranPreload: boolean = false;
    private static ranCreate: boolean = false;
    public static requireTwoInputs: boolean = true;
    private scoreArea: ScoreArea;
    private leftArea: PlayArea;
    private rightArea: PlayArea;
    private kb: Phaser.Keyboard;
    private gameStarted: boolean = false;
    private instructionsText: Phaser.Text;

    constructor(width: number, height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    private isGameOver: boolean = false;

    preload() {
        App.ranPreload = true;

        _.each(App.objects, o => o.preload());
    }

    create() {
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.setBackgroundColor(0x00309A);
        
        this.kb = this.game.input.keyboard;
        this.kb.addKey(Phaser.Keyboard.ENTER);
        
        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;

        this.scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);

        var leftKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.A), this.kb.addKey(Phaser.Keyboard.D));

        var callGameOver = () => {
            if (!this.isGameOver) {
                this.isGameOver = true;

                this.scoreArea.running = false;
                this.scoreArea.showGameOver();
                this.leftArea.gameOver();
                this.rightArea.gameOver();
            }
        }

        this.leftArea = new PlayArea(0, this.game, this.scoreArea, 0, 0, playAreaWidth, this.game.height, leftKeys, callGameOver);
        App.register(this.leftArea);

        var rightKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.LEFT), this.kb.addKey(Phaser.Keyboard.RIGHT));
        this.rightArea = new PlayArea(1, this.game, this.scoreArea, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys, callGameOver);
        App.register(this.rightArea);

        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;

        App.ranCreate = true;
        _.each(App.objects, o => o.create());

        this.instructionsText = this.game.add.text(this.game.width / 2, this.game.height / 2, "Welcome to my submission to Ludum Dare 34!\r\n\r\nYou will be controlling two balls of electricity.\r\n\r\nControl the left one by using the A and D keys, and the right one with the Left and Right arrow keys.\r\n\r\nThey cannot move independently and must be moved TOGETHER.\r\n\r\nTry it now by pressing the A key and LEFT arrow together.\r\n\r\nPress ENTER to play.", null);
        this.instructionsText.anchor.setTo(0.5, 0.5);
        this.instructionsText.fontSize = 28;

        var grd = this.instructionsText.context.createLinearGradient(0, 0, 0, this.instructionsText.canvas.height);
        grd.addColorStop(0, '#FFFBA4');
        grd.addColorStop(0.1, '#FFFBA4');
        grd.addColorStop(1, '#3DD600');
        this.instructionsText.fill = grd;

        this.instructionsText.align = 'center';
        this.instructionsText.stroke = '#000000';
        this.instructionsText.strokeThickness = 3;
        this.instructionsText.setShadow(4, 4, 'rgba(0,0,0,0.5)', 5);
    }

    update() {
        if(this.kb.isDown(Phaser.Keyboard.ENTER)) {
            if (!this.gameStarted) {
                this.instructionsText.visible = false;
                this.gameStarted = true;
                App.register(this.scoreArea);
                this.leftArea.start();
                this.rightArea.start();
            }
        }
        _.each(App.objects, o => o.update());
    }

    public static register(obj: IGameObject): void {
        this.objects.push(obj);
        if (App.ranPreload) {
            obj.preload();
        }
        if (App.ranCreate) {
            obj.create();
        }
    }
}

window.onload = () => {
    var app = new App(1400, 700);
};