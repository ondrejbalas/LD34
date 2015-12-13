var Background = (function () {
    function Background(color1, color2, color3, color4) {
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.color4 = color4;
    }
    Background.fromTheme = function (theme) {
        var randomColor = function () { return Math.random() + (256 * Math.random()) + (65536 * Math.random()); };
        switch (theme) {
            case Theme.NorthernLights:
                return new Background(0x29083F, 0x1BB4B1, 0x3EF2AB, 0x210736);
            case Theme.Nebula:
                return new Background(0x202A52, 0x85BEE1, 0x85BEE1, 0x483548);
            case Theme.Random:
                return new Background(randomColor(), randomColor(), randomColor(), randomColor());
            default:
                return new Background(randomColor(), randomColor(), randomColor(), randomColor());
        }
    };
    Background.prototype.makeImages = function (game, width, height) {
        var datas = [];
        var data1 = game.add.bitmapData(width, height, 'perlin:1:' + this.color1, true);
        var scale1 = 1 / 4;
        for (var x1 = 0; x1 < width; x1++) {
            for (var y1 = 0; y1 < height; y1++) {
                var perlinValue = PerlinNoise.noise(scale1 * x1, scale1 * (Math.min(y1, height - y1)), .5);
                var faded = this.shadeColor(this.color1, (perlinValue * 1.6) - 1);
                data1.setPixel32(x1, y1, faded[0], faded[1], faded[2], 255, false);
            }
        }
        data1.setPixel32(width - 1, height - 1, 0, 0, 0, 255, true);
        datas.push(data1);
        var data2 = game.add.bitmapData(width, height, 'perlin:2:' + this.color2, true);
        var scale2 = 1 / 3;
        for (var x2 = 0; x2 < width; x2++) {
            for (var y2 = 0; y2 < height; y2++) {
                var perlinValue = PerlinNoise.noise(scale2 * x2, scale2 * (Math.min(y2, height - y2)), .5);
                var faded = this.shadeColor(this.color2, (perlinValue * 1.2) - 1);
                data2.setPixel32(x2, y2, faded[0], faded[1], faded[2], 70, false);
            }
        }
        data2.setPixel32(width - 1, height - 1, 0, 0, 0, 255, true);
        datas.push(data2);
        var data3 = game.add.bitmapData(width, height, 'perlin:3:' + this.color3, true);
        var scale3 = 1 / 8;
        for (var x3 = 0; x3 < width; x3++) {
            for (var y3 = 0; y3 < height; y3++) {
                var perlinValue = PerlinNoise.noise(scale3 * x3, scale3 * (Math.min(y3, height - y3)), .5);
                var faded = this.shadeColor(this.color3, (perlinValue * 1.4) - 1);
                data3.setPixel32(x3, y3, faded[0], faded[1], faded[2], 90, false);
            }
        }
        data3.setPixel32(width - 1, height - 1, 0, 0, 0, 255, true);
        datas.push(data3);
        var data4 = game.add.bitmapData(width, height, 'perlin:4:' + this.color4, true);
        var scale4 = 2;
        for (var x4 = 0; x4 < width; x4++) {
            for (var y4 = 0; y4 < height; y4++) {
                var perlinValue = PerlinNoise.noise(scale4 * x4, scale4 * (Math.min(y4, height - y4)), .5);
                var faded = this.shadeColor(this.color4, (perlinValue * 2.5) - 1);
                data4.setPixel32(x4, y4, faded[0], faded[1], faded[2], 50, false);
            }
        }
        data4.setPixel32(width - 1, height - 1, 0, 0, 0, 255, true);
        datas.push(data4);
        return datas;
    };
    Background.prototype.shadeColor = function (color, percent) {
        var f = color, t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        var val = [(Math.round((t - R) * p) + R), (Math.round((t - G) * p) + G), (Math.round((t - B) * p) + B)];
        return val;
    };
    Background.prototype.preload = function () { };
    Background.prototype.create = function () { };
    Background.prototype.update = function () { };
    return Background;
})();
