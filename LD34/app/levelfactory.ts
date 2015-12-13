class LevelFactory {
    public static createLevel(level: number): Level {
        switch (level) {
        case 1:
            return Level.create(Background.fromTheme(Theme.NorthernLights), 20, 60, 14, 0.05, 0.05, 1.2, 2);
        default:

        }
        
    }
}