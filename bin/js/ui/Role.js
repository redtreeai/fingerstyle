//主角类
var Role = (function (_super) {
    function Role() {
        Role.super(this)
        //类初始化并获取原型
        //this.init()
    }

    Role.cached = false; //判断是否缓存动画
    //注册
    Laya.class(Role, "Role", _super)

    var _proto = Role.prototype;
    _proto.init = function (_type, _speed, _hitRadius, _camp) {

        this.type = _type;   //非主角物件类型

        this.speed = _speed;     //运动速度

        this.hitRadius = _hitRadius;  //触碰半径

        this.action = "";   //行为状态

        this.alive = true;    //角色是否存活

        this.taked = false; //物品交户启动

        this.camp = _camp;   //元素阵营

        if (!Role.cached) {
            Role.cached = true;
            //缓存主角跑步的动作
            Laya.Animation.createFrames(["img/hero_run1.png", "img/hero_run2.png", "img/hero_run3.png", "img/hero_run4.png"], "hero_run")
            //缓存主角跳跃的动作
            Laya.Animation.createFrames(["img/hero_fly1.png"], "hero_fly")
            //缓存主角开车动作
            Laya.Animation.createFrames(["img/hero_drive1.png", "img/hero_drive2.png"], "hero_drive")
            //缓存汽车的动作
            Laya.Animation.createFrames(["img/car_run1.png", "img/car_run2.png"], "car_run")
            //Laya.Animation.createFrames(["img/bcar_run1.png"], "bcar_run")
            //Laya.Animation.createFrames(["img/ccar_run1.png"], "ccar_run")
            //Laya.Animation.createFrames(["img/dcar_run1.png"], "dcar_run")
            //缓存瞄瞄的动作
            Laya.Animation.createFrames(["img/cat_run1.png"], "cat_run")
            //Laya.Animation.createFrames(["img/bcat_run1.png"], "bcat_run")
            //缓存小女孩
            Laya.Animation.createFrames(["img/girl_run1.png"], "girl_run")
            //缓存路障
            Laya.Animation.createFrames(["img/block_run1.png"], "block_run")
            //缓存money的动作
            Laya.Animation.createFrames(["img/money_run1.png"], "money_run")
        }


        if (!this.role_body) {
            //创建动画对象
            this.role_body = new Laya.Animation();
            //加入容器
            this.addChild(this.role_body);

            this.role_body.on(Laya.Event.COMPLETE, this, this.onPlayComplete)
        }

        //执行动画
        this.playAction("run")

    }

    _proto.onPlayComplete = function () {
        //金币被吃掉
        if (this.action === "eated") {
            //停止播放
            this.role_body.stop();
            //隐藏显示
            this.visible = false;
        }
        //主角在跳跃
        if (this.action === "fly") {
            this.playAction("fly")
        }

        //主角落地重置动画
        if (this.action === "run") {
            this.playAction("run")
        }

        //主角开车动画
        if (this.action === "drive") {
            this.playAction("drive")
        }
    }

    _proto.playAction = function (action) {
        //根据类型播放动画
        this.status = action;

        this.role_body.play(0, true, this.type + "_" + action);
        //获取中心点
        this.role_body_bound = this.role_body.getBounds();
        //设置机身居中
        this.role_body.pos(-this.role_body_bound.width / 2, -this.role_body_bound.height / 2);
    }


    return Role;

})(Laya.Sprite);