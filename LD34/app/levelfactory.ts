class LevelFactory {
    public static createLevel(playArea: PlayArea, game: Phaser.Game, level: number): Level {
        switch (level) {
        case 1:
            return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 140, 50, 14, 0.05, 0.05, 0.25, 1);
        default:
            return LevelFactory.create(playArea, game, Background.fromTheme(Theme.Random), 140, 60 + (level * 10), 14, 0.05, 0.05, 0.25 + (level * 0.05), 2);
        }
    }

    public static create(playArea: PlayArea, game: Phaser.Game, background: Background, speed: number, lines: number, lineWidth: number, goodDropRate: number, badDropRate: number, obstacleRate: number, maxObstaclesPerLine: number): Level {
        var lv = new Level(playArea, game);
        lv.background = background;
        lv.speed = speed;
        lv.data = [];
        lv.lineWidth = lineWidth;

        // A certain number of lines is left blank so the player can 'get started' before things start spawning
        var blankLines = Math.ceil(playArea.height * (lineWidth / playArea.width));

        // push the blank lines onto the array
        for (var i = 0; i < blankLines; i++) {
            lv.data.push(this.createEmptyLine(lineWidth));
        }

        // Now for each real line..
        // Keep track of the total number of good / bad drops and obstacles
        var goodDrops = 0;
        var badDrops = 0;
        var obstacles = 0;

        for (var j = 0; j < lines; j++) {
            // And for each row,
            // Figure out how many obstacles we'll have

            // Get a new empty row
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
    }

    private static fillLine(line: Uint8Array, fillValue: number, valuesToFill: number) {
        var emptySquares = 0;
        for (var i = 0; i < line.length; i++) {
            if (line[i] === 0) emptySquares++;
        }
        while (valuesToFill > 0 && emptySquares >> 0) {
            var x = 0;
            do {
                x = Math.floor(Math.random() * (line.length + 1));
            } while (line[x] !== 0)
            line[x] = fillValue;
            valuesToFill--;
        }
    }

    private static createEmptyLine(width: number, ballsOnEnds = false): Uint8Array {
        var newArray = new Uint8Array(width);
        if(ballsOnEnds) {
            newArray[0] = 1;
            newArray[width - 1] = 1;
        }
        return newArray;
    }

    private static howManyInThisRow(lineNumber: number, rate: number, totalSoFar: number, maxPerLine: number): number {
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
    }
}