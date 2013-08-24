var spy;
var block;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});

var playerLayer = new Kinetic.Layer();
var enemies = new Kinetic.Layer();
var collision = new Kinetic.Layer();
var hud = new Kinetic.Layer();

var blocksheet = new Image();
blocksheet.onload = function(){
   block = new Kinetic.Sprite({
    x: 0,
    y:364,
    image: blocksheet,
    animation: 'idle',
    animations: {idle: [{
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64
                  }]
                },
    frameRate: 12,
    width: 640,
    height: 96,
    scaleX: 10,
    scaleY: 1.5
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
    width: 64
  });
  start();
};
spysheet.src = 'res/spy.png';
blocksheet.src = 'res/ground.png';
var countdown = 2;
function start(){
  countdown--;
  if(countdown <= 0){
    collision.add(block);
    block.start();
    stage.add(collision);
    playerLayer.add(spy);
    stage.add(playerLayer);
    startPlayer();
    spy.start();
    window.setInterval(loop,constants.playloop);
  }
}