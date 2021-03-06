﻿/// <reference path="../typings/phaser.d.ts" />

class PlayerInput {
    public otherInput: PlayerInput;

    constructor(private leftKey: Phaser.Key, private rightKey: Phaser.Key) {

    }

    public isKeyPressed(): boolean {
        return (this.leftKey.isDown || this.rightKey.isDown);
    }

    private otherInputHasKeyPressed(): boolean {
        if (!this.otherInput) {
            return true;
        }
        return this.otherInput.isKeyPressed();
    }

    public isLeft(): boolean {
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.leftKey.isDown);
        }
        return this.leftKey.isDown;
    }

    public isRight(): boolean {
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.rightKey.isDown);
        }
        return this.rightKey.isDown;
    }
}