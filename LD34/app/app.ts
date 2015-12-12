/// <reference path="../typings/phaser.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

class App {
    private game: Phaser.Game;
    private static objects: Array<IGameObject> = [];

    constructor(public width: number, public height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        var leftArea = new PlayArea(this.game, 0, 0, 600, 600);
        App.register(leftArea);

        var rightArea = new PlayArea(this.game, 800, 0, 600, 600);
        App.register(rightArea);

        _.each(App.objects, o => o.preload());
    }

    create() {
        

        _.each(App.objects, o => o.create());
    }

    update() {


        _.each(App.objects, o => o.update());
    }

    public static register(obj: IGameObject) {
        this.objects.push(obj);
    }
}

window.onload = () => {
    var app = new App(1400, 600);
};