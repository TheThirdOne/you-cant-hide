var person = {
  anims:[{name: 'idle', slides:[7]},
         {name: 'walk', slides:[0,1,2,3]},
         {name: 'jump', slides:[4,5]},
         {name: 'jump_stay', slides:[5]},
         {name: 'death', slides:[8,8,9,9,10,10]},
         {name: 'death_stay', slides:[10]}],
         columns:4,rows:4,width:32,height:64};
var knife = {
  anims:[{name: 'idle', slides:[3]},
         {name: 'stab', slides:[0,1,2]}],
         columns:4,rows:1,width:32,height:64};
var clock = {
  anims:[{name: 'run', slides:[0,1,2,3,4,5,6,7,0]}],
         columns:4,rows:2,width:64,height:64};
var personanimation = AnimationSet(person);
var thuganimation = AnimationSet(person);
var knifeanimation = AnimationSet(knife);
var clockanimation = AnimationSet(clock);


function AnimationSet(data){
  var out = {};
  for(var i = 0; i < data.anims.length; i++){
    out[data.anims[i].name]=Animation(data.anims[i].slides,data);
  }
  return out;
}
function Animation(slides, data){
  var x,y;
  var out=[];
  for(var i = 0; i < slides.length; i++){
    x = slides[i]%data.columns;
    y = Math.floor(slides[i]/data.columns);
    out[i] = {'x': x*data.width, 'y' : y*data.height,
           'width': data.width, 'height': data.height}
  }
  return out;
}