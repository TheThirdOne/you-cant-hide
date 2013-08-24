function onGround(){
	return collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.2,spy.getY()+64)||collide(spy.getX() + spy.getWidth()*spy.getScaleX()*.8,spy.getY()+64);
}
function collide(x,y){
	var temp = ground.getChildren();
	for(var i = 0; i < temp.length; i++){
		if(testCollision(temp[i],x,y))
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
var constants = {
	gravity: .9,
	walkSpeed: 5,
	playloop: 30
};
var env = {
	goingLeft: false,
	goingRight: false,
	jumped: false
};


function startPlayer(){
	player = {
		setX: function (x){
			if(x > stage.getWidth() * .7 || x < stage.getWidth() * .3 ){
				var back = spy.getX()-x;
				ground.getChildren().each(function (node,n){
					node.setX(node.getX()+back);
				});
			}else{
				spy.setX(x);
			}
		},
		setY: function (y){
			spy.setY(y);
			gun.setY(y+25 + ((constants.pointdown)?-8:0) + ((constants.pointup)?8:0));
		},
		setDirection: function(direction){
			if(direction > 0){
				if(spy.getScaleX() < 0){
		      		spy.setScaleX(1);
		     		player.setX(spy.getX()-spy.getWidth()/2);
		    	}
		    }else{
		    	if(spy.getScaleX() > 0){
			      spy.setScaleX(-1);
			      gun.setScaleX(-.75);
			      player.setX(spy.getX()+spy.getWidth()/2);
			    }
		    }
		}
	};
}