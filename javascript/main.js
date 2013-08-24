var spy;
var block, blockb, blockc, back;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});
var background = new Kinetic.Layer();
var playerLayer = new Kinetic.Layer();
var enemies = new Kinetic.Layer();
var collision = new Kinetic.Layer();
var hud = new Kinetic.Layer();

var concretesheet = new Image();
concretesheet.onload = function(){
  back = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 1000,
        height: 400,
        fillPatternImage: concretesheet
      });
  start();
}
var blocksheet = new Image();
blocksheet.onload = function(){
  block = new Kinetic.Rect({
        x: 0,
        y: 364,
        width: 640,
        height: 96,
        fillPatternImage: blocksheet
      });
  blockb = new Kinetic.Rect({
        x: 0,
        y: 300,
        width: 64,
        height: 96,
        fillPatternImage: blocksheet
      });
  blockc = new Kinetic.Rect({
        x: 600,
        y: 300,
        width: 64,
        height: 96,
        fillPatternImage: blocksheet
      });
  start();
}

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
    width: 32,
    height:64
  });
  start();
};
spysheet.src = 'res/spy.png';
blocksheet.src = 'res/ground.png';
concretesheet.src = 'res/concrete.png'
var countdown = 3;
function start(){
  countdown--;
  if(countdown <= 0){
    background.add(back);
    stage.add(background);
    collision.add(block);
    collision.add(blockb);
    collision.add(blockc);
    stage.add(collision);
    playerLayer.add(spy);
    stage.add(playerLayer);
    startPlayer();
    spy.start();
    window.setInterval(loop,constants.playloop);
  }
}