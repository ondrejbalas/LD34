/// <reference path="../typings/phaser.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

class App {
    private game: Phaser.Game;
    private static objects: Array<IGameObject> = [];
    private static ranPreload: boolean = false;
    private static ranCreate: boolean = false;

    constructor(public width: number, public height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        App.ranPreload = true;

        var spacerSize = 400;
        var playAreaWidth = (this.game.width - spacerSize) / 2;

        var leftArea = new PlayArea(this.game, 0, 0, playAreaWidth, this.game.height);
        App.register(leftArea);

        var rightArea = new PlayArea(this.game, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height);
        App.register(rightArea);

        var scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        App.register(scoreArea);

        _.each(App.objects, o => o.preload());
    }

    create() {
        App.ranCreate = true;

        _.each(App.objects, o => o.create());
    }

    update() {


        _.each(App.objects, o => o.update());
    }

    public static register(obj: IGameObject) {
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
    var app = new App(1800, 800);
};