var ScoreArea = (function () {
    function ScoreArea(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.level = 1;
        this.score = 0;
        this.running = true;
        this.bgLayer = this.game.add.group();
        this.textLayer = this.game.add.group();
    }
    ScoreArea.prototype.setLevel = function (level) {
        this.level = level;
        if (this.levelText)
            this.levelText.setText(level.toString());
    };
    ScoreArea.prototype.setScore = function (score) {
        this.score = score;
        if (this.scoreText)
            this.scoreText.setText(Math.floor(score).toString());
    };
    ScoreArea.prototype.showGameOver = function () {
        this.gameOverWordText.visible = true;
        this.running = false;
    };
    ScoreArea.prototype.preload = function () {
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    };
    ScoreArea.prototype.create = function () {
        this.game.time.events.add(Phaser.Timer.QUARTER, this.createText, this);
    };
    ScoreArea.prototype.createText = function () {
        this.levelWordText = this.createTextObject("LEVEL", 48, this.y + 100);
        this.levelText = this.createTextObject(this.level.toString(), 110, this.y + 190);
        this.scoreWordText = this.createTextObject("SCORE", 44, this.y + 590);
        this.scoreText = this.createTextObject(Math.floor(this.score).toString(), 32, this.y + 650);
        this.gameOverWordText = this.createTextObject("GAME OVER!", 160, this.height / 2);
        this.gameOverWordText.visible = false;
    };
    ScoreArea.prototype.createTextObject = function (text, size, yPos) {
        var newText = this.game.add.text(this.x + this.width / 2, yPos, text, null);
        newText.font = 'Revalia';
        newText.fontSize = size;
        newText.anchor.setTo(0.5);
        var grd = newText.context.createLinearGradient(0, 0, 0, newText.canvas.height);
        grd.addColorStop(0, '#FFFBA4');
        grd.addColorStop(1, '#288A00');
        newText.fill = grd;
        newText.align = 'center';
        newText.stroke = '#000000';
        newText.strokeThickness = 2;
        newText.setShadow(7, 7, 'rgba(0,0,0,0.5)', 5);
        return newText;
    };
    ScoreArea.prototype.update = function () {
        if (this.running) {
            var delta = (this.game.time.elapsedMS / 1000);
            this.score += delta * 28;
            this.setScore(this.score);
        }
    };
    return ScoreArea;
})();
