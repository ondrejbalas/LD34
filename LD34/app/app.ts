/// <reference path="../typings/phaser.d.ts" />

class Game {
    game: Phaser.Game;

    constructor(public width: number, public height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }

    preload() {
        
    }

    create() {
        
    }

    update() {
        
    }
}

window.onload = () => {
    var game = new Game(800, 600);
};