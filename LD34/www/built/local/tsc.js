var App = (function () {
    function App(width, height) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        var kb = this.game.input.keyboard;
        var leftKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.A), kb.addKey(Phaser.Keyboard.D));
        var leftArea = new PlayArea(this.game, 0, 0, playAreaWidth, this.game.height, leftKeys);
        leftArea.setLevel(LevelFactory.createLevel(1));
        App.register(leftArea);
        var rightKeys = new PlayerInput(kb.addKey(Phaser.Keyboard.LEFT), kb.addKey(Phaser.Keyboard.RIGHT));
        var rightArea = new PlayArea(this.game, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys);
        rightArea.setLevel(LevelFactory.createLevel(1));
        App.register(rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        var scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        App.register(scoreArea);
        App.ranCreate = true;
        _.each(App.objects, function (o) { return o.create(); });
    };
    App.prototype.update = function () {
        _.each(App.objects, function (o) { return o.update(); });
    };
    App.register = function (obj) {
        this.objects.push(obj);
        if (App.ranPreload) {
            obj.preload();
        }
        if (App.ranCreate) {
            obj.create();
        }
    };
    App.objects = [];
    App.ranPreload = false;
    App.ranCreate = false;
    App.requireTwoInputs = false;
    return App;
})();
window.onload = function () {
    var app = new App(1400, 800);
};
var Background = (function () {
    function Background(color1, color2, color3, color4) {
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.color4 = color4;
    }
    Background.fromTheme = function (theme) {
        var _this = this;
        var randomColor = function (v) {
            var color = _this.fromHsv(Math.random(), Math.random(), v);
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
    };
    Background.fromHsv = function (h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };
    Background.prototype.makeImages = function (game, width, height) {
        var datas = [];
        var key1 = 'perlin:1:' + this.color1;
        var pz1 = Math.random();
        var px1 = Math.random() * width;
        var py1 = Math.random() * height;
        if (game.cache.checkBitmapDataKey(key1)) {
            datas.push(game.cache.getBitmapData(key1));
        }
        else {
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
                    }
                    else if (perlinValue1 > 0.4 && perlinValue2 < 0.6) {
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
        }
        else {
            var data3 = game.add.bitmapData(width, height, key3, true);
            var scale3 = 1 / 6;
            for (var x3 = 0; x3 < width; x3++) {
                for (var y3 = 0; y3 < height; y3++) {
                    var perlinValue = PerlinNoise.noise(px3 + scale3 * x3, py3 + scale3 * (Math.min(y3, height - y3)), pz3);
                    if (Math.floor(perlinValue * 100) % 3 === 0 && perlinValue > 0.5) {
                        var faded = this.shadeColor(this.color3, perlinValue * 2 - 1);
                        data3.setPixel32(x3, y3, faded[0], faded[1], faded[2], 64, false);
                    }
                }
            }
            data3.context.putImageData(data3.imageData, 0, 0);
            datas.push(data3);
        }
        return datas;
    };
    Background.prototype.shadeColor = function (color, percent) {
        var f = color, t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        var val = [(Math.round((t - R) * p) + R), (Math.round((t - G) * p) + G), (Math.round((t - B) * p) + B)];
        return val;
    };
    Background.prototype.blendColor = function (c0, c1, percent) {
        var f = c0, t = c1, R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
        return [(Math.round((R2 - R1) * percent) + R1), (Math.round((G2 - G1) * percent) + G1), (Math.round((B2 - B1) * percent) + B1)];
    };
    return Background;
})();
var Level = (function () {
    function Level() {
    }
    Level.create = function (background, speed, lines, lineWidth, goodDropRate, badDropRate, obstacleRate, maxObstaclesPerLine) {
        var lv = new Level();
        lv.background = background;
        lv.speed = speed;
        lv.data = [];
        var blankLines = lineWidth * 2;
        for (var i = 0; i < blankLines; i++) {
            lv.data.push(this.createEmptyLine(lineWidth));
        }
        var goodDrops = 0;
        var badDrops = 0;
        var obstacles = 0;
        for (var j = 0; j < lines; j++) {
            var line = this.createEmptyLine(lineWidth);
            var emptySquares = lineWidth - 2;
            var goodDropsInRow = this.howManyInThisRow(j, goodDropRate, goodDrops, 1);
            var badDropsInRow = this.howManyInThisRow(j, badDropRate, badDrops, 1);
            var obstaclesInRow = this.howManyInThisRow(j, obstacleRate, obstacles, maxObstaclesPerLine);
            this.fillLine(line, 2, goodDropsInRow);
            this.fillLine(line, 3, badDropsInRow);
            this.fillLine(line, 1, obstaclesInRow);
            lv.data.push(line);
        }
        return lv;
    };
    Level.fillLine = function (line, fillValue, valuesToFill) {
        var emptySquares = 0;
        for (var i = 0; i < line.length; i++) {
            if (line[i] === 0)
                emptySquares++;
        }
        while (valuesToFill > 0 && emptySquares >> 0) {
            var x = 0;
            do {
                x = Math.floor(Math.random() * (line.length + 1));
            } while (line[x] !== 0);
            line[x] = 2;
        }
    };
    Level.createEmptyLine = function (width) {
        var newArray = new Uint8Array(width);
        newArray[0] = 1;
        newArray[width - 1] = 1;
        return newArray;
    };
    Level.howManyInThisRow = function (lineNumber, rate, totalSoFar, maxPerLine) {
        var expectedRate = rate * lineNumber;
        var shortBy = expectedRate - totalSoFar;
        if (shortBy < 0)
            return 0;
        var probability = shortBy / 10;
        var returnCounter = 0;
        while (returnCounter < maxPerLine && probability > Math.random()) {
            returnCounter++;
            probability -= 0.25;
        }
        return 0;
    };
    return Level;
})();
var LevelFactory = (function () {
    function LevelFactory() {
    }
    LevelFactory.createLevel = function (level) {
        switch (level) {
            case 1:
                return Level.create(Background.fromTheme(Theme.Random), 20, 60, 14, 0.05, 0.05, 1.2, 2);
            default:
        }
    };
    return LevelFactory;
})();
var PlayArea = (function () {
    function PlayArea(game, x, y, width, height, input) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = input;
        this.counter = 0;
    }
    PlayArea.prototype.setLevel = function (level) {
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
    };
    PlayArea.prototype.preload = function () {
    };
    PlayArea.prototype.create = function () {
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);
        this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
        this.player = new Player(this, this.game);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        var delta = (this.game.time.elapsedMS / 1000);
        var speed = 32;
        this.bgSprite1.tilePosition.y += delta * (speed / 2);
        this.bgSprite2.tilePosition.y += delta * (speed * 1.4);
    };
    return PlayArea;
})();
var Player = (function () {
    function Player(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.speed = 800;
        this.size = 32;
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;
        ;
    }
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        console.log("creating player at " + this.startX + ", " + this.startY);
        this.image = PlayerImage.create(this.game, 64, 64, this.size);
        this.sprite = new Phaser.Sprite(this.game, this.startX, this.startY, this.image.data);
        this.game.add.existing(this.sprite);
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;
        this.body.offset.x = 64;
        this.body.offset.y = 64;
        this.input = this.playArea.input;
    };
    Player.prototype.update = function () {
        this.body.velocity.x = 0;
        this.frameSize = this.size;
        this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));
        if (this.input.isLeft()) {
            this.body.velocity.x = -this.speed;
        }
        else if (this.input.isRight()) {
            this.body.velocity.x = this.speed;
        }
    };
    return Player;
})();
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
var ScoreArea = (function () {
    function ScoreArea(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bgColor = 0x00309A;
    }
    ScoreArea.prototype.preload = function () {
        this.g = this.game.add.graphics(this.x, this.y);
    };
    ScoreArea.prototype.create = function () {
        this.g.lineStyle(0);
        this.g.beginFill(this.bgColor, 1);
        this.g.drawRect(0, 0, this.width, this.height);
        this.g.endFill();
    };
    ScoreArea.prototype.update = function () {
    };
    return ScoreArea;
})();
var Theme;
(function (Theme) {
    Theme[Theme["NorthernLights"] = 0] = "NorthernLights";
    Theme[Theme["Nebula"] = 1] = "Nebula";
    Theme[Theme["TealParty"] = 2] = "TealParty";
    Theme[Theme["Daisies"] = 3] = "Daisies";
    Theme[Theme["Random"] = 4] = "Random";
})(Theme || (Theme = {}));
;
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
var PerlinNoise = (function () {
    function PerlinNoise() {
    }
    PerlinNoise.noise = function (x, y, z) {
        var p = new Array(512);
        var permutation = [151, 160, 137, 91, 90, 15,
            131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
            190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
            88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
            77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
            102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
            135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
            5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
            223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
            251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
            49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
            138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ];
        for (var i = 0; i < 256; i++)
            p[256 + i] = p[i] = permutation[i];
        var X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        var u = this.fade(x), v = this.fade(y), w = this.fade(z);
        var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
        return this.scale(this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)), this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))), this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)), this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1)))));
    };
    PerlinNoise.fade = function (t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    };
    PerlinNoise.lerp = function (t, a, b) { return a + t * (b - a); };
    PerlinNoise.grad = function (hash, x, y, z) {
        var h = hash & 15;
        var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    };
    PerlinNoise.scale = function (n) { return (1 + n) / 2; };
    return PerlinNoise;
})();

//# sourceMappingURL=tsc.js.map
