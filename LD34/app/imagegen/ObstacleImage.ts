class ObstacleImage {
    public static create(game: Phaser.Game, size: number): Phaser.BitmapData {
        var key = 'obstacle.' + size;
        var factory = () => {
            console.log("creating new obstacle with key '" + key + "'");
            var data = game.add.bitmapData(size, size, key, true);
            var grd = data.context.createRadialGradient(size * 3 / 4, size * 3 / 4, 0, size * 3 / 4, size * 3 / 4, size / 3);
            grd.addColorStop(0, "#F4FEFD");
            grd.addColorStop(0.1, "#D5F6FD");
            grd.addColorStop(0.3, "#2DCAFF");
            grd.addColorStop(0.5, "#1369C0");
            grd.addColorStop(1.0, "#05235F");
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