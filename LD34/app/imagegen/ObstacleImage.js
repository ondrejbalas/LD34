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
