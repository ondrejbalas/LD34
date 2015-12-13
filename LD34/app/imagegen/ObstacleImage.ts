class ObstacleImage {
    public static create(game: Phaser.Game, size: number): Phaser.BitmapData {
        var key = 'obstacle.' + size;
        var factory = () => {
            var data = game.add.bitmapData(size, size, key, true);
            var p1 = size * 5 / 8;
            var r1 = 0;
            var p2 = size / 2;
            var r2 = size / 2;
            var grd = data.context.createRadialGradient(p1, p1, r1, size * 2 / 4, size * 2 / 4, size / 2);
            grd.addColorStop(0, "#FEF4FC");
            grd.addColorStop(0.08, "#FFD7F0");
            grd.addColorStop(0.22, "#FF2DA6");
            grd.addColorStop(0.5, "#E01626");
            grd.addColorStop(1.0, "#750C06");
            data.circle(size / 2, size / 2, size / 2, <any>grd);;
            return data;
        }
        return this.getOrAdd(game, key, factory);
    }

    private static getOrAdd(game: Phaser.Game, key: string, factory: () => Phaser.BitmapData) : Phaser.BitmapData {
        if (game.cache.checkBitmapDataKey(key)) {
            return game.cache.getBitmapData(key);
        } else {
            return factory();
        }
    }
}