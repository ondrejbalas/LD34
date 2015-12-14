/// <reference path="../typings/underscore/underscore.d.ts" />

class Level {
    public position: number;
    public lastSpawnedRow: number;
    public speed: number;
    public data: Uint8Array[]; // 0 = empty, 1 = obstacle, 2 = good drop, 3 = bad drop
    public background: Background;
    public lineWidth: number;
    private obstacles: Obstacle[] = [];
    private x: number;
    private y: number;
    private layer: Phaser.Group;
    private objectSize: number;
    private obstacleImage: Phaser.BitmapData;
    private levelEnded: () => void;
    public gameOver: boolean = false;

    constructor(private playArea: PlayArea, private game: Phaser.Game) {
        this.x = playArea.x;
        this.y = playArea.y;
    }

    preload(): void { }

    create(layer: Phaser.Group, levelEnded: () => void): void {
        this.levelEnded = levelEnded;
        this.layer = layer;
        this.position = -1;
        this.lastSpawnedRow = -1;
        this.objectSize = this.playArea.width / this.lineWidth;
        this.obstacleImage = ObstacleImage.create(this.game, this.objectSize);
        this.createInitialRows();
    }

    update(): void {
        if (!this.gameOver) {
            var delta = (this.game.time.elapsedMS / 1000);
            this.position += delta * (this.speed / this.objectSize);
            _.forEach(this.obstacles, obstacle => {
                obstacle.sprite.y += delta * this.speed;
                obstacle.circle.y += delta * this.speed;
                //this.game.debug.geom(obstacle.circle, 'rgb(0,255,0)', false);
            });

            var y = Math.ceil(this.position);
            if (y > this.lastSpawnedRow) {
                this.lastSpawnedRow++;

                if (this.lastSpawnedRow < this.data.length) {
                    var row = this.data[this.lastSpawnedRow];
                    this.createRow(-this.objectSize, row);
                } else {
                    this.levelEnded();
                }
            }
        }
    }

    createInitialRows() {
        var y = 0;
        do {
            this.position++;
            this.lastSpawnedRow++;
            y = this.position * this.objectSize;
            this.createRow(y, this.data[this.lastSpawnedRow]);
        } while (y < this.playArea.height)
    }

    createRow(position: number, row: Uint8Array): void {
        var rowCount = 0;
        for (var i = 0; i < row.length; i++) {
            if (row[i] === 1) {
                rowCount++;
                this.obstacles.push(new Obstacle(this.layer.create(this.x + i * this.objectSize, position, this.obstacleImage)
                    , new Phaser.Circle(this.x + (this.objectSize / 2) + i * this.objectSize, position + (this.objectSize / 2), this.objectSize),
                    row[i]));
            }
        }
    }

    destroy(): void {
        _.forEach(this.obstacles, obstacle => obstacle.sprite.destroy());
    }

    isPlayerColliding(player: Player): Obstacle {
        var colliding = _.find(this.obstacles, obstacle => obstacle.isColliding(player));
        return colliding;
    }
}