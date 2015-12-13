/// <reference path="../typings/phaser.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

class App {
    private game: Phaser.Game;
    private static objects: Array<IGameObject> = [];
    private static ranPreload: boolean = false;
    private static ranCreate: boolean = false;
    public static requireTwoInputs: boolean = true;

    constructor(width: number, height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        App.ranPreload = true;

        _.each(App.objects, o => o.preload());
    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;

        var kb = this.game.input.keyboard;

        var leftKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.A), kb.addKey(Phaser.Keyboard.D));
        var leftArea = new PlayArea(this.game, 0, 0, playAreaWidth, this.game.height, leftKeys);
        leftArea.setLevel(LevelFactory.createLevel(leftArea, this.game, 1));
        App.register(leftArea);

        var rightKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.LEFT), kb.addKey(Phaser.Keyboard.RIGHT));
        var rightArea = new PlayArea(this.game, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys);
        rightArea.setLevel(LevelFactory.createLevel(leftArea, this.game, 1));
        App.register(rightArea);

        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;

        var scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        App.register(scoreArea);

        App.ranCreate = true;
        _.each(App.objects, o => o.create());


    }

    update() {

        _.each(App.objects, o => o.update());
    }

    public static register(obj: IGameObject) : void {
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
    var app = new App(1400, 800);
};