chrome.app.runtime.onLaunched.addListener(function() {
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 1000;
  var height = 400;
 chrome.app.window.create('index.html',{width: width, height: height, 
     left: (screenWidth-width)/2, 
     top: (screenHeight-height)/2});
});
