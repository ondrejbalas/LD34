var LevelFactory = (function () {
    function LevelFactory() {
    }
    LevelFactory.createLevel = function (playArea, game, level) {
        console.debug("making a level " + level);
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
        for (var i = 0; i < blankLines; i++) {
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
