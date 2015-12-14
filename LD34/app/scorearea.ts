class ScoreArea implements IGameObject {
    private level: number = 1;
    private levelWordText: Phaser.Text;
    private levelText: Phaser.Text;
    private scoreWordText: Phaser.Text;
    private scoreText: Phaser.Text;
    private gameOverWordText: Phaser.Text;
    private score: number = 0;
    running: boolean = true;

    public setLevel(level: number): void {
        this.level = level;
        if (this.levelText)
            this.levelText.setText(level.toString());
    }

    public setScore(score: number): void {
        this.score = score;
        if (this.scoreText)
            this.scoreText.setText(Math.floor(score).toString());
    }

    showGameOver() {
        this.gameOverWordText.visible = true;
        this.running = false;
    }

    private bgLayer: Phaser.Group;
    private textLayer: Phaser.Group;

    constructor(private game: Phaser.Game, public x: number, public y: number, public width: number, public height: number) {
        this.bgLayer = this.game.add.group();
        this.textLayer = this.game.add.group();
    }

    preload(): void {
        //  Load the Google WebFont Loader script
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }

    create(): void {
        this.game.time.events.add(Phaser.Timer.QUARTER, this.createText, this);
    }

    createText(): void {
        this.levelWordText = this.createTextObject("LEVEL", 48, this.y + 100);
        this.levelText = this.createTextObject(this.level.toString(), 110, this.y + 190);
        this.scoreWordText = this.createTextObject("SCORE", 44, this.y + 590);
        this.scoreText = this.createTextObject(Math.floor(this.score).toString(), 32, this.y + 650);
        this.gameOverWordText = this.createTextObject("GAME OVER!", 160, this.height / 2);
        this.gameOverWordText.visible = false;
    }

    private createTextObject(text: string, size: number, yPos: number): Phaser.Text {
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
    }

    update(): void {
        if (this.running) {
            var delta = (this.game.time.elapsedMS / 1000);
            this.score += delta * 28;
            this.setScore(this.score);
        }
    }
}