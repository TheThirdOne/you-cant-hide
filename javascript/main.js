var spy;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});

var playerLayer = new Kinetic.Layer();
var enemies = new Kinetic.Layer();
var collide = new Kinetic.Layer();
var hud = new Kinetic.Layer();

var gunsheet = new Image();
var spysheet = new Image();
spysheet.onload = function() {
  spy = new Kinetic.Sprite({
    x: 400,
    y: 100,
    image: spysheet,
    animation: 'walk',
    animations: personanimation,
    frameRate: 8,
    index: 0,
    width: 64
  });
  playerLayer.add(spy);
  stage.add(playerLayer);
  spy.start();
};
spysheet.src = 'res/spy.png';