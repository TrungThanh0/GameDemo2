const Emitter = require('mEmitter');
cc.Class({
    extends: cc.Component,

    properties: {
        spineBoy: sp.Skeleton,
        Bullet : cc.Prefab,
        score : cc.Label,
        
        _moveLeft: null,
        _jump: null,
        _moveRight: null, 
        _moveDown: null,
        _shot: null,
        _flag: false,
        _score : 100,




    },
    onLoad() {
        this._moveDown = this.moveDown.bind(this);
        this._jump = this.jump.bind(this);
        this._moveLeft = this.moveLeft.bind(this);
        this._moveRight = this.moveRight.bind(this);
        this._Shot = this.Shot.bind(this);

        Emitter.instance = new Emitter();

        Emitter.instance.registerEvent("MOVELEFT", this._moveLeft);
        Emitter.instance.registerEvent("MOVERIGHT", this._moveRight);
        Emitter.instance.registerEvent("JUMP", this._jump);
        Emitter.instance.registerEvent("MOVEDOWN", this._moveDown);
        Emitter.instance.registerEvent("SHOT", this._Shot);

        Emitter.instance.registerEvent("MOVELEFT_up", this._moveLeft);
        Emitter.instance.registerEvent("MOVERIGHT_up", this._moveRight);
        Emitter.instance.registerEvent("JUMP_up", this._jump);
        Emitter.instance.registerEvent("MOVEDOWN_up", this._moveDown);

        let manager =cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox =true;
      
    },
    onCollisionEnter: function (other, self) {
        cc.log(self);
        cc.log(other);
        this.Skeleton.setAnimation(0,'death',false);
        this.node.stopActionByTag(0);
    },
    moveDown(value) {
        if (!this._flag) {
            this._flag = true;
            this.spineBoy.addAnimation(0, "hoverboard", true);
            this.spineBoy.setEventListener((entry, event) => {
                if (entry.animationEnd != 0) this._flag = false;
            });
        }

    },
    
    Shot(value){
        cc.log(value);
        let bullet = cc.instantiate(this.Bullet);
        if(!this._flag){
            // this._flag = true;
            bullet.parent = this.node;
            bullet.runAction(cc.sequence(cc.moveBy(1,500,0),cc.callFunc(this.removeBullet,this)));
            this.spineBoy.setAnimation(0,"shoot",false);
            this.spineBoy.addAnimation(0,"idle",true);
        }
    },
    removeBullet(){
        for(let i=0;i<this.node._children.length;i++){
            this.node._children[i].destroy();
        }
    },

    jump(value) {
        cc.log(value);
        if (!this._flag) {
            let jumpUp = cc.moveBy(0.4, cc.v2(0, 200));
            let jumpDown = cc.moveBy(0.4, cc.v2(0, -200));
            let jump = cc.sequence(jumpUp,cc.delayTime(0.1),jumpDown);
           // this.node.getComponent(cc.BoxCollider).node.runAction(jump)
            this._flag = true;
            this.spineBoy.setAnimation(0, "jump", false);
            this.spineBoy.addAnimation(0, "idle-turn", false);
            this.spineBoy.addAnimation(0, "idle", true);
            this.spineBoy.setEventListener((entry, event) => {
                if (entry.animationEnd != 0) {
                    this._flag = false;
                }
            });
        }
    },
    
    moveLeft(value) {
        cc.log(value);
        let move = cc.sequence(cc.moveBy(5,-1000,0),cc.moveBy(5,-3000,0));
        if (!this._flag && (value)) {
            this._flag = true;
            this.node.runAction(cc.flipX(true));
            this.node.runAction(move);
            move.setTag(0);
            this.spineBoy.setAnimation(0, "walk", false);
            this.spineBoy.addAnimation(0, "run", true);
        }else if(!this._flag || (!value)){
            this._flag = false;
            this.node.stopAction(0);
            this.spineBoy.setAnimation(0,"run-to-idle",false);
            this.spineBoy.addAnimation(0,"idle",true);
        }
    },
    moveRight(value) {
        cc.log(value);
        let move = cc.sequence(cc.moveBy(5,1000,0),cc.moveBy(5,3000,0));
        if (!this._flag && (value)) {
            this._flag = true;
            this.node.runAction(cc.flipX(false));
            this.node.runAction(move);
            move.setTag(0);
            this.spineBoy.setAnimation(0, "walk", false);
            this.spineBoy.addAnimation(0, "run", true);
        }else if(!this._flag || (!value)){
            this._flag = false;
            this.node.stopActionByTag(0);
            this.spineBoy.setAnimation(0,"run-to-idle",false);
            this.spineBoy.addAnimation(0,"idle",true);
        }
    },
    

    // },
    
     start() {
        this.Skeleton.addAnimation(0, "portal", false);
        this.Skeleton.addAnimation(0, "idle", true);

     },
    update (dt) {
        this.node.getComponent(cc.BoxCollider).offset= cc.v2(this.spineBoy.findBone("torso3").worldX , this.spineBoy.findBone("torso3").worldY );
    },
});
