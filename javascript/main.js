var spy, cloak, enemy,thugs = [];
var back;
var blocks;
var ladder;
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});
var background = new Kinetic.Layer();
var collision = new Kinetic.Layer();
var ladders = new Kinetic.Layer();
var playerLayer = new Kinetic.Layer();
var enemies = new Kinetic.Layer();
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
var laddersheet = new Image();
laddersheet.onload = function(){
    ladder = new Kinetic.Rect({
        x: 100,
        y: 135,
        width: 32,
        height: 230,
        fillPatternImage: laddersheet
      });
    ladder.ladder = true;
    start();
}
var spysheet = new Image();
spysheet.onload = function() {
  spy = new Kinetic.Sprite({
    x: 400,
    y: 100,
    image: spysheet,
    animation: 'idle',
    animations: personanimation,
    frameRate: 8,
    index: 0,
    width: 32,
    height:64
  });
  start();
};
var enemysheet = new Image();
enemysheet.onload = function() {
  thugs[0] = new BadGuy(400,100,enemysheet);
  thugs[1] = new BadGuy(300,100,enemysheet);
  thugs[2] = new BadGuy(200,100,enemysheet);
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
enemysheet.src = 'res/thug.png';
blocksheet.src = 'res/ground.png';
concretesheet.src = 'res/concrete.png';
cloaksheet.src = 'res/cloak.png';
laddersheet.src = 'res/ladder.png';
var countdown = 6;
function start(){
  countdown--;
  if(countdown <= 0){
    background.add(back);
    stage.add(background);
    for(var i = 0; i < blocks.length; i++){
      collision.add(blocks[i]);
    }
    stage.add(collision);
    ladders.add(ladder);
    stage.add(ladders);
    playerLayer.add(spy);
    playerLayer.add(cloak);
    stage.add(playerLayer);
    startPlayer();
    spy.start();
    for(var i = 0; i < thugs.length;i++){
      enemies.add(thugs[i].sprite);
    }
    stage.add(enemies);
    for(var i = 0; i < thugs.length;i++){
      thugs[i].sprite.start();
    }
    window.setInterval(loop,constants.playloop);
  }
}