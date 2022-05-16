const Emitter = require("mEmitter");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onCollisionEnter: function (other, self) {
        cc.log(self);
        cc.log(other);
     
    },
    onLoad () {
 

        let manager =cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox =true;
    },
   
    // },

    start () {
      


    },

    // update (dt) {},
});
