var ObstacleImage = (function () {
    function ObstacleImage() {
    }
    ObstacleImage.create = function (game, size) {
        var key = 'obstacle.' + size;
        var factory = function () {
            console.log("creating new obstacle with key '" + key + "'");
            var data = game.add.bitmapData(size, size, key, true);
            var grd = data.context.createRadialGradient(size * 3 / 4, size * 3 / 4, 0, size * 3 / 4, size * 3 / 4, size / 3);
            grd.addColorStop(0, "#F4FEFD");
            grd.addColorStop(0.1, "#D5F6FD");
            grd.addColorStop(0.3, "#2DCAFF");
            grd.addColorStop(0.5, "#1369C0");
            grd.addColorStop(1.0, "#05235F");
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
