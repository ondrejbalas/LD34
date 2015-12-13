var Level = (function () {
    function Level(playArea, game) {
        this.playArea = playArea;
        this.game = game;
        this.sprites = [];
        this.x = playArea.x;
        this.y = playArea.y;
    }
    Level.prototype.preload = function () { };
    Level.prototype.create = function (layer) {
        console.debug("creating level");
        this.layer = layer;
        this.position = -1;
        this.lastSpawnedRow = -1;
        this.objectSize = this.playArea.width / this.lineWidth;
        this.obstacleImage = ObstacleImage.create(this.game, this.objectSize);
        this.createInitialRows();
    };
    Level.prototype.update = function () {
        var _this = this;
        var delta = (this.game.time.elapsedMS / 1000);
        this.position += delta * (this.speed / this.objectSize);
        _.forEach(this.sprites, function (sprite) { return sprite.y += delta * _this.speed; });
        var y = Math.ceil(this.position);
        if (y > this.lastSpawnedRow) {
            this.lastSpawnedRow++;
            var row = this.data[this.lastSpawnedRow];
            this.createRow(-this.objectSize, row);
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
            if (row[i] === 1) {
                rowCount++;
                this.sprites.push(this.layer.create(this.x + i * this.objectSize, position, this.obstacleImage));
            }
        }
    };
    Level.prototype.destroy = function () {
        _.forEach(this.sprites, function (sprite) { return sprite.destroy(); });
    };
    return Level;
})();
