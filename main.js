var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    var line = new Line(gameEngine);
    gameEngine.addEntity(line);

    gameEngine.start();
});
