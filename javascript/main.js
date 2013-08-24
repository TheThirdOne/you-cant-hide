var spy, cloak;
var back;
var blocks;
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
  blocks = generateCollisions({image: blocksheet, blocks: [[0,364,640,96],[0,300,64,96],[-64,250,64,128],[64,170,400,32],[600,300,64,96]]});
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
var cloaksheet = new Image();
cloaksheet.onload = function(){
  cloak = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 32,
        height: 64,
        fillPatternImage: cloaksheet
      });
  start();
}
spysheet.src = 'res/spy.png';
blocksheet.src = 'res/ground.png';
concretesheet.src = 'res/concrete.png';
cloaksheet.src = 'res/cloak.png';
var countdown = 4;
function start(){
  countdown--;
  if(countdown <= 0){
    background.add(back);
    stage.add(background);
    for(var i = 0; i < blocks.length; i++){
      collision.add(blocks[i]);
    }
    stage.add(collision);
    playerLayer.add(spy);
    playerLayer.add(cloak);
    stage.add(playerLayer);
    startPlayer();
    spy.start();
    window.setInterval(loop,constants.playloop);
  }
}