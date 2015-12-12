/// <reference path="../typings/phaser.d.ts" />

class PlayerInput {
    constructor(private leftKey: Phaser.Key, private rightKey: Phaser.Key) {
        
    }

    public isLeft(): boolean {
        return (this.leftKey.isDown);
    }

    public isRight(): boolean {
        return (this.rightKey.isDown);
    }
}