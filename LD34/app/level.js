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
        this.obstacleImage = ObstacleImage.create(this.game, this.objectSize);
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
            if (row[i] === 1) {
                rowCount++;
                this.obstacles.push(new Obstacle(this.layer.create(this.x + i * this.objectSize, position, this.obstacleImage), new Phaser.Circle(this.x + (this.objectSize / 2) + i * this.objectSize, position + (this.objectSize / 2), this.objectSize), row[i]));
            }
        }
    };
    Level.prototype.destroy = function () {
        _.forEach(this.obstacles, function (obstacle) { return obstacle.sprite.destroy(); });
    };
    Level.prototype.isPlayerColliding = function (player) {
        var colliding = _.find(this.obstacles, function (obstacle) { return obstacle.isColliding(player); });
        return colliding;
    };
    return Level;
})();
