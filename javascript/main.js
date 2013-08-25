var knife, enemy,thugs = [];
var back;
var blocks, crates;
var ladder;
var levels = [];
levels.base = function(){
    this.clock = new Kinetic.Sprite({
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
    this.alarm = new Kinetic.Sprite({
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
    this.pauseText = new Kinetic.Text({
          x: 0,
          y: 60,
          text: 'Pause',
          fontSize: 200,
          fontFamily: 'Calibri',
          fill: '#FFF',
          width: 1000,
          padding: 20,
          align: 'center',
          visible: false
    });
    this.env = {
      goingLeft: false,
      goingRight: false,
      jumped: false,
      climb: false,
      fall: false,
      cloaked: 0,
      paused: false,
      alarms: 3
    };
    this.knife = new Kinetic.Sprite({
      x: 0,
      y: 0,
      image: knifesheet,
      animation: 'idle',
      animations: knifeanimation,
      frameRate: 8,
      index: 0,
      width: 32,
      height:64
    });
    this.resetCloak = function(){
      this.env.cloaked = 0;
      this.clock.setAnimation('idle');
    };
    this.cloak = function(){
      this.env.cloaked++;
      if(this.clock.getAnimation() != 'run')
        this.clock.setAnimation('run');
    };
  }
levels[0] = function (){
    out = new levels.base();
    out.thugs = [];
    out.thugs[0] = new BadGuy(400,300,enemysheet);
    out.thugs[1] = new BadGuy(300,136,enemysheet);
    out.thugs[2] = new BadGuy(200,300,enemysheet);
    out.blocks = generateCollisions({image: blocksheet,
     blocks: [[0,364,920,96],[920,0,400,400],[0,300,64,96],[-400,0,400,400],[64,100,400,32], [64, 200,400,32], [64, 132,32,68] ]});
    out.crates = generateCollisions({image: cratesheet, blocks: [[600,300,320,64],[710,236,196,64],[792,172,64,64]]});
    out.ladders = generateCollisions({image: laddersheet, blocks: [[150,60,32,305]]});
    out.spy= new Kinetic.Sprite({
      x: 400,
      y: 36,
      image: spysheet,
      animation: 'idle',
      animations: personanimation,
      frameRate: 8,
      index: 0,
      width: 32,
      height:64
    });
    return out;
}
var stage = new Kinetic.Stage({
  container: 'container',
  width: 1000,
  height: 400
});
var currentlevel;
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
  start();
}
var alarmsheet = new Image();
alarmsheet.onload = function(){
  start();
}
var blocksheet = new Image();
blocksheet.onload = function(){
  start();
}
var laddersheet = new Image();
laddersheet.onload = function(){
    start();
}
var cratesheet = new Image();
cratesheet.onload = function(){
    start();
}
var spysheet = new Image();
spysheet.onload = function() {
  start();
};
var knifesheet = new Image();
knifesheet.onload = function() {
  start();
};
var enemysheet = new Image();
enemysheet.onload = function() {
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

var countdown = 9;
function start(){
  countdown--;
  if(countdown <= 0){
    background.add(back);
    stage.add(background);
    currentlevel = [];
    startPlayer();
    startlevel(levels[0]());
  }
}
function startlevel(level){
  reset();
  currentlevel = level;
  for(var i = 0; i < level.blocks.length; i++){
    collision.add(level.blocks[i]);
  }
  for(var i = 0; i < level.crates.length; i++){
    collision.add(level.crates[i]);
  }
  stage.add(collision);
  for(var i = 0; i < level.ladders.length; i++){
    ladders.add(level.ladders[i]);
  }
  stage.add(ladders);
  playerLayer.add(level.spy);
  playerLayer.add(level.knife);
  stage.add(playerLayer);
  level.spy.start();
  level.knife.start();
  for(var i = 0; i < level.thugs.length;i++){
    enemies.add(level.thugs[i].sprite);
  }
  stage.add(enemies);
  for(var i = 0; i < level.thugs.length;i++){
    level.thugs[i].sprite.start();
  }
  for(var i = 0; i < level.thugs.length;i++){
    hud.add(level.thugs[i].sight);
  }
  hud.add(level.clock);
  level.clock.start();
  hud.add(level.alarm);
  level.alarm.start();
  hud.add(level.pauseText);
  stage.add(hud);
  currentlevel.interval = window.setInterval(loop,constants.playloop);
  init_bindings();
}
function reset(){
  window.clearInterval(currentlevel.interval);
  var temp = collision.getChildren();
  for(var i = temp.length-1; 0 <= i; i--){
    temp[i].destroy()
  }
  temp = ladders.getChildren();
  for(var i = temp.length-1; 0 <= i; i--){
    temp[i].destroy()
  }
  temp = enemies.getChildren();
  for(var i = temp.length-1; 0 <= i; i--){
    temp[i].destroy()
  }
  temp = playerLayer.getChildren();
  for(var i = temp.length-1; 0 <= i; i--){
    temp[i].destroy()
  }
  temp = hud.getChildren();
  for(var i = temp.length-1; 0 <= i; i--){
    temp[i].destroy()
  }
}
var sounds = {};
init_sound('hurt',5, .5);
init_sound('alarm',1, .5);
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