this.targetCollectionResource = new AR.TargetCollectionResource("assets/tracker.wtc", {
    onLoaded:function(){
        AR.logger.info("wtc loaded");
    },
    onError:function(){
        AR.logger.error("wtc error");
    }
});

this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
    onTargetsLoaded: function(){
        AR.logger.info("tracker loaded");
    },
    onError: function() {
        AR.logger.error("tracker error");
    }
});

var iconLocation = new AR.ImageResource("assets/location.png");
var locationButton1 = new AR.ImageDrawable(iconLocation, 0.0625, {
  opacity:0.8,
  translate:{
    x:-0.02,
    y:0.32,
    z:0.2
  },
  onClick:function(){
    if(description1.enabled){
      description1.enabled = false;
    }else{
      description1.enabled = true;
    }
  }
});
var locationButton2 = new AR.ImageDrawable(iconLocation, 0.0625, {
  opacity:0.8,
  translate:{
    x:-0.03,
    y:0.23,
    z:0.2
  },
  onClick:function(){
    if(description2.enabled){
      description2.enabled = false;
    }else{
      description2.enabled = true;
    }
  }
});
var locationButton3 = new AR.ImageDrawable(iconLocation, 0.0625, {
  opacity:0.8,
  translate:{
    x:-0.05,
    y:-0.3,
    z:0.2
  },
  onClick:function(){
    if(description3.enabled){
      description3.enabled = false;
    }else{
      description3.enabled = true;
    }
  }
});
var description1 = new AR.HtmlDrawable({uri:"http://11.111.41.189:3001/layout1.html"},0.5,{
  enabled:false,
  translate:{
    x:0.3,
    y:0.32,
    z:0.4
  },
  onClick:function(){
    AR.context.openInBrowser("http://11.111.41.189:3001/Eyes.html");
  }
});
var description2 = new AR.HtmlDrawable({uri:"http://11.111.41.189:3001/layout2.html"},0.5,{
  enabled:false,
  translate:{
    x:0.3,
    y:0.05,
    z:0.4
  },
  onClick:function(){
    AR.context.openInBrowser("http://11.111.41.189:3001/Smile.html");
  }
});
var description3 = new AR.HtmlDrawable({uri:"http://11.111.41.189:3001/layout3.html"},0.5,{
  enabled:false,
  viewportHeight: 420,
  translate:{
    x:0.3,
    y:-0.42,
    z:0.4
  },
  onClick:function(){
    AR.context.openInBrowser("http://11.111.41.189:3001/Hands.html");
  }
});
var isVideoPlaying = false;
var video = new AR.VideoDrawable("assets/Mona_Lisa.mp4",0.3,{
  translate:{
    x:-0.45,
    y:0.32,
    z:0.4
  },
  onClick:function(){
    AR.context.openInBrowser("https://www.youtube.com/watch?v=1gUpK9tx2RQ");
  }
});

var imageTarget;
var lastDistance;
var page = new AR.ImageTrackable(this.tracker, "*", {
    drawables: {
        cam: [locationButton1,locationButton2,locationButton3,description1,description2,description3,video]
    },
    onImageRecognized: function(target){
        if(imageTarget===undefined||imageTarget===null)
          imageTarget = target;
        AR.logger.info("Image Recognized");
        if(!isVideoPlaying){
          video.play(-1);
          isVideoPlaying=true;
        }else{
          video.resume();
        }
    },
    onImageLost: function(){
        AR.logger.info("Image Lost");
        video.pause();
    },
    distanceToTarget: {
        changedThreshold: 1,
        onDistanceChanged: function(distance) {
            if(lastDistance===undefined||lastDistance===null)
              lastDistance = distance;
            else{
              var diff = distance-lastDistance;
              AR.logger.info(diff);
              lastDistance = distance;
              video.translate.x-=diff*0.001;
              video.translate.y+=diff*0.0005;
            }
        }
    },
});
