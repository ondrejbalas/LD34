var PlayerInput = (function () {
    function PlayerInput(leftKey, rightKey) {
        this.leftKey = leftKey;
        this.rightKey = rightKey;
    }
    PlayerInput.prototype.isKeyPressed = function () {
        return (this.leftKey.isDown || this.rightKey.isDown);
    };
    PlayerInput.prototype.otherInputHasKeyPressed = function () {
        if (!this.otherInput) {
            return true;
        }
        return this.otherInput.isKeyPressed();
    };
    PlayerInput.prototype.isLeft = function () {
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.leftKey.isDown);
        }
        return this.leftKey.isDown;
    };
    PlayerInput.prototype.isRight = function () {
        if (App.requireTwoInputs) {
            return this.otherInputHasKeyPressed() && (this.rightKey.isDown);
        }
        return this.rightKey.isDown;
    };
    return PlayerInput;
})();
