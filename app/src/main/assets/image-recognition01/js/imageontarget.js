var uri = 'http://11.111.41.189:3001/';
var arEffectArr = [
  {
    name:"HighLight",
    count:2,
    info:[{
      resource:"assets/img_Highlight_L.png",
      type:"image",
      translate:{x:-0.38,y:0.25,z:0.0},
      scale:{x:0.2,y:0.2,z:0.2}
    },{
      resource:"assets/img_Highlight_R.png",
      type:"image",
      translate:{x:0.3,y:0.38,z:0.0},
      scale:{x:0.2,y:0.2,z:0.2}
    }]
  },{
    name:"PictureFrame",
    count:2,
    info:[
      {
        resource:"assets/img_frame01.png",
        type:"image",
        translate:{x:0.0,y:0.0,z:0.0},
        scale:{x:1.2,y:1.25,z:1.0}
      },{
        resource:"assets/img_frame02.png",
        type:"image",
        translate:{x:0.0,y:0.0,z:0.0},
        scale:{x:1.36,y:1.4,z:1.0}
      }
    ]
  },{
    name:"Animation",
    count:1,
    info:[{
      resource:"assets/Mona_Lisa_Animation.mp4",
      type:"video",
      translate:{x:-0.01,y:0,z:0},
      scale:{x:1.02,y:1.01,z:0}
    }],
  }
];
var highLightDrawableArr={
  imageDrawableArr:[],
  htmlDrawableArr:[],
  videoDrawableArr:[]
},pictureFrameDrawableArr={
  imageDrawableArr:[],
  htmlDrawableArr:[],
  videoDrawableArr:[]
},animationDrawableArr={
  imageDrawableArr:[],
  htmlDrawableArr:[],
  videoDrawableArr:[]
};
var drawableArr=[];
var isVideoPlaying = false;

this.targetCollectionResource = new AR.TargetCollectionResource("assets/tracker.wtc", {
    onLoaded:function(){
    },
    onError:function(){
        AR.logger.error("wtc error");
    }
});

this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
    onTargetsLoaded: function(){
    },
    onError: function() {
        AR.logger.error("tracker error");
    }
});

var initDrawables = function(){
  for(var i=0;i<arEffectArr.length;i++){
    var arEffect=arEffectArr[i];
    if(arEffect.name=="HighLight"){
      initHighlightEffect(arEffect);
    }else if(arEffect.name=="PictureFrame"){
      initPictureFrameEffect(arEffect);
    }else if(arEffect.name=="Animation"){
      initAnimationDrawable(arEffect);
    }
  }
};

var initHighlightEffect = function(arEffect){
  for(var j=0;j<arEffect.count;j++){
    var item = arEffect.info[j];
    var drawable;
    if(item==undefined||item==null)
      continue;
    if(item.type==="image"){
      var imageResource = new AR.ImageResource(item.resource);
      if(item.resource==="assets/img_Highlight_L.png"){
        drawable = new AR.ImageDrawable(imageResource,1,{
          enabled:false,
          translate:item.translate,
          scale:item.scale,
          onClick:function(){
            var info = "<span>一些学者试着讨论为什么不同的人对这个微笑的感觉不同。"+
            "这些理论有科学性的，也有的从蒙娜丽莎的实际人物和感觉出发。有人说，蒙娜丽莎的微笑只有在斜眼看的时候才看得出来。"+
            "还有人认为这个微笑如此捉摸不定因为它利用了人的视觉中的干扰。提出蒙娜丽莎是米兰公爵夫人的理论的人说，"+
            "蒙娜丽莎的微笑是如此悲伤因为这位公爵夫人本人的生活很悲伤，因为她的丈夫如此有权势、是个酒鬼和经常打她。"+
            "这位公爵夫人自己曾说她是世界上“最不幸的妻子”。</span>";
            showContentInfo(info);
          }
        });
      }else if(item.resource==="assets/img_Highlight_R.png"){
        drawable = new AR.ImageDrawable(imageResource,1,{
          enabled:false,
          translate:item.translate,
          scale:item.scale,
          onClick:function(){
            var info = "<span>最近有学者指出蒙娜丽莎之所以看起来似笑非笑是因为达芬奇应用了眼睛的错觉。"+
            "眼睛的中心部位一般对较为亮的区域敏感，而边缘则对较暗的区域敏感。人一般确认笑容时主要是靠嘴唇和眼睛的形态特征判断。"+
            "而达芬奇就是利用了蒙娜丽莎嘴唇形成的阴影。当你盯着她的眼睛时你不会忽视她的嘴和眼睛，就会觉得她在微笑，"+
            "而你盯着她的嘴时你会忽视她的嘴和眼睛，就会觉得她没有在微笑。</span>";
            showContentInfo(info);
          }
        });
      }

      highLightDrawableArr.imageDrawableArr.push(drawable);
    }else if(item.type==="html"){
      drawable = new AR.HtmlDrawable({uri:item.resource},1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      highLightDrawableArr.htmlDrawableArr.push(drawable);
    }else if(item.type==="video"){
      drawable = new AR.VideoDrawable(item.resource,1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      highLightDrawableArr.videoDrawableArr.push(drawable);
    }
    drawableArr.push(drawable);
  }
};

var switchFrame = function(direction,drawable){
  var length = pictureFrameDrawableArr.imageDrawableArr.length;
  var currentIndex = pictureFrameDrawableArr.imageDrawableArr.indexOf(drawable);
  if(direction === "left"){
    if(currentIndex<length-1){
      currentIndex++;
    }else{
      currentIndex=0;
    }
  }else{
    if(currentIndex>0){
      currentIndex--;
    }else{
      currentIndex=length-1;
    }
  }
  previousPictureFrameDrawable = drawable;
  currentPictureFrameDrawable =pictureFrameDrawableArr.imageDrawableArr[currentIndex];
  translateFrameX(previousPictureFrameDrawable,currentPictureFrameDrawable,direction);
}

var easingCurve = new AR.EasingCurve('easeInOutQuad');

var translateFrameX = function(previousFrame,currentFrame,direction){
  var distance = 3;
  var original = 0.0;
  previousFrame.translate.x=original;
  var previousTranslate,currentTranslate;
  if(direction==="left"){
    currentFrame.translate.x=original+distance;
    previousTranslate = new AR.PropertyAnimation(previousFrame,"translate.x",previousFrame.translate.x,original-distance,1000,easingCurve,{
      onFinish:function(){
        previousFrame.enabled = false;
      }
    });
    currentTranslate = new AR.PropertyAnimation(currentFrame,"translate.x",currentFrame.translate.x,original,1000,easingCurve,{
      onStart:function(){
        currentFrame.enabled = true;
      }
    });
  }else{
    currentFrame.translate.x=original-distance;
    previousTranslate = new AR.PropertyAnimation(previousFrame,"translate.x",previousFrame.translate.x,original+distance,1000,easingCurve,{
      onFinish:function(){
        previousFrame.enabled = false;
      }
    });
    currentTranslate = new AR.PropertyAnimation(currentFrame,"translate.x",currentFrame.translate.x,original,1000,easingCurve,{
      onStart:function(){
        currentFrame.enabled = true;
      }
    });
  }
  previousTranslate.start();
  currentTranslate.start();
  //var animateGroup = new AR.AnimationGroup("parallel",[currentTranslate]);
  //animateGroup.start();
}

var previousX=0;
var gestureTime = 0.5;
var maxSpeed=0, speed = 0,gestureSpeed = 0.2;
var oneFingerGestureAllowed = false;
var initPictureFrameEffect= function(arEffect){
  for(var j=0;j<arEffect.count;j++){
    var item = arEffect.info[j];
    var drawable;
    if(item==undefined||item==null)
      continue;
    if(item.type==="image"){
      var imageResource = new AR.ImageResource(item.resource);
      drawable = new AR.ImageDrawable(imageResource,1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale,
        onDragBegan:function(x,y){
          oneFingerGestureAllowed = true;
          previousX=0;
        },
        onDragChanged:function(x,y){
          if(oneFingerGestureAllowed){
            var currentSpeed = Math.abs(x-previousX)/gestureTime;
            if(currentSpeed>maxSpeed){
              maxSpeed = currentSpeed;
            }
          }
        },
        onDragEnded:function(x,y){
          speed = maxSpeed;
          if(speed>gestureSpeed){
            if(x>previousX){
              switchFrame("right",currentPictureFrameDrawable);
            }else{
              switchFrame("left",currentPictureFrameDrawable);
            }
          }
          previousX = 0;
          speed = 0;
        },
      });
      pictureFrameDrawableArr.imageDrawableArr.push(drawable);
    }else if(item.type==="html"){
      drawable = new AR.HtmlDrawable({uri:item.resource},1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      pictureFrameDrawableArr.htmlDrawableArr.push(drawable);
    }else if(item.type==="video"){
      drawable = new AR.VideoDrawable(item.resource,1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      pictureFrameDrawableArr.videoDrawableArr.push(drawable);
    }
    drawableArr.push(drawable);
  }
};

var initAnimationDrawable= function(arEffect){
  for(var j=0;j<arEffect.count;j++){
    var item = arEffect.info[j];
    var drawable;
    if(item==undefined||item==null)
      continue;
    if(item.type==="image"){
      var imageResource = new AR.ImageResource(item.resource);
      drawable = new AR.ImageDrawable(imageResource,1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      animationDrawableArr.imageDrawableArr.push(drawable);
    }else if(item.type==="html"){
      drawable = new AR.HtmlDrawable({uri:item.resource},1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      animationDrawableArr.htmlDrawableArr.push(drawable);
    }else if(item.type==="video"){
      drawable = new AR.VideoDrawable(item.resource,1,{
        enabled:false,
        translate:item.translate,
        scale:item.scale
      });
      animationDrawableArr.videoDrawableArr.push(drawable);
    }
    drawableArr.push(drawable);
  }
};

initDrawables();

var disabledEntireDrawables=function(){
  drawableArr.forEach(function(element){
    element.enabled=false;
  });
}

var showHighLight = function(){
  disabledEntireDrawables();
  if(highLightDrawableArr.imageDrawableArr.length>0){
    highLightDrawableArr.imageDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
  if(highLightDrawableArr.htmlDrawableArr.length>0){
    highLightDrawableArr.htmlDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
  if(highLightDrawableArr.videoDrawableArr.length>0){
    highLightDrawableArr.videoDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
};

var previousPictureFrameDrawable,currentPictureFrameDrawable;
var showPictureFrame = function(){
  disabledEntireDrawables();
  if(pictureFrameDrawableArr.imageDrawableArr.length>0){
    var enabledIndex = 0;
    pictureFrameDrawableArr.imageDrawableArr.forEach(function(element,index){
      if(previousPictureFrameDrawable===undefined){
        if(index===0){
          element.translate.x=0;
          element.enabled=true;
          currentPictureFrameDrawable = element;
        }
      }
      else if(element.translate.x === 0){
        element.enabled=true;
      }
    });
  }
  if(pictureFrameDrawableArr.htmlDrawableArr.length>0){
    pictureFrameDrawableArr.htmlDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
  if(pictureFrameDrawableArr.videoDrawableArr.length>0){
    pictureFrameDrawableArr.videoDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
}

var showAnimation = function(){
  disabledEntireDrawables();
  if(animationDrawableArr.imageDrawableArr.length>0){
    animationDrawableArr.imageDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
  if(animationDrawableArr.htmlDrawableArr.length>0){
    animationDrawableArr.htmlDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
  if(animationDrawableArr.videoDrawableArr.length>0){
    animationDrawableArr.videoDrawableArr.forEach(function(element){
      element.enabled=true;
    });
  }
};

var showContentInfo=function(info){
  var popLayout = document.getElementsByClassName("popLayout")[0];
  popLayout.style.display="block";
  var infoDom = document.getElementsByClassName("info")[0];
  infoDom.innerHTML=info;
  var content = document.getElementsByClassName("content")[0];
  var height = content.clientHeight;
  content.style.top = window.outerHeight-height;
};

var lastDistance;
var page = new AR.ImageTrackable(this.tracker, "*", {
    drawables: {
        cam: drawableArr,
    },
    onImageRecognized: function(target){
        animationDrawableArr.videoDrawableArr.forEach(function(element,index){
          if(!element.playing){
            element.play(-1);
            element.playing=true;
          }else{
            element.resume();
          }
        });
    },
    onImageLost: function(){
        AR.logger.info("Image Lost");
        animationDrawableArr.videoDrawableArr.forEach(function(element,index){
          element.pause();
        });
    },
    /*distanceToTarget: {
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
    },*/
});
