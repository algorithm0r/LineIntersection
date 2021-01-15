var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);

    var circle = new Circle(gameEngine, 400, 400, 100);
    gameEngine.addEntity(circle);
    circle = new Circle(gameEngine, 400, 400, 200);
    gameEngine.addEntity(circle);
    circle = new Circle(gameEngine, 400, 400, 300);
    gameEngine.addEntity(circle);    

    var line = new Line(gameEngine);
    gameEngine.addEntity(line);



    gameEngine.start();
});
