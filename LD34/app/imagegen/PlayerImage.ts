class PlayerImage {
    public centerX: number;
    public centerY: number;
    public size: number; // radius in pixels
    public data: Phaser.BitmapData;

    constructor(public width: number, public height: number) {
        
    }

    public static create(game: Phaser.Game, width: number, height: number, size: number): PlayerImage {
        var scaledWidth = width;
        var scaledHeight = height;
        var img = new PlayerImage(width, height);
        img.data = game.add.bitmapData(width, height);
        img.fill(size);
        return img;
    }

    public fill(size: number) {
        // given an R of a ball, 80% of it is the ball core and 20% is the static around it.
        // scaling size allows us to get a nice pixelated effect if we want it
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        var grd = this.data.context.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, size);
        grd.addColorStop(0, "#F4FEFD");
        grd.addColorStop(0.1, "#D5F6FD");
        grd.addColorStop(0.3, "#2DCAFF");
        grd.addColorStop(0.5, "#1369C0");
        grd.addColorStop(1.0, "#05235F");
        this.data.circle(this.centerX, this.centerY, size * .8, <any>grd);
    }
}