var LevelFactory = (function () {
    function LevelFactory() {
    }
    LevelFactory.createLevel = function (playArea, game, level) {
        switch (level) {
            case 1:
                return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 20, 60, 14, 0.05, 0.05, 1.2, 2);
            default:
                return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 20, 60, 14, 0.05, 0.05, 1.2, 2);
        }
    };
    LevelFactory.create = function (playArea, game, background, speed, lines, lineWidth, goodDropRate, badDropRate, obstacleRate, maxObstaclesPerLine) {
        var lv = new Level(playArea, game);
        lv.background = background;
        lv.speed = speed;
        lv.data = [];
        lv.lineWidth = lineWidth;
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
            line[x] = 2;
        }
    };
    LevelFactory.createEmptyLine = function (width) {
        var newArray = new Uint8Array(width);
        newArray[0] = 1;
        newArray[width - 1] = 1;
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
        return 0;
    };
    return LevelFactory;
})();
