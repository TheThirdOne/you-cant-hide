function onGround(sprite){
	return collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.2,sprite.getY()+64)||
	       collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.8,sprite.getY()+64);
}
function collideHead(sprite){
	return  collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.2,sprite.getY())||
	        collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()*.8,sprite.getY());
}
function collideLeft(sprite){
	if(sprite.getScaleX() > 0)
		return collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.8)||
	           collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.2);
	else
		return collide(sprite.getX() - sprite.getWidth(),sprite.getY()+sprite.getHeight()*.8)||
	           collide(sprite.getX() - sprite.getWidth(),sprite.getY()+sprite.getHeight()*.2);
}
function collideRight(sprite){
	if(sprite.getScaleX() > 0)
		return collide(sprite.getX() + sprite.getWidth(),sprite.getY()+sprite.getHeight()*.8)||
	           collide(sprite.getX() + sprite.getWidth(),sprite.getY()+sprite.getHeight()*.2);
	else
		return collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.8)||
	           collide(sprite.getX(),sprite.getY()+sprite.getHeight()*.2);
}
function tryLadder(sprite){
	return collide(sprite.getX() + sprite.getWidth()*sprite.getScaleX()/2,sprite.getY()+32, ladders.getChildren());
}
function collide(x,y,children){
	if(!children){
		var temp = collision.getChildren();
	}else
		var temp = children
	for(var i = 0; i < temp.length; i++){
		if(testCollision(temp[i],x,y))
			return true;
	}
	return false;
}
function testCollision(object, x, y){
	if(object.getY() > y || object.getY() + object.getHeight() < y)
		return false;	
	if(object.getScaleX() > 0){
		if(object.getX() > x || object.getX() + object.getWidth() < x)
				return false;
	}else{
		if(object.getX() < x || object.getX() - object.getWidth() > x)
				return false;
	}
	return true;
}
function stab(){
	var x = currentlevel.spy.getX() + currentlevel.spy.getWidth()*currentlevel.spy.getScaleX()*1.5;
	var y = currentlevel.spy.getY()+64*.2;
	var x2 = currentlevel.spy.getX() + currentlevel.spy.getWidth()*currentlevel.spy.getScaleX();
	var temp = enemies.getChildren();
	var killed;
	for(var i = 0; i < temp.length; i++){
		if(testCollision(temp[i],x,y) || testCollision(temp[i],x2,y)){
			killed = temp[i];
			break;
		}
	}
	if(!killed)
		return;
	for(var i = 0; i < currentlevel.thugs.length; i++){
		if(killed==currentlevel.thugs[i].sprite && currentlevel.thugs[i].decay > 65)
			currentlevel.thugs[i].die();
	}
}
function land(){
	var temp = (velocityY > 0)?1:-1;
	for(var i = 0; i < velocityY * temp; i++){
		player.setY(currentlevel.spy.getY()-temp);
		if(!onGround(currentlevel.spy)){
			break;
		}
	}
	player.setY(currentlevel.spy.getY()+temp);
	velocityX = 0;
	velocityY = 0;

	currentlevel.spy.setAnimation('idle');
	if(keys[left]||keys[right]){
		if(keys[left]){
			bindingsDown[left]();
			return;
		}
		if(keys[right]){
			bindingsDown[right]();
			return;
		}
	}
	constants.goingRight = false;
	constants.goingLeft = false;
}
var constants = {
	gravity: .9,
	walkSpeed: 5,
	playloop: 30
};
var velocityX = 0, velocityY = 0;
function loop(){
	if(!currentlevel.env.paused){
		currentlevel.thugs.forEach(runEnemy);
		hud.draw();
		if(tryLadder(currentlevel.spy)){
			if(!onGround(currentlevel.spy)){
				velocityY=0;
				if(constants.goingRight){
					velocityX = constants.walkSpeed;
				}else if(constants.goingLeft){
					velocityX = -constants.walkSpeed;
				}else{
					velocityX = 0;
				}
			}
			if(currentlevel.env.climb){
				velocityY = -5;
				currentlevel.resetCloak();
			}
			if(currentlevel.env.fall){
				velocityY = 5;
				currentlevel.resetCloak();
			}
		}else{
			currentlevel.env.fall = false;
			currentlevel.env.climb = false;
		}
		if(!currentlevel.env.fall && !currentlevel.env.climb)
			if(!onGround(currentlevel.spy)&&!tryLadder(currentlevel.spy)){
				velocityY += constants.gravity;
				if(currentlevel.spy.getAnimation() == 'walk' ){
					currentlevel.spy.setAnimation('jump_stay')
				}
				velocityY = (collideHead(currentlevel.spy))?1:velocityY;
				if(keys[up])
					bindingsDown[up]();
				constants.jumped=true;
			}else{
				if(constants.goingRight){
					velocityX = constants.walkSpeed;
					currentlevel.resetCloak();
				}else if(constants.goingLeft){
					velocityX = -constants.walkSpeed;
					currentlevel.resetCloak();
				}else{
					velocityX = 0;
					currentlevel.cloak();
				}
				if(constants.jumped){
					land();
					constants.jumped = false;
				}
				velocityY = 0;
			}
		if(velocityX < 0 && collideLeft(currentlevel.spy) || velocityX > 0 && collideRight(currentlevel.spy)){
			velocityX = (onGround(currentlevel.spy)||!keys[up])?0:-.9*velocityX;
			velocityY += (onGround(currentlevel.spy)||!keys[up])?0:-4;
			player.setDirection((onGround(currentlevel.spy)||!keys[up])?currentlevel.spy.getScaleX():-currentlevel.spy.getScaleX());
		}
		velocityX = (velocityX < 0 && collideLeft(currentlevel.spy) || velocityX > 0 && collideRight(currentlevel.spy))?0:velocityX;
		player.setY(currentlevel.spy.getY()+velocityY);
		player.setX(currentlevel.spy.getX()+velocityX);

		var temp = 1 - ((currentlevel.env.cloaked < 90)?currentlevel.env.cloaked/90:1)*.75
		currentlevel.spy.setOpacity(temp);
		currentlevel.knife.setOpacity(temp);
	}
}
function runEnemy(val, ind, arr){
	var thug = val;
	if(!onGround(thug.sprite)){
		thug.velocityY += constants.gravity;
		thug.velocityY = (collideHead(thug.sprite))?1:thug.velocityY;
		thug.air = true;
	}else{
		if(thug.air){
			var temp = (thug.velocityY > 0)?1:-1;
			for(var i = 0; i < thug.velocityY * temp; i++){
				thug.setY(thug.sprite.getY()-temp);
				if(!onGround(thug.sprite)){
					break;
				}
			}
			thug.setY(thug.sprite.getY()+temp);
			thug.air = false;
		}
		thug.velocityY = 0;
	}
	if(thug.decay==66){
		if(!thug.forwardClear(false))
			thug.setDirection(1);

		if(!thug.forwardClear(true))
			thug.setDirection(-1);
			
		if(currentlevel.env.cloaked < 90 ){
			if((thug.canSee(currentlevel.spy.getX()+16*currentlevel.spy.getScaleX(),currentlevel.spy.getY()+32) || thug.canSee(currentlevel.spy.getX()+16*currentlevel.spy.getScaleX(),currentlevel.spy.getY()))&& currentlevel.alarm.getAnimation() != 'alert'){
				currentlevel.alarm.setAnimation('alert');
				currentlevel.alarm.afterFrame(3,function (){
					play_multi_sound('alarm',0);
					currentlevel.env.alarms--;
					if(currentlevel.env.alarms < 0){
						currentlevel.pauseText.setText('Game Over');
						bindingsDown[pause]();
					}
					throw 'alert';
				});
			}
		}
	}else{
		thug.decay--;
		if(onGround(thug.sprite)){
			thug.velocityX = 0;
		}
		thug.sprite.setOpacity(thug.decay/66);
		if(thug.decay < 0){
			thug.sprite.destroy();
			
			arr.splice(ind,1)
		}
	}

	thug.velocityX = (thug.velocityX < 0 && collideLeft(thug.sprite) || thug.velocityX > 0 && collideRight(thug.sprite))?-5/3:thug.velocityX;
	thug.setY(thug.sprite.getY()+thug.velocityY);
	thug.setX(thug.sprite.getX()+thug.velocityX*thug.sprite.getScaleX());
}
function startPlayer(){
	player = {
		setX: function (x){
			if((x > stage.getWidth() * .7 && x > currentlevel.spy.getX())|| (x < stage.getWidth() * .3 && x < currentlevel.spy.getX())){
				var back = currentlevel.spy.getX()-x;
				collision.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
				ladders.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
				currentlevel.thugs.forEach(function (node,ind,arr){
					node.addX(back);
				});
				collision.draw();
				ladders.draw();
			}else{
				currentlevel.spy.setX(x);
				currentlevel.knife.setX(x);
			}
		},
		setY: function (y){
			currentlevel.spy.setY(y);
			currentlevel.knife.setY(y);
		},
		setDirection: function(direction){
			if(direction > 0){
				if(currentlevel.spy.getScaleX() < 0){
		      		currentlevel.spy.setScaleX(1);
		      		currentlevel.knife.setScaleX(1);
		      		currentlevel.spy.setX(currentlevel.spy.getX()-currentlevel.spy.getWidth()/2);
					currentlevel.knife.setX(currentlevel.spy.getX()-currentlevel.spy.getWidth()/2);
		    	}
		    }else{
		    	if(currentlevel.spy.getScaleX() > 0){
			      currentlevel.spy.setScaleX(-1);
			      currentlevel.knife.setScaleX(-1);
			      currentlevel.spy.setX(currentlevel.spy.getX()+currentlevel.spy.getWidth()/2);
				  currentlevel.knife.setX(currentlevel.spy.getX()+currentlevel.spy.getWidth()/2);
			    }
		    }
		}
	};
}
function BadGuy(x,y,image){
	this.sprite= new Kinetic.Sprite({
	    x: x,
	    y: y,
	    image: image,
	    animation: 'walk',
	    animations: personanimation,
	    frameRate: 8,
	    index: 0,
	    width: 32,
	    height:64
	  });
	this.velocityX = 5/3;
	this.velocityY = 0;
	this.air = false;
	this.decay = 66;
	this.sight = new Kinetic.Wedge({
		x: x,
        y: y,
        radius: 128,
        angleDeg:60,
        rotationDeg:-30,
        fill: 'red',
        opacity: .1
	});
	this.die = function(){
		this.decay--;
		this.sprite.setAnimation('death');
		this.sight.destroy();
		play_multi_sound('hurt',0);
		this.sprite.afterFrame(5,function(){
			this.setAnimation('death_stay')
		});
	}
	this.canSee = function(x,y){
		var temp = 1;
		if(this.sprite.getScaleX() < 0)
			temp = -1;
		if(0 > temp*(x-(this.sprite.getX() + 20*this.sprite.getScaleX())))
			return false;
		var dis =Math.abs(x-(this.sprite.getX() + 20*this.sprite.getScaleX()));
		var dY = (this.sprite.getY()+10) - y;
		var tan = Math.abs(dY/dis);
		if(tan > Math.tan(this.sight.getAngle()/2))
			return false;
		if(Math.sqrt(dY*dY+dis*dis)>this.sight.getRadius())
			return false;
		return true;
	}
	this.forwardClear = function(direction){
		if(direction){
			if(collideRight(this.sprite)){
				return false
			}
				
			this.addX(this.velocityX*this.sprite.getScaleX());
			var temp = onGround(this.sprite)
			this.addX(-this.velocityX*this.sprite.getScaleX());
			return temp;
		}else{
			if(collideLeft(this.sprite)){
				return false
			}
			this.addX(this.velocityX*this.sprite.getScaleX());
			var temp = onGround(this.sprite)
			this.addX(-this.velocityX*this.sprite.getScaleX());
			return temp;
		}
	};
	this.setDirection = function(direction){
		if(direction > 0){
			if(this.sprite.getScaleX() < 0){
	      		this.sprite.setScaleX(1);
	      		this.sight.setRotationDeg(-30);
	     		this.setX(this.sprite.getX() - this.sprite.getWidth()/2);
	    	}
	    }else{
	    	if(this.sprite.getScaleX() > 0){
		      this.sprite.setScaleX(-1);
		      this.sight.setRotationDeg(150);
		      this.setX(this.sprite.getX() + this.sprite.getWidth()/2);
		    }
	    }
	}
	this.addX = function(x){
		this.setX(this.sprite.getX()+x);
	}
	this.addY = function(y){
		this.setY(this.sprite.getY()+y);
	}
	this.setX= function(x){
		this.sight.setX(x+20*this.sprite.getScaleX());
		this.sprite.setX(x);
	}
	this.setY= function(y){
		this.sight.setY(y+10);
		this.sprite.setY(y);
	}
}
function generateCollisions(level){
	var out = [];
	for(var i = 0; i < level.blocks.length; i++){
		out[i]= new Kinetic.Rect({x: level.blocks[i][0],y: level.blocks[i][1],
			width: level.blocks[i][2],height:level.blocks[i][3],fillPatternImage: level.image});
	}
	return out;
}