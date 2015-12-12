/// <reference path="../typings/phaser.d.ts" />

class App {
    game: Phaser.Game;
    mainArea: PlayArea;

    constructor(public width: number, public height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        
    }

    create() {
        this.mainArea = new PlayArea(this.game, 0, 0, 600, 600);
        this.mainArea.create();
    }

    update() {
        
    }
}

window.onload = () => {
    var app = new App(1200, 600);
};