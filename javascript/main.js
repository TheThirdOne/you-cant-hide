var spy, knife, enemy,thugs = [];
var back, clock;
var blocks, crates;
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
var clocksheet = new Image();
clocksheet.onload = function(){
   clock = new Kinetic.Sprite({
    x: 904,
    y: 32,
    image: clocksheet,
    animation: 'run',
    animations: clockanimation,
    frameRate: .88,
    index: 0,
    width: 64,
    height:64
  });
  start();
}
var alarmsheet = new Image();
alarmsheet.onload = function(){
   alarm = new Kinetic.Sprite({
    x: 808,
    y: 32,
    image: alarmsheet,
    animation: 'idle',
    animations: alarmanimation,
    frameRate: 8,
    index: 0,
    width: 64,
    height:64
  });
  start();
}
var blocksheet = new Image();
blocksheet.onload = function(){
  blocks = generateCollisions({image: blocksheet, blocks: [[0,364,920,96],[920,0,400,400],[0,300,64,96],[-400,0,400,400],[50,170,400,64]]});
  start();
}
var laddersheet = new Image();
laddersheet.onload = function(){
    ladder = new Kinetic.Rect({
        x: 150,
        y: 135,
        width: 32,
        height: 230,
        fillPatternImage: laddersheet
      });
    start();
}
var cratesheet = new Image();
cratesheet.onload = function(){
   crates = generateCollisions({image: cratesheet, blocks: [[600,300,320,64],[710,236,196,64],[792,172,64,64]]})
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
var knifesheet = new Image();
knifesheet.onload = function() {
  knife = new Kinetic.Sprite({
    x: 400,
    y: 100,
    image: knifesheet,
    animation: 'idle',
    animations: knifeanimation,
    frameRate: 8,
    index: 0,
    width: 32,
    height:64
  });
  start();
};
var enemysheet = new Image();
enemysheet.onload = function() {
  thugs[0] = new BadGuy(400,300,enemysheet);
  thugs[1] = new BadGuy(300,300,enemysheet);
  thugs[2] = new BadGuy(200,300,enemysheet);
  start();
};
spysheet.src = 'res/spy.png';
enemysheet.src = 'res/thug.png';
blocksheet.src = 'res/ground.png';
concretesheet.src = 'res/concrete.png';
laddersheet.src = 'res/ladder.png';
knifesheet.src = 'res/knife.png';
cratesheet.src = 'res/crate.png';
clocksheet.src = 'res/clock.png';
alarmsheet.src = 'res/alarm.png';

var countdown = 9aaa;
function start(){
  countdown--;
  if(countdown <= 0){
    startlevel();
  }
}
function startlevel(level){
  background.add(back);
  stage.add(background);
  for(var i = 0; i < blocks.length; i++){
    collision.add(blocks[i]);
  }
  for(var i = 0; i < crates.length; i++){
    collision.add(crates[i]);
  }
  stage.add(collision);
  ladders.add(ladder);
  stage.add(ladders);
  playerLayer.add(spy);
  playerLayer.add(knife);
  stage.add(playerLayer);
  startPlayer();
  spy.start();
  knife.start();
  for(var i = 0; i < thugs.length;i++){
    enemies.add(thugs[i].sprite);
  }
  stage.add(enemies);
  for(var i = 0; i < thugs.length;i++){
    thugs[i].sprite.start();
  }
  for(var i = 0; i < thugs.length;i++){
    hud.add(thugs[i].sight);
  }
  hud.add(clock);
  clock.start();
  hud.add(alarm);
  alarm.start();
  stage.add(hud);
  window.setInterval(loop,constants.playloop);
  init_bindings();
}
var sounds = {};
init_sound('hurt',5, .5);
function init_sound(type, channels, volume){
  sounds[type]=[]
  for (a=0;a<channels;a++) {                  
    sounds[type][a] = {};
    sounds[type][a]['channel'] = new Audio();   
    sounds[type][a]['channel'].src = document.getElementById(type).src; 
    sounds[type][a]['channel'].load();      
    sounds[type][a]['finished'] = -1;
    if(volume)
      sounds[type][a]['channel'].volume = volume;         
  }
}

function play_multi_sound(s, start) {
  for (a=0;a<sounds[s].length;a++) {
    thistime = new Date();
    temp = sounds[s]
    if (sounds[s][a]['finished'] < thistime.getTime()) {      
      sounds[s][a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000 + start*1000;
      sounds[s][a]['channel'].currentTime = start;
      sounds[s][a]['channel'].play();
      break;
    }
  }
}