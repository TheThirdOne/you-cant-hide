var keys = [];
var bindingsDown = [], bindingsUp = [];
var down = 83, left = 65, right = 68, up=87;
document.onkeydown = function(evt){
  if(!keys[evt.keyCode] ){
    keys[evt.keyCode] = true;
    console.log(evt.keyCode);
    if(bindingsDown[evt.keyCode])
      bindingsDown[evt.keyCode]();
  }
}
document.onkeyup = function(evt){
  keys[evt.keyCode] = false;
  if(bindingsUp[evt.keyCode])
      bindingsUp[evt.keyCode]();
};

bindingsDown[up] = function(){
  if(onGround() && !tryLadder()){
    console.log('jump');
    spy.setAnimation('jump');
    velocityY -= 10;
    constants.jumped = true;
    player.setY(spy.getY()-20);
    spy.afterFrame(1, function() {
      spy.setAnimation('jump_stay');
    });
  }else if (tryLadder()){
  	env.climb = true;
  }
};
bindingsDown[down] = function(){
  if(tryLadder()){
    env.fall = true;
  }
};
bindingsUp[down] = function(){
  env.fall = false;
};
bindingsUp[up] = function(){
	env.climb = false;
}
bindingsDown[right] = function(){
  player.setDirection(1);
  if(onGround() || tryLadder()){
    spy.setAnimation('walk');
    constants.goingRight = true;
    constants.goingLeft = false;
  }
};
bindingsUp[right] = function(){
  if((onGround()|| tryLadder())&& constants.goingRight){
    spy.setAnimation('idle');
    velocityX = 0;
    constants.goingRight = false;
  }
}
bindingsDown[left] = function(){
  player.setDirection(-1);
  if(onGround() || tryLadder()){
    spy.setAnimation('walk');
    constants.goingLeft = true;
    constants.goingRight = false;
  }
};
bindingsUp[left] = function(){
  if((onGround() || tryLadder())&& constants.goingLeft){
    spy.setAnimation('idle');
    velocityX = 0;
    constants.goingLeft = false;
  }
}