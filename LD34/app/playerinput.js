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
        return this.otherInputHasKeyPressed() && (this.leftKey.isDown);
    };
    PlayerInput.prototype.isRight = function () {
        return this.otherInputHasKeyPressed() && (this.rightKey.isDown);
    };
    return PlayerInput;
})();
