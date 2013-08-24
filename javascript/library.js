function onGround(){
	return collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.2,spy.getY()+64)||collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.8,spy.getY()+64);
}
function collideHead(){
	return  collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.2,spy.getY())||collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.8,spy.getY());
}
function collideLeft(){
	if(spy.getScaleX() > 0)
		return collide(spy.getX(),spy.getY()+spy.getHeight()*.8)||collide(spy.getX(),spy.getY()+spy.getHeight()*.2);
	else
		return collide(spy.getX() - spy.getWidth(),spy.getY()+spy.getHeight()*.8)||collide(spy.getX() - spy.getWidth(),spy.getY()+spy.getHeight()*.2);
}
function collideRight(){
	if(spy.getScaleX() > 0)
		return collide(spy.getX() + spy.getWidth(),spy.getY()+spy.getHeight()*.8)||collide(spy.getX() + spy.getWidth(),spy.getY()+spy.getHeight()*.2);
	else
		return collide(spy.getX(),spy.getY()+spy.getHeight()*.8)||collide(spy.getX(),spy.getY()+spy.getHeight()*.2);
}
function tryLadder(){
	return collide(spy.getX() + spy.getWidth()*spy.getScaleX()/2,spy.getY()+32, ladders.getChildren());
}
function collide(x,y,children){
	if(!children)
		var temp = collision.getChildren();
	else
		var temp = children
	for(var i = 0; i < temp.length; i++){
		if(!temp[i].length && testCollision(temp[i],x,y))
			return true;
	}
	return false;
}
function testCollision(object, x, y){
	if(object.getX() > x || object.getX() + object.getWidth() < x)
			return false;
	if(object.getY() > y || object.getY() + object.getHeight() < y)
			return false;	
	return true;
}
function land(){
	var temp = (velocityY > 0)?1:-1;
	for(var i = 0; i < velocityY * temp; i++){
		player.setY(spy.getY()-temp);
		if(!onGround()){
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
	cloaked: 0
};
var velocityX = 0, velocityY = 0;
function loop(){
	if(!onGround()){
		velocityY += constants.gravity;
		if(spy.getAnimation() == 'walk' ){
			spy.setAnimation('jump_stay')
		}
		velocityY = (collideHead())?1:velocityY;
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
	if(env.climb && tryLadder()){
		velocityY = -5;
		if(constants.goingRight){
			velocityX = constants.walkSpeed/3;
		}else if(constants.goingLeft){
			velocityX = -constants.walkSpeed/3;
		}else{
			velocityX = 0;
		}
		env.cloaked = 0;
	}
	velocityX = (velocityX < 0 && collideLeft() || velocityX > 0 && collideRight())?0:velocityX;
	player.setY(spy.getY()+velocityY);
	player.setX(spy.getX()+velocityX);
	cloak.setOpacity(((env.cloaked < 166)?env.cloaked/166:1)*.75);
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

				collision.draw();
				ladders.draw();
			}else{
				spy.setX(x);
				cloak.setX(x);
			}
		},
		setY: function (y){
			spy.setY(y);
			cloak.setY(y);
		},
		setDirection: function(direction){
			if(direction > 0){
				if(spy.getScaleX() < 0){
		      		spy.setScaleX(1);
		      		cloak.setScaleX(1);
		     		player.setX(spy.getX()-spy.getWidth()/2);
		    	}
		    }else{
		    	if(spy.getScaleX() > 0){
			      spy.setScaleX(-1);
			      cloak.setScaleX(-1);
			      player.setX(spy.getX()+spy.getWidth()/2);
			    }
		    }
		}
	};
}
function generateCollisions(level){
	var out = [];
	for(var i = 0; i < level.blocks.length; i++){
		out[i]= new Kinetic.Rect({x: level.blocks[i][0],y: level.blocks[i][1],width: level.blocks[i][2],height: level.blocks[i][3],fillPatternImage: level.image});
	}
	return out;
}