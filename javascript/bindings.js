var keys = [];
var bindingsDown = [], bindingsUp = [];
var down = 83, left = 65, right = 68, up=87, attack=32, pause=80;
var tempkeys = [];
function init_bindings(){
	document.onkeydown = function(evt){
	  if(!keys[evt.keyCode] ){
	    keys[evt.keyCode] = true;
	    console.log(evt.keyCode);
	    if((!env.paused || evt.keyCode == pause ) && bindingsDown[evt.keyCode])
	      bindingsDown[evt.keyCode]();
	  }
	}
	document.onkeyup = function(evt){
	  keys[evt.keyCode] = false;
	  if((!env.paused || evt.keyCode == pause )){
		  if(bindingsUp[evt.keyCode])
		      bindingsUp[evt.keyCode]();
		}else{
			tempkeys.push(evt.keyCode);
		}
	};
	bindingsDown[pause] = function(){
		env.paused = (env.paused&&pauseText.getText()=='Pause')?false:true;
		if(env.paused){
			for(var i = 0; i < thugs.length; i++){
				thugs[i].sprite.stop();
			} 
			spy.stop();
			clock.stop();
			alarm.stop();
			pauseText.setVisible(true);
		}else{
			for(var i = 0; i < thugs.length; i++){
				thugs[i].sprite.start();
			} 
			spy.start();
			clock.start();
			alarm.start();
			for(var i = 0; i < tempkeys.length; i++){
				if(bindingsUp[tempkeys[i]])
		    		bindingsUp[tempkeys[i]]();
			}
			tempkeys = [];
			pauseText.setVisible(false);
		}
		hud.draw();
	}
	bindingsDown[attack] = function(){
		stab();
		env.cloaked = 0;
		knife.setAnimation('stab');
		knife.afterFrame(2, function(){
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
	  if(onGround(spy) || tryLadder(spy)){
	  	player.setDirection(1);
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
	  if(onGround(spy) || tryLadder(spy)){
	  	 player.setDirection(-1);
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
}
