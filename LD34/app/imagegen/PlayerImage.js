var PlayerImage = (function () {
    function PlayerImage(width, height) {
        this.width = width;
        this.height = height;
    }
    PlayerImage.create = function (game, width, height, size) {
        var scaledWidth = width;
        var scaledHeight = height;
        var img = new PlayerImage(width, height);
        img.data = game.add.bitmapData(width, height);
        img.fill(size);
        return img;
    };
    PlayerImage.prototype.fill = function (size) {
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        var grd = this.data.context.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, size);
        grd.addColorStop(0, "#F4FEFD");
        grd.addColorStop(0.1, "#D5F6FD");
        grd.addColorStop(0.3, "#2DCAFF");
        grd.addColorStop(0.5, "#1369C0");
        grd.addColorStop(1.0, "#05235F");
        this.data.circle(this.centerX, this.centerY, size * .8, grd);
    };
    return PlayerImage;
})();
