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
	var x = spy.getX() + spy.getWidth()*spy.getScaleX()*1.5;
	var y = spy.getY()+64*.2;
	var x2 = spy.getX() + spy.getWidth()*spy.getScaleX();
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
	for(var i = 0; i < thugs.length; i++){
		if(killed==thugs[i].sprite && thugs[i].decay > 65)
			thugs[i].die();
	}
}
function land(){
	var temp = (velocityY > 0)?1:-1;
	for(var i = 0; i < velocityY * temp; i++){
		player.setY(spy.getY()-temp);
		if(!onGround(spy)){
			break;
		}
	}
	player.setY(spy.getY()+temp);
	velocityX = 0;
	velocityY = 0;

	spy.setAnimation('idle');
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
var env = {
	goingLeft: false,
	goingRight: false,
	jumped: false,
	climb: false,
	fall: false,
	cloaked: 0,
	paused: false
};
var velocityX = 0, velocityY = 0;
function loop(){
	if(!env.paused){
		thugs.forEach(runEnemy);
		hud.draw();
		if(tryLadder(spy)){
			if(!onGround(spy)){
				velocityY=0;
				if(constants.goingRight){
					velocityX = constants.walkSpeed;
					env.cloaked = 0;
				}else if(constants.goingLeft){
					velocityX = -constants.walkSpeed;
					env.cloaked = 0;
				}else{
					velocityX = 0;
					env.cloaked++
				}
			}
			if(env.climb){
				velocityY = -5;
				env.cloaked = 0;
			}
			if(env.fall){
				velocityY = 5;
				env.cloaked = 0;
			}
		}else{
			env.fall = false;
			env.climb = false;
		}
		if(!env.fall && !env.climb)
			if(!onGround(spy)){
				velocityY += constants.gravity;
				if(spy.getAnimation() == 'walk' ){
					spy.setAnimation('jump_stay')
				}
				velocityY = (collideHead(spy))?1:velocityY;
				if(keys[up])
					bindingsDown[up]();
				constants.jumped=true;
			}else{
				if(constants.goingRight){
					velocityX = constants.walkSpeed;
					env.cloaked = 0;
				}else if(constants.goingLeft){
					velocityX = -constants.walkSpeed;
					env.cloaked = 0;
				}else{
					velocityX = 0;
					env.cloaked++;
				}
				if(constants.jumped){
					land();
					constants.jumped = false;
				}
				velocityY = 0;
			}
		if(velocityX < 0 && collideLeft(spy) || velocityX > 0 && collideRight(spy)){
			velocityX = (onGround(spy)||!keys[up])?0:-.8*velocityX;
			velocityY += (onGround(spy)||!keys[up])?0:-4;
		}
		velocityX = (velocityX < 0 && collideLeft(spy) || velocityX > 0 && collideRight(spy))?0:velocityX;
		player.setY(spy.getY()+velocityY);
		player.setX(spy.getX()+velocityX);
		var temp = 1 - ((env.cloaked < 166)?env.cloaked/166:1)*.75
		spy.setOpacity(temp);
		knife.setOpacity(temp);
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
		if(collideLeft(thug.sprite) || collideRight(thug.sprite)){
			thug.velocityX *= -1;
			thug.setDirection(-1 * thug.sprite.getScaleX());
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
	thug.velocityX = (thug.velocityX < 0 && collideLeft(thug.sprite) || thug.velocityX > 0 && collideRight(thug.sprite))?0:thug.velocityX;
	thug.setY(thug.sprite.getY()+thug.velocityY);
	thug.setX(thug.sprite.getX()+thug.velocityX);
}
function startPlayer(){
	player = {
		setX: function (x){
			if(x > stage.getWidth() * .7 || x < stage.getWidth() * .3 ){
				var back = spy.getX()-x;
				collision.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
				ladders.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
				thugs.forEach(function (node,ind,arr){
					node.addX(back);
				});
				collision.draw();
				ladders.draw();
			}else{
				spy.setX(x);
				knife.setX(x);
			}
		},
		setY: function (y){
			spy.setY(y);
			knife.setY(y);
		},
		setDirection: function(direction){
			if(direction > 0){
				if(spy.getScaleX() < 0){
		      		spy.setScaleX(1);
		      		knife.setScaleX(1);
		     		player.setX(spy.getX()-spy.getWidth()/2);
		    	}
		    }else{
		    	if(spy.getScaleX() > 0){
			      spy.setScaleX(-1);
			      knife.setScaleX(-1);
			      player.setX(spy.getX()+spy.getWidth()/2);
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
		this.sprite.afterFrame(5,function(){
			this.setAnimation('death_stay')
		});
	}
	this.setDirection = function(direction){
		if(direction > 0){
			if(this.sprite.getScaleX() < 0){
	      		this.sprite.setScaleX(1);
	      		this.sight.setRotationDeg(-30);
	     		this.setX(this.sprite.getX() - this.sprite.getWidth()/2);
	    	}
	    }else{
	    	if(spy.getScaleX() > 0){
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
		out[i]= new Kinetic.Rect({x: level.blocks[i][0],y: level.blocks[i][1],width: level.blocks[i][2],height: level.blocks[i][3],fillPatternImage: level.image});
	}
	return out;
}