var keys = [];
var bindingsDown = [], bindingsUp = [];
var down = 83, left = 65, right = 68, up=87, attack=32;
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
bindingsDown[attack] = function(){
	stab();
	env.cloaked = 0;
	knife.setAnimation('stab');
	knife.afterFrame(1, function(){
		knife.setAnimation('idle');
	});
}
bindingsDown[up] = function(){
  env.cloaked = 0;
  if(onGround(spy) && !tryLadder(spy)){
    console.log('jump');
    spy.setAnimation('jump');
    velocityY -= 10;
    constants.jumped = true;
    player.setY(spy.getY()-20);
    spy.afterFrame(1, function() {
      spy.setAnimation('jump_stay');
    });
  }else if (tryLadder(spy)){
  	env.climb = true;
  }
};
bindingsDown[down] = function(){
  if(tryLadder(spy)){
    env.fall = true;
  }
  env.cloaked = 0;
};
bindingsUp[down] = function(){
  env.fall = false;
};
bindingsUp[up] = function(){
	env.climb = false;
}
bindingsDown[right] = function(){
  player.setDirection(1);
  if(onGround(spy) || tryLadder(spy)){
    spy.setAnimation('walk');
    constants.goingRight = true;
    constants.goingLeft = false;
  }
  env.cloaked = 0;
};
bindingsUp[right] = function(){
  if((onGround(spy) || tryLadder(spy))&& constants.goingRight){
    spy.setAnimation('idle');
    velocityX = 0;
    constants.goingRight = false;
  }
}
bindingsDown[left] = function(){
  player.setDirection(-1);
  if(onGround(spy) || tryLadder(spy)){
    spy.setAnimation('walk');
    constants.goingLeft = true;
    constants.goingRight = false;
  }
  env.cloaked = 0;
};
bindingsUp[left] = function(){
  if((onGround(spy) || tryLadder(spy))&& constants.goingLeft){
    spy.setAnimation('idle');
    velocityX = 0;
    constants.goingLeft = false;
  }
}