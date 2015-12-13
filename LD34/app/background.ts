class Background {

    constructor(public color1: number, public color2: number, public color3: number, public color4: number) {
    }

    public static fromTheme(theme: Theme): Background {

        //var randomColor = () => Math.random() + (256 * Math.random()) + (65536 * Math.random());
        var randomColor = (v: number) => {
            var color = this.fromHsv(Math.random(), Math.random(), v);
            return color.r * 65536 + color.g * 256 + color.b;
        };

        switch (theme) {
            case Theme.NorthernLights:
                return new Background(0x29083F, 0x1BB4B1, 0x3EF2AB, 0x210736);
            case Theme.Nebula:
                return new Background(0x202A52, 0xE46F58, 0x85BEE1, 0x483548);
            case Theme.Random:
                return new Background(randomColor(0.22), randomColor(.4), randomColor(.7), randomColor(.22));
            default:
                return new Background(randomColor(44), randomColor(192), randomColor(128), randomColor(64));
        }
    }

    private static fromHsv(h: number, s: number, v: number): any {
        var r: number, g: number, b: number, i: number, f: number, p: number, q: number, t: number;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    public makeImages(game: Phaser.Game, width: number, height: number): Phaser.BitmapData[] {
        var datas: Phaser.BitmapData[] = [];

        var key1 = 'perlin:1:' + this.color1;
        var pz1 = Math.random();
        var px1 = Math.random() * width;
        var py1 = Math.random() * height;
        if (game.cache.checkBitmapDataKey(key1)) {
            datas.push(game.cache.getBitmapData(key1));
            //console.log("loaded texture '" + key1 + "' from cache");
        } else {
            //console.log("creating texture '" + key1 + "' with dimensions " + width + "x" + height);
            var data1 = game.add.bitmapData(width, height, key1, true);
            var scale1 = 1 / 4;
            var scale2 = 1 / 2;
            for (var x1 = 0; x1 < width; x1++) {
                for (var y1 = 0; y1 < height; y1++) {
                    var perlinValue1 = PerlinNoise.noise(px1 + scale1 * x1, py1 + scale1 * (Math.min(y1, height - y1)), pz1);
                    var perlinValue2 = PerlinNoise.noise(px1 + scale2 * x1, py1 + scale2 * (Math.min(y1, height - y1)), pz1);

                    if (perlinValue1 < 0.8 && perlinValue2 > 0.26) {
                        var faded1 = this.shadeColor(this.color1, -perlinValue1);
                        data1.setPixel32(x1, y1, faded1[0], faded1[1], faded1[2], 255, false);
                    } else if (perlinValue1 > 0.4 && perlinValue2 < 0.6) {
                        var faded2 = this.shadeColor(this.color2, perlinValue2 - 0.6);
                        data1.setPixel32(x1, y1, faded2[0], faded2[1], faded2[2], 255, false);
                    }
                    else {
                        var merged = this.blendColor(this.color1, this.color2, perlinValue1);
                        data1.setPixel32(x1, y1, merged[0], merged[1], merged[2], 255, false);
                    }

                }
            }
            data1.context.putImageData(data1.imageData, 0, 0);
            datas.push(data1);
        }

        var key3 = 'perlin:3:' + this.color3;
        var pz3 = Math.random();
        var px3 = Math.random() * width;
        var py3 = Math.random() * height;
        if (game.cache.checkBitmapDataKey(key3)) {
            datas.push(game.cache.getBitmapData(key3));
            //console.log("loaded texture '" + key3 + "' from cache");
        } else {
            //console.log("creating texture '" + key3 + "' with dimensions " + width + "x" + height);
            var data3 = game.add.bitmapData(width, height, key3, true);
            var scale3 = 1 / 6;
            for (var x3 = 0; x3 < width; x3++) {
                for (var y3 = 0; y3 < height; y3++) {
                    var perlinValue = PerlinNoise.noise(px3 + scale3 * x3, py3 + scale3 * (Math.min(y3, height - y3)), pz3);
                    if (Math.floor(perlinValue * 100) % 3 === 0 && perlinValue > 0.5) {
                        //if (perlinValue > 0.77) {
                        var faded = this.shadeColor(this.color3, perlinValue * 2 - 1);
                        data3.setPixel32(x3, y3, faded[0], faded[1], faded[2], 64, false);
                    }
                }
            }
            data3.context.putImageData(data3.imageData, 0, 0);
            datas.push(data3);
        }

        //var data4 = game.add.bitmapData(width, height, 'perlin:4:' + this.color4, true);
        //var scale4 = 2;
        //for (var x4 = 0; x4 < width; x4++) {
        //    for (var y4 = 0; y4 < height; y4++) {
        //        var perlinValue = PerlinNoise.noise(scale4 * x4, scale4 * (Math.min(y4, height - y4)), .5);
        //        var faded = this.shadeColor(this.color4, (perlinValue * 2.5) - 1);
        //        data4.setPixel32(x4, y4, faded[0], faded[1], faded[2], 33, false);
        //    }
        //}
        //data4.context.putImageData(data4.imageData, 0, 0);
        //datas.push(data4);

        return datas;
    }

    shadeColor(color: number, percent: number): number[] {
        var f = color, t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        var val = [(Math.round((t - R) * p) + R), (Math.round((t - G) * p) + G), (Math.round((t - B) * p) + B)];
        return val;
    }

    blendColor(c0: number, c1: number, percent: number): number[] {
        var f = c0, t = c1, R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
        return [(Math.round((R2 - R1) * percent) + R1), (Math.round((G2 - G1) * percent) + G1), (Math.round((B2 - B1) * percent) + B1)];
    }
}