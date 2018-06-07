var World={
  targetCollectionResource:null,
  tracker:null,

  init:function(){
    this.initTracker();
  },
  initTracker:function(){
    this.targetCollectionResource=new AR.TargetCollectionResource("assets/coke.wto");
    this.tracker = new AR.ObjectTracker(this.targetCollectionResource,{
      onTargetsLoaded:function(){
        alert("targetsloaded");
      },
      onError: function(errorMessage){
        alert(errorMessage);
      }
    });
  },
};

World.init();
