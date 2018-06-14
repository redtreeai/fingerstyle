//循环滚动背景图展示

var Background = (function (_super) {

    function Background() {

        Background.super(this)
        this.bg1 = new Laya.Sprite(); //添加精灵
        this.bg1.loadImage("img/road1.png"); //加载图片
        this.addChild(this.bg1)  //加载到容器里

        this.bg2 = new Laya.Sprite(); //添加精灵
        this.bg2.loadImage("img/road2.png"); //加载图片
        this.bg2.pos(0,-736)   //放在背景一上面 
        this.addChild(this.bg2)  //加载到容器里

        this.bgspeed=1

       //创建一个帧循环，更新容器位置
        Laya.timer.frameLoop(1,this,this.onloop)
         

    }
    //注册类
    Laya.class(Background, "Background", _super)
    var _proto = Background.prototype;

    
    _proto.onloop = function(){
        
        this.y +=this.bgspeed//每帧向下移动一像素
        if (this.bg1.y +this.y >= 736){
            this.bg1.y -= 736*2
        }
          if (this.bg2.y +this.y >= 736){
            this.bg2.y -= 736*2
        }
    }
    return Background;

})(Laya.Sprite)