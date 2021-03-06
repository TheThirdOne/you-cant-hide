var keys = [];
var bindingsDown = [], bindingsUp = [];
var down = 83, left = 65, right = 68, up=87, attack=32, pause=80;
var tempkeys = [];
function init_bindings(){
	document.onkeydown = function(evt){
	  if(!keys[evt.keyCode] ){
	    keys[evt.keyCode] = true;
	    console.log(evt.keyCode);
	    if(currentlevel.pauseText.getText() == 'You Win')
	    	startlevel(levels[currentlevel.i+1]())
	    if(currentlevel.pauseText.getText() == 'Game Over')
	    	startlevel(levels[currentlevel.i]())
	    if((!currentlevel.env.paused || evt.keyCode == pause) && bindingsDown[evt.keyCode])
	      bindingsDown[evt.keyCode]();
	  }
	}
	document.onkeyup = function(evt){
	  keys[evt.keyCode] = false;
	  if((!currentlevel.env.paused || evt.keyCode == pause )){
		  if(bindingsUp[evt.keyCode])
		      bindingsUp[evt.keyCode]();
		}else{
			tempkeys.push(evt.keyCode);
		}
	};
	bindingsDown[pause] = function(){
		currentlevel.env.paused = (currentlevel.env.paused&&currentlevel.pauseText.getText()=='Pause')?false:true;
		if(currentlevel.env.paused){
			for(var i = 0; i < currentlevel.thugs.length; i++){
				currentlevel.thugs[i].sprite.stop();
			} 
			currentlevel.spy.stop();
			currentlevel.clock.stop();
			currentlevel.alarm.stop();
			currentlevel.pauseText.setVisible(true);
		}else{
			for(var i = 0; i < currentlevel.thugs.length; i++){
				currentlevel.thugs[i].sprite.start();
			} 
			currentlevel.spy.start();
			currentlevel.clock.start();
			currentlevel.alarm.start();
			for(var i = 0; i < tempkeys.length; i++){
				if(bindingsUp[tempkeys[i]])
		    		bindingsUp[tempkeys[i]]();
			}
			tempkeys = [];
			currentlevel.pauseText.setVisible(false);
		}
		hud.draw();
	}
	bindingsDown[attack] = function(){
		stab();
		currentlevel.resetCloak();
		currentlevel.knife.setAnimation('stab');
		currentlevel.knife.afterFrame(2, function(){
			currentlevel.knife.setAnimation('idle');
		});
	}
	bindingsDown[up] = function(){
	  currentlevel.resetCloak();
	  if(onGround(currentlevel.spy) && !tryLadder(currentlevel.spy)){
	    console.log('jump');
	    currentlevel.spy.setAnimation('jump');
	    play_multi_sound('jump',0);
	    velocityY -= 10;
	    constants.jumped = true;
	    player.setY(currentlevel.spy.getY()-20);
	    currentlevel.spy.afterFrame(1, function() {
	      currentlevel.spy.setAnimation('jump_stay');
	    });
	  }else if (tryLadder(currentlevel.spy)){
	  	currentlevel.env.climb = true;
	  }
	};
	bindingsDown[down] = function(){
	  if(tryLadder(currentlevel.spy)){
	    currentlevel.env.fall = true;
	  }
	  currentlevel.resetCloak();
	};
	bindingsUp[down] = function(){
	  currentlevel.env.fall = false;
	};
	bindingsUp[up] = function(){
		currentlevel.env.climb = false;
	}
	bindingsDown[right] = function(){ 
	  if(onGround(currentlevel.spy) || tryLadder(currentlevel.spy)){
	  	player.setDirection(1);
	    currentlevel.spy.setAnimation('walk');
	    constants.goingRight = true;
	    constants.goingLeft = false;
	  }
	  currentlevel.resetCloak();
	};
	bindingsUp[right] = function(){
	  if((onGround(currentlevel.spy) || tryLadder(currentlevel.spy))&& constants.goingRight){
	    currentlevel.spy.setAnimation('idle');
	    velocityX = 0;
	    constants.goingRight = false;
	  }
	}
	bindingsDown[left] = function(){
	  if(onGround(currentlevel.spy) || tryLadder(currentlevel.spy)){
	  	 player.setDirection(-1);
	    currentlevel.spy.setAnimation('walk');
	    constants.goingLeft = true;
	    constants.goingRight = false;
	  }
	  currentlevel.resetCloak();
	};
	bindingsUp[left] = function(){
	  if((onGround(currentlevel.spy) || tryLadder(currentlevel.spy))&& constants.goingLeft){
	    currentlevel.spy.setAnimation('idle');
	    velocityX = 0;
	    constants.goingLeft = false;
	  }
	}
}
