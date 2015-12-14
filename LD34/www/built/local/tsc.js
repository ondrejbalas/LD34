var App = (function () {
    function App(width, height) {
        this.gameStarted = false;
        this.isGameOver = false;
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
    }
    App.prototype.preload = function () {
        App.ranPreload = true;
        _.each(App.objects, function (o) { return o.preload(); });
    };
    App.prototype.create = function () {
        var _this = this;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.setBackgroundColor(0x00309A);
        this.kb = this.game.input.keyboard;
        this.kb.addKey(Phaser.Keyboard.ENTER);
        var spacerSize = 160;
        var playAreaWidth = (this.game.width - spacerSize) / 2;
        this.scoreArea = new ScoreArea(this.game, playAreaWidth, 0, spacerSize, this.game.height);
        var leftKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.A), this.kb.addKey(Phaser.Keyboard.D));
        var callGameOver = function () {
            if (!_this.isGameOver) {
                _this.isGameOver = true;
                _this.scoreArea.running = false;
                _this.scoreArea.showGameOver();
                _this.leftArea.gameOver();
                _this.rightArea.gameOver();
            }
        };
        this.leftArea = new PlayArea(0, this.game, this.scoreArea, 0, 0, playAreaWidth, this.game.height, leftKeys, callGameOver);
        App.register(this.leftArea);
        var rightKeys = new PlayerInput(this.kb.addKey(Phaser.Keyboard.LEFT), this.kb.addKey(Phaser.Keyboard.RIGHT));
        this.rightArea = new PlayArea(1, this.game, this.scoreArea, playAreaWidth + spacerSize, 0, playAreaWidth, this.game.height, rightKeys, callGameOver);
        App.register(this.rightArea);
        leftKeys.otherInput = rightKeys;
        rightKeys.otherInput = leftKeys;
        App.ranCreate = true;
        _.each(App.objects, function (o) { return o.create(); });
        this.instructionsText = this.game.add.text(this.game.width / 2, this.game.height / 2, "Welcome to my submission to Ludum Dare 34!\r\n\r\nYou will be controlling two balls of electricity.\r\n\r\nControl the left one by using the A and D keys, and the right one with the Left and Right arrow keys.\r\n\r\nThey cannot move independently and must be moved TOGETHER.\r\n\r\nTry it now by pressing the A key and LEFT arrow together.\r\n\r\nPress ENTER to play.", null);
        this.instructionsText.anchor.setTo(0.5, 0.5);
        this.instructionsText.fontSize = 28;
        var grd = this.instructionsText.context.createLinearGradient(0, 0, 0, this.instructionsText.canvas.height);
        grd.addColorStop(0, '#FFFBA4');
        grd.addColorStop(1, '#288A00');
        this.instructionsText.fill = grd;
        this.instructionsText.align = 'center';
        this.instructionsText.stroke = '#000000';
        this.instructionsText.strokeThickness = 2;
        this.instructionsText.setShadow(7, 7, 'rgba(0,0,0,0.5)', 5);
    };
    App.prototype.update = function () {
        if (this.kb.isDown(Phaser.Keyboard.ENTER)) {
            if (!this.gameStarted) {
                this.instructionsText.visible = false;
                this.gameStarted = true;
                App.register(this.scoreArea);
                this.leftArea.start();
                this.rightArea.start();
            }
        }
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
    App.requireTwoInputs = true;
    return App;
})();
window.onload = function () {
    var app = new App(1400, 700);
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
    function Level(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.obstacles = [];
        this.gameOver = false;
        this.x = playArea.x;
        this.y = playArea.y;
    }
    Level.prototype.preload = function () { };
    Level.prototype.create = function (layer, levelEnded) {
        this.levelEnded = levelEnded;
        this.layer = layer;
        this.position = -1;
        this.lastSpawnedRow = -1;
        this.objectSize = this.playArea.width / this.lineWidth;
        this.obstacleImage = ObstacleImage.create(this.game, this.objectSize, 1);
        this.powerUpImage = ObstacleImage.create(this.game, this.objectSize, 2);
        this.createInitialRows();
    };
    Level.prototype.update = function () {
        var _this = this;
        if (!this.gameOver) {
            var delta = (this.game.time.elapsedMS / 1000);
            this.position += delta * (this.speed / this.objectSize);
            _.forEach(this.obstacles, function (obstacle) {
                obstacle.sprite.y += delta * _this.speed;
                obstacle.circle.y += delta * _this.speed;
            });
            var y = Math.ceil(this.position);
            if (y > this.lastSpawnedRow) {
                this.lastSpawnedRow++;
                if (this.lastSpawnedRow < this.data.length) {
                    var row = this.data[this.lastSpawnedRow];
                    this.createRow(-this.objectSize, row);
                }
                else {
                    this.levelEnded();
                }
            }
        }
    };
    Level.prototype.createInitialRows = function () {
        var y = 0;
        do {
            this.position++;
            this.lastSpawnedRow++;
            y = this.position * this.objectSize;
            this.createRow(y, this.data[this.lastSpawnedRow]);
        } while (y < this.playArea.height);
    };
    Level.prototype.createRow = function (position, row) {
        var rowCount = 0;
        for (var i = 0; i < row.length; i++) {
            if (row[i] === 1 || row[i] === 2) {
                rowCount++;
                this.obstacles.push(new Obstacle(this.layer.create(this.x + i * this.objectSize, position, row[i] === 1 ? this.obstacleImage : this.powerUpImage), new Phaser.Circle(this.x + (this.objectSize / 2) + i * this.objectSize, position + (this.objectSize / 2), this.objectSize), row[i]));
            }
        }
    };
    Level.prototype.destroy = function () {
        _.forEach(this.obstacles, function (obstacle) { return obstacle.sprite.destroy(); });
    };
    Level.prototype.isPlayerColliding = function (player) {
        var colliding = _.find(this.obstacles, function (obstacle) { return obstacle.isColliding(player); });
        if (colliding) {
            if (colliding.type === 2) {
                colliding.sprite.destroy();
                colliding.circle.diameter = 0;
                colliding.circle.y = 2000;
            }
        }
        return colliding;
    };
    return Level;
})();
var LevelFactory = (function () {
    function LevelFactory() {
    }
    LevelFactory.createLevel = function (playArea, game, level) {
        switch (level) {
            case 1:
                return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 140, 50, 14, 0.05, 0.05, 0.25, 1);
            default:
                return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 140, 60 + (level * 10), 14, 0.05, 0.05, 0.25 + (level * 0.05), 2);
        }
    };
    LevelFactory.create = function (playArea, game, background, speed, lines, lineWidth, goodDropRate, badDropRate, obstacleRate, maxObstaclesPerLine) {
        var lv = new Level(playArea, game);
        lv.background = background;
        lv.speed = speed;
        lv.data = [];
        lv.lineWidth = lineWidth;
        var blankLines = Math.ceil(playArea.height * (lineWidth / playArea.width));
        for (var i = 0; i < blankLines; i++) {
            lv.data.push(this.createEmptyLine(lineWidth));
        }
        var goodDrops = 0;
        var badDrops = 0;
        var obstacles = 0;
        for (var j = 0; j < lines; j++) {
            var line = this.createEmptyLine(lineWidth, true);
            var goodDropsInRow = this.howManyInThisRow(j, goodDropRate, goodDrops, 1);
            var badDropsInRow = this.howManyInThisRow(j, badDropRate, badDrops, 1);
            var obstaclesInRow = this.howManyInThisRow(j, obstacleRate, obstacles, maxObstaclesPerLine);
            this.fillLine(line, 2, goodDropsInRow);
            this.fillLine(line, 3, badDropsInRow);
            this.fillLine(line, 1, obstaclesInRow);
            goodDrops += goodDropsInRow;
            badDrops += badDropsInRow;
            obstacles += obstaclesInRow;
            lv.data.push(line);
        }
        for (var k = 0; k < blankLines; k++) {
            lv.data.push(this.createEmptyLine(lineWidth));
        }
        return lv;
    };
    LevelFactory.fillLine = function (line, fillValue, valuesToFill) {
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
            line[x] = fillValue;
            valuesToFill--;
        }
    };
    LevelFactory.createEmptyLine = function (width, ballsOnEnds) {
        if (ballsOnEnds === void 0) { ballsOnEnds = false; }
        var newArray = new Uint8Array(width);
        if (ballsOnEnds) {
            newArray[0] = 1;
            newArray[width - 1] = 1;
        }
        return newArray;
    };
    LevelFactory.howManyInThisRow = function (lineNumber, rate, totalSoFar, maxPerLine) {
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
        return returnCounter;
    };
    return LevelFactory;
})();
var PlayArea = (function () {
    function PlayArea(id, game, scoreArea, x, y, width, height, input, flagGameOver) {
        this.id = id;
        this.game = game;
        this.scoreArea = scoreArea;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.input = input;
        this.flagGameOver = flagGameOver;
        this.gameIsOver = false;
        this.started = false;
        this.counter = 0;
        this.bgLayer = this.game.add.group();
        this.obstacleLayer = this.game.add.group();
        this.playerLayer = this.game.add.group();
    }
    PlayArea.prototype.start = function () {
        this.currentLevel.gameOver = false;
    };
    PlayArea.prototype.setLevel = function (levelNumber, running) {
        var _this = this;
        this.scoreArea.setLevel(levelNumber);
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        var level = LevelFactory.createLevel(this, this.game, levelNumber);
        level.gameOver = !running;
        level.preload();
        level.create(this.obstacleLayer, function () {
            level.destroy();
            _this.setLevel(levelNumber + 1, true);
        });
        this.currentLevel = level;
        this.playerY = 0;
        this.bg = level.background;
        var bgImages = this.bg.makeImages(this.game, this.width / 4, this.height / 4);
        if (!this.bgSprite1) {
            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        }
        else {
            this.bgSprite1.destroy();
            this.bgSprite2.destroy();
            this.bgSprite1 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[0]);
            this.bgSprite2 = this.game.add.tileSprite(this.x, 0, this.width, this.height, bgImages[1]);
            this.bgLayer.add(this.bgSprite1);
            this.bgLayer.add(this.bgSprite2);
        }
        this.bgSprite1.autoScroll(0, 16);
        this.bgSprite2.autoScroll(0, 32 * 1.4);
        this.bgSprite1.tileScale.x = 4;
        this.bgSprite1.tileScale.y = 4;
        this.bgSprite2.tileScale.x = 4;
        this.bgSprite2.tileScale.y = 4;
    };
    PlayArea.prototype.preload = function () {
    };
    PlayArea.prototype.create = function () {
        this.setLevel(1, false);
        this.player = new Player(this, this.game, this.playerLayer);
        App.register(this.player);
    };
    PlayArea.prototype.update = function () {
        this.currentLevel.update();
        var colliding = this.currentLevel.isPlayerColliding(this.player);
        if (colliding) {
            if (colliding.type === 1) {
                console.log(this.flagGameOver);
                this.flagGameOver();
            }
            if (colliding.type === 2) {
                this.player.size = 6;
            }
        }
    };
    PlayArea.prototype.gameOver = function () {
        this.gameIsOver = true;
        this.currentLevel.gameOver = true;
        this.currentLevel.destroy();
        this.scoreArea.showGameOver();
        this.player.gameOver();
    };
    return PlayArea;
})();
var Player = (function () {
    function Player(playArea, game, layer) {
        this.playArea = playArea;
        this.game = game;
        this.layer = layer;
        this.speed = 400;
        this.size = 8;
        this.isGameOver = false;
        this.startX = playArea.x + (playArea.width / 2);
        this.startY = playArea.height - 74;
        ;
    }
    Player.prototype.gameOver = function () {
        this.isGameOver = true;
        this.sprite.destroy();
    };
    Player.prototype.preload = function () {
    };
    Player.prototype.create = function () {
        this.image = PlayerImage.create(this.game, 64, 64, 32);
        this.sprite = this.layer.create(this.startX, this.startY, this.image.data);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.game.physics.arcade.enable(this.sprite);
        this.body = this.sprite.body;
        this.body.offset.x = 16;
        this.body.offset.y = 16;
        this.input = this.playArea.input;
        this.collisionCircle = new Phaser.Circle(this.startX, this.startY, 32);
    };
    Player.prototype.update = function () {
        if (!this.isGameOver) {
            this.body.velocity.x = 0;
            var delta = (this.game.time.elapsedMS / 1000);
            this.size = Math.min(32, this.size + (delta / 2));
            this.body.offset.x = this.size * 2;
            this.body.offset.y = this.size * 2;
            this.sprite.scale.x = this.size / 16;
            this.sprite.scale.y = this.size / 16;
            this.frameSize = this.size;
            this.body.x = Math.min(Math.max(this.body.x, this.playArea.x + (this.frameSize + 40)), this.playArea.x + this.playArea.width - (this.frameSize + 40));
            this.collisionCircle.x = this.body.x;
            this.collisionCircle.y = this.body.y;
            this.collisionCircle.diameter = (this.size * 3);
            if (this.input.isLeft()) {
                this.body.velocity.x = -this.speed;
            }
            else if (this.input.isRight()) {
                this.body.velocity.x = this.speed;
            }
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
        this.game.time.events.add(Phaser.Timer.SECOND, this.createText, this);
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
var Theme;
(function (Theme) {
    Theme[Theme["NorthernLights"] = 0] = "NorthernLights";
    Theme[Theme["Nebula"] = 1] = "Nebula";
    Theme[Theme["TealParty"] = 2] = "TealParty";
    Theme[Theme["Daisies"] = 3] = "Daisies";
    Theme[Theme["Random"] = 4] = "Random";
})(Theme || (Theme = {}));
;
var Obstacle = (function () {
    function Obstacle(sprite, circle, type) {
        this.sprite = sprite;
        this.circle = circle;
        this.type = type;
    }
    Obstacle.prototype.isColliding = function (player) {
        return Phaser.Circle.intersects(this.circle, player.collisionCircle);
    };
    return Obstacle;
})();
var ObstacleImage = (function () {
    function ObstacleImage() {
    }
    ObstacleImage.create = function (game, size, type) {
        var key = 'obstacle.' + size + '.' + type;
        var factory = function () {
            var data = game.add.bitmapData(size, size, key, true);
            var p1 = size * 5 / 8;
            var r1 = 0;
            var p2 = size / 2;
            var r2 = size / 2;
            var grd = data.context.createRadialGradient(p1, p1, r1, size * 2 / 4, size * 2 / 4, size / 2);
            switch (type) {
                case 2:
                    grd.addColorStop(0, "#2DCAFF");
                    grd.addColorStop(0.08, "#2DCAFF");
                    grd.addColorStop(0.22, "#2DCAFF");
                    grd.addColorStop(0.5, "#2DCAFF");
                    grd.addColorStop(1.0, "#2DCAFF");
                default:
                    grd.addColorStop(0, "#FEF4FC");
                    grd.addColorStop(0.08, "#FFD7F0");
                    grd.addColorStop(0.22, "#FF2DA6");
                    grd.addColorStop(0.5, "#E01626");
                    grd.addColorStop(1.0, "#750C06");
            }
            data.circle(size / 2, size / 2, size / 2, grd);
            ;
            return data;
        };
        return this.getOrAdd(game, key, factory);
    };
    ObstacleImage.getOrAdd = function (game, key, factory) {
        if (game.cache.checkBitmapDataKey(key)) {
            return game.cache.getBitmapData(key);
        }
        else {
            return factory();
        }
    };
    return ObstacleImage;
})();
var PlayerImage = (function () {
    function PlayerImage(width, height) {
        this.width = width;
        this.height = height;
    }
    PlayerImage.create = function (game, width, height, size) {
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
