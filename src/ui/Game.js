//游戏主入口类，无需任何继承

var second_click_posx   //监听屏幕滑动事件的坐标
var first_click_posx
var first_click_posy
var second_click_posy
var distx     //横向滑动距离
var disty     //纵向滑动距离
var isshare = false;
var isgg = false;


var start_jump_time = 0  //起跳事件
var isjump = false//起跳状态记录
var start_drive_time = 0 //开始开车时间
var isdrive = false //是否开车

var lastX
var lastY
var role_posx = 2


// let circleButton = wx.createGameClubButton({
//         icon: 'green',
//         style: {
//             left: 0,
//             top: 0,
//             width: 40,
//             height: 40
//         }
//     })

//小游戏发行引入
// wx.authorize({
//     scope: 'scope.userinfo'
// }) 
// wx.authorize({
//     scope: 'scope.writePhotosAlbum'
// }) 




//var Game = (function () {

//(function Game() {
//初始化微信小游戏
Laya.MiniAdpter.init(true);

Laya.init(414, 736, Laya.WebGL);


Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;


this.level = 0    //level无上限
this.score = 0   //满100level+1
this.money = 0  //用于乘车消费


this.rankSprite2 = new Laya.Sprite();


Laya.loader.load("res/atlas/img.atlas", Laya.Handler.create(this, onLoaded), null, Laya.loader.ATLAS);

//})();

//小游戏发行引入
function rankList() {
    let openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({
        text: 'hello',
    })
    let sharedCanvas = openDataContext.canvas //获取开放数据域的画布

    var rankSprite2 = this.rankSprite2

    Laya.stage.addChild(rankSprite2);
    Laya.timer.once(400, this, function () {
        var rankTexture = new Laya.Texture(sharedCanvas);
        rankTexture.bitmap.alwaysChange = true;//小游戏使用，非常费，每帧刷新  
        rankSprite2.graphics.drawTexture(rankTexture, 20, 10, rankTexture.width, rankTexture.height);
    });

}

function closeRank() {
    var rankSprite2 = this.rankSprite2
    Laya.stage.removeChild(rankSprite2)
}

function onLoaded() {

    //实例化背景
    this.bg = new Background();
    //把背景添加到舞台
    Laya.stage.addChild(this.bg);
    //实例化角色容器
    this.roleBox = new Laya.Sprite();
    //添加到舞台上
    Laya.stage.addChild(this.roleBox);
    //创建游戏UI界面
    this.gameInfo = new GameInfo();
    //将UI界面添加到舞台
    Laya.stage.addChild(this.gameInfo);
    //创建一个主角
    this.role = new Role();
    //添加到舞台
    this.roleBox.addChild(this.role);
    //游戏圈按钮可视化
}



//暂停游戏
function pause() {
    //停止游戏主循环
    Laya.timer.clear(this, onLoop);
    //移除鼠标移动事件 
    Laya.stage.off(Laya.Event.MOUSE_DOWN, this, onMouseDown);

}

//回到游戏
function resume() {
    //舞台监听触摸移动事件
    Laya.timer.frameLoop(1, this, onLoop)

    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, onMouseDown);
    this.gameInfo.menuBtn.visible = false;
    this.gameInfo.pauseBtn.visible = true;
    this.gameInfo.shareBtn.visible = false;
    this.gameInfo.ggBtn.visible = false;

}


function share_reborn() {  //分享复活

    if (this.isshare == false) {
       
       
        
    //      let tempFilePath = canvas.toTempFilePathSync({
         
    //       destWidth: 500,
    //       destHeight: 400,
          
    //    })

    //     wx.shareAppMessage({
    //       title : '我已经连续'+this.level+'天没迟到啦,你能和我比比吗',
    //       imageUrl: tempFilePath
    //     })
        
        
        this.isshare = true;

        this.role.alive = true;
        this.role.visible = true;

        for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
            var role = this.roleBox.getChildAt(i);
            if (role.camp != 0) {
                role.removeSelf();
                //回收之前重置
                role.visible = true;
                //回收到对象池子
                Laya.Pool.recover("role", role);
            }

        }
        //移除之后 恢复游戏
        resume();
    }
}



function gg_reborn() {  //看广告复活



    
    if (this.isgg == false) {
        //拉取微信广告
        //let rewardAD = wx.createRewardedVideoAd({adUnitId:'xxxxxx'})

        //播放广告

        //rewardAD.show()
        //关闭监听
        //rewardAD.onClose(() =>{
        this.isgg = true;

        this.role.alive = true;
        this.role.visible = true;

        for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
            var role = this.roleBox.getChildAt(i);
            if (role.camp != 0) {
                role.removeSelf();
                //回收之前重置
                role.visible = true;
                //回收到对象池子
                Laya.Pool.recover("role", role);
            }

        }
        //移除之后 恢复游戏
        resume();

       // })
        
    }



}

function restart() {

    //重置游戏数据 


    this.score = 0;
    this.level = 0;
    this.money = 0;
    this.isshare = false;
    this.isgg = false;


    this.start_jump_time = 0  //起跳事件
    this.isjump = false;//起跳状态记录
    this.isdrive = false;
    this.start_drive_time = 0;
    this.gameInfo.reset();

    //初始化主角信息   图集名字，速度，交互半径
    this.role.init("hero", 1, 80, 0);
    //设置主角位置
    this.role.pos(Laya.stage.width / 2 + 50, Laya.stage.height / 7 * 6);
    //可视化
    this.role.visible = true;
    //重置参数
    this.role_posx = 2



    for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
        var role = this.roleBox.getChildAt(i);
        if (role.camp != 0) {
            role.removeSelf();
            //回收之前重置
            role.visible = true;
            //回收到对象池子
            Laya.Pool.recover("role", role);
        }

    }


    //移除之后 恢复游戏
    resume();
}

//------------------------------------------------------------------------------

//游戏主要逻辑

//onloop回调 
function onLoop() {
    if (this.isdrive == true) {
        this.bg.bgspeed = 20;
    } else {
        this.bg.bgspeed = 5;

    }

    //遍历所有敌人,更改其状态
    for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
        var role = this.roleBox.getChildAt(i);
        if (role.type == "hero") {
        } else {
            if (role && role.speed) {
                role.y += role.speed;
                if (role.y > 1000 || !role.visible || role.takeaway) {
                    //移动到显示区域外时则移除自己
                    role.removeSelf();//从舞台移除
                    //移除后重置属性
                    role.taked = false;
                    role.visible = true;
                    Laya.Pool.recover("role", role)
                }
            }
        }

    }
    //碰撞检测,如果主角死亡,则停止游戏.
    for (var i = this.roleBox.numChildren - 1; i > 0; i--) {
        var role1 = this.roleBox.getChildAt(i);
        //如果主角存在
        if (role1.alive === false || role1.taked === true) continue;
        for (var j = i - 1; j > -1; j--) {

            //如果配角存在
            if (!role1.visible) continue;
            //获取对象2
            var role2 = this.roleBox.getChildAt(j);
            if (role2.alive === false || role2.taked === true || role1.camp === role2.camp) {

            } else {
                //计算碰撞区域
                var hitRadius = role1.hitRadius = role2.hitRadius;
                //根据距离判断是否碰撞
                if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                    //具体交互逻辑类型

                    if (role1.camp == 0 && role2.camp == 1 && role1.alive == true && this.isjump == false) {
                        // console.log('主角被敌人杀死')

                        if (this.isdrive == true) {  //敌人被主角杀死

                            role2.taked = true;
                            role2.visible = false;
                        } else {
                            if (this.isdrive == false && role2.type == 'car' && this.money >= 10) {
                                //有钱就开车

                                role2.taked = true;
                                role2.visible = false;
                                role1.action = 'drive';
                                this.isdrive = true;
                                this.start_drive_time = Laya.timer.currFrame;

                                this.money -= 10;
                                this.gameInfo.money(this.money)

                            } else {
                                role1.alive = false;
                                role1.visible = false;

                                //如果主角阵亡
                                Laya.timer.clear(this, onLoop);
                                if (this.isshare == false) {
                                    this.gameInfo.shareBtn.visible = true;
                                }
                                if (this.isgg == false) {
                                    this.gameInfo.ggBtn.visible = true;
                                }


                                if (this.isshare == false) {
                                    this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击分享立即复活\n每局限一次.";

                                } else {
                                    if (this.isgg == false) {
                                        this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击广告立即复活\n每局限一次.";
                                    } else {
                                        this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击这里重新开始.";
                                    }
                                }

                                //微信发行引入
                                // var ts = Math.round(new Date().getTime() / 1000).toString();

                                // lastScore = localStorage.getItem('score')

                                // if (lastScore) {

                                //     if (this.level > lastScore) {
                                //         localStorage.setItem('score', this.level)
                                //         wx.setUserCloudStorage({
                                //             KVDataList: [{ key: 'score', value: this.level + '' }, { key: 'ts', value: ts }],
                                //             success: function (res) {
                                //                 console.log('setUserCloudStorage', 'success', res)
                                //             },
                                //             fail: function (res) {
                                //                 console.log('setUserCloudStorage', 'fail')
                                //             },
                                //             complete: function (res) {
                                //                 console.log('setUserCloudStorage', 'ok')
                                //             }
                                //         })
                                //     }

                                // } else {
                                //     localStorage.setItem('score', this.level)
                                //     wx.setUserCloudStorage({
                                //         KVDataList: [{ key: 'score', value: this.level + '' }, { key: 'ts', value: ts }],
                                //         success: function (res) {
                                //             console.log('setUserCloudStorage', 'success', res)
                                //         },
                                //         fail: function (res) {
                                //             console.log('setUserCloudStorage', 'fail')
                                //         },
                                //         complete: function (res) {
                                //             console.log('setUserCloudStorage', 'ok')
                                //         }
                                //     })

                                // }


                                //注册点击事件,点击重新开始游戏
                                this.gameInfo.pauseBtn.visible = false;

                                this.gameInfo.menuBtn.visible = true;



                                this.gameInfo.infoLabel.once(Laya.Event.CLICK, this, restart);

                            }
                        }

                    } else if (role1.camp == 0 && role2.camp == 2 && role2.taked == false && this.isjump == false) {
                        // console.log('钱被主角吃了'

                        role2.taked = true;
                        role2.visible = false;
                        this.money += 1;
                        this.gameInfo.money(this.money)

                    } else if (role1.camp == 1 && role2.camp == 2 && role2.taked == false) {
                        //console.log('钱被敌人吃了')

                        role2.taked = true;
                        role2.visible = false;
                    }
                    //反向交互逻辑
                    if (role2.camp == 0 && role1.camp == 1 && role2.alive == true && this.isjump == false) {
                        // console.log('主角被敌人杀死')
                        if (this.isdrive == true) {  //敌人被主角杀死
                            role1.taked = true;
                            role1.visible = false;
                        } else {
                            if (this.isdrive == false && role1.type == 'car' && this.money >= 10) {
                                //有钱就开车
                                role1.taked = true;
                                role1.visible = false;
                                role2.action = 'drive';
                                this.isdrive = true;
                                this.start_drive_time = Laya.timer.currFrame;
                                this.money -= 10;
                                this.gameInfo.money(this.money)


                            } else {
                                role2.alive = false;
                                role2.visible = false;


                                //如果主角阵亡
                                Laya.timer.clear(this, onLoop);
                                if (this.isshare == false) {
                                    this.gameInfo.shareBtn.visible = true;
                                }
                                if (this.isgg == false) {
                                    this.gameInfo.ggBtn.visible = true;
                                }


                                if (this.isshare == false) {
                                    this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击分享立即复活\n每局限一次.";

                                } else {
                                    if (this.isgg == false) {
                                        this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击广告立即复活\n每局限一次.";
                                    } else {
                                        this.gameInfo.infoLabel.text = "GameOver\n你已经:" + (this.level) + "天没迟到了\n点击这里重新开始.";
                                    }
                                }
                                //微信发行引入
                                // var ts = Math.round(new Date().getTime() / 1000).toString();

                                // lastScore = localStorage.getItem('score')

                                // if (lastScore) {

                                //     if (this.level > lastScore) {
                                //         localStorage.setItem('score', this.level)
                                //         wx.setUserCloudStorage({
                                //             KVDataList: [{ key: 'score', value: this.level + '' }, { key: 'ts', value: ts }],
                                //             success: function (res) {
                                //                 console.log('setUserCloudStorage', 'success', res)
                                //             },
                                //             fail: function (res) {
                                //                 console.log('setUserCloudStorage', 'fail')
                                //             },
                                //             complete: function (res) {
                                //                 console.log('setUserCloudStorage', 'ok')
                                //             }
                                //         })
                                //     }

                                // } else {
                                //     localStorage.setItem('score', this.level)
                                //     wx.setUserCloudStorage({
                                //         KVDataList: [{ key: 'score', value: this.level + '' }, { key: 'ts', value: ts }],
                                //         success: function (res) {
                                //             console.log('setUserCloudStorage', 'success', res)
                                //         },
                                //         fail: function (res) {
                                //             console.log('setUserCloudStorage', 'fail')
                                //         },
                                //         complete: function (res) {
                                //             console.log('setUserCloudStorage', 'ok')
                                //         }
                                //     })

                                // }


                                this.gameInfo.pauseBtn.visible = false;

                                this.gameInfo.menuBtn.visible = true;

                                //注册点击事件,点击重新开始游戏

                                this.gameInfo.infoLabel.once(Laya.Event.CLICK, this, restart);

                                //分享事件 微信发行引入
                                // wx.shareAppMessage({
                                //     title: '老子已经连续:' + this.level + '天上班不迟到了，你行吗'
                                // })
                                // wx.onShareAppMessage(function () {
                                //     return {
                                //         title: '老子已经连续:' + this.level + '天上班不迟到了，你行吗',
                                //         imageUrl: canvas.toTempFilePathSync({
                                //             destWidth: 500,
                                //             destHeight: 400
                                //         })
                                //     }
                                // })
                            }


                        }

                    } else if (role2.camp == 0 && role1.camp == 2 && role1.taked == false && this.isjump == false) {
                        //  console.log('钱被主角吃了')

                        role1.taked = true;
                        role1.visible = false;
                        this.money += 1;
                        this.gameInfo.money(this.money);

                    } else if (role2.camp == 1 && role1.camp == 2 && role1.taked == false) {
                        //  console.log('钱被敌人吃了')

                        role1.taked = true;
                        role1.visible = false;
                    }
                }
            }


        }
    }


    this.level = parseInt(this.score / 60)
    this.gameInfo.level(this.level);


    //10秒后停止飙车
    if (Laya.timer.currFrame - this.start_drive_time > 600 && this.isdrive == true) {
        this.isdrive = false;
        this.role.action = 'run';
    }

    //根据速度添加成绩

    if (Laya.timer.currFrame % 60 === 0) {
        if (this.isdrive == true) {
            this.score += 3
        } else {
            this.score += 1

        }
    }

    //起跳逻辑

    if (this.isjump === false & this.role.action === 'fly') {
        this.isjump = true;
        this.start_jump_time = Laya.timer.currFrame;
    }
    if (this.isjump === true & Laya.timer.currFrame - this.start_jump_time > 60) {
        this.role.action = 'run';
        this.isjump = false;
    }

    if (Laya.timer.currFrame % 60 === 0) {
        createEnemy(2);
    }
}

//------------------------------------------------------------------------------
//鼠标滑动组合逻辑
/**按下事件处理*/
function onMouseDown() {
    //添加鼠标移到侦听
    this.lastX = this.role.x;
    this.lastY = this.role.y;
    this.first_click_posx = Laya.stage.mouseX;
    this.first_click_posy = Laya.stage.mouseY;

    Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMouseMove);

    Laya.stage.on(Laya.Event.MOUSE_UP, this, onMouseUp);

    Laya.stage.on(Laya.Event.MOUSE_OUT, this, onMouseUp);

}
/**移到事件处理*/
function onMouseMove() {

    this.second_click_posx = Laya.stage.mouseX;
    this.second_click_posy = Laya.stage.mouseY;
}


/**抬起事件处理*/
function onMouseUp() {


    Laya.stage.off(Laya.Event.MOUSE_MOVE, this, onMouseMove);
    Laya.stage.off(Laya.Event.MOUSE_UP, this, onMouseUp);
    Laya.stage.off(Laya.Event.MOUSE_OUT, this, onMouseUp);


    this.disty = this.first_click_posy - this.second_click_posy;
    this.distx = this.first_click_posx - this.second_click_posx;

    //先判断是不是要跳
    if (this.disty > 0 & Math.abs(this.disty) > Math.abs(this.distx) & this.isdrive == false) {
        this.role.action = 'fly';
    } else if (this.disty < 0 & Math.abs(this.disty) > Math.abs(this.distx) & this.role.action == 'fly') {
        this.role.action = 'run' //提前下落
        this.isjump = false;

    }
    else {
        // 滑动到目的地

        if (this.distx > 0 & this.role_posx > 0) {
            this.role_posx -= 1

            this.role.pos(this.lastX - Laya.stage.width / 4, this.lastY);
        }
        if (this.distx < 0 & this.role_posx < 3) {
            this.role_posx += 1

            this.role.pos(this.lastX + Laya.stage.width / 4, this.lastY);
        }
    }
}




//------------------------------------------------------------------------------

//游戏元素生成主要逻辑
function createEnemy(num) {
    for (var i = 0; i < num; i++) {
        var r = Math.random();
        var track = 0;
        if (r < 0.25) {
            track = Laya.stage.width / 2 + 50 - Laya.stage.width / 4 - Laya.stage.width / 4

            var rr = Math.random();

            if (0.5 > rr > 0) {
                var car = Laya.Pool.getItemByClass("car", Role)
                if (this.isdrive == true) {
                    
                    car.init("car", 60, 80, 1)

                } else {
                    var rrr = Math.random();


                    car.init("car", 20 - rrr * 10, 80, 1)
                }
                car.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(car);
            } else {
                var money = Laya.Pool.getItemByClass("money", Role)
                if (this.isdrive == true) {
                    money.init("money", 20, 80, 2)

                } else {
                    var rrr = Math.random();

                    money.init("money", 10 - rrr * 9, 80, 2)

                }
                money.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(money);
            }

        } else if (0.5 > r >= 0.25) {
            track = Laya.stage.width / 2 + 50 - Laya.stage.width / 4
            var rr = Math.random();

            if (0.5 > rr > 0) {
                var car = Laya.Pool.getItemByClass("car", Role)
                if (this.isdrive == true) {
                    car.init("car", 60, 80, 1)

                } else {
                    var rrr = Math.random();

                    car.init("car", 20 - rrr * 10, 80, 1)
                }
                car.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(car);
            } else {
                var money = Laya.Pool.getItemByClass("money", Role)
                if (this.isdrive == true) {
                    money.init("money", 20, 80, 2)

                } else {
                    var rrr = Math.random();

                    money.init("money", 10 - rrr * 9, 80, 2)

                } money.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(money);
            }
        } else if (r >= 0.75) {
           track = Laya.stage.width / 2 + 50 + Laya.stage.width / 4
            var rr = Math.random();
            if(0.25 >rr> 0){
                var girl = Laya.Pool.getItemByClass("girl", Role)
                if (this.isdrive == true) {
                    girl.init("girl", 28, 80, 1)

                } else {
                    var rrr = Math.random();

                    girl.init("girl", 12 - rrr * 10, 80, 1)

                }
                girl.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(girl);
            }else if (0.5 >rr>= 0.25){
                var block = Laya.Pool.getItemByClass("block", Role)
                if (this.isdrive == true) {
                    block.init("block", 28, 80, 1)

                } else {
                    var rrr = Math.random();

                    block.init("block", 12 - rrr * 10, 80, 1)

                }
                block.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(block);
            }else if (0.75 > rr > 0.5) {
                var cat = Laya.Pool.getItemByClass("cat", Role)
                if (this.isdrive == true) {
                    cat.init("cat", 40, 80, 1)

                } else {
                    var rrr = Math.random();

                    cat.init("cat", 15 - rrr * 10, 80, 1)

                }
                cat.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(cat);
            } else {
                var money = Laya.Pool.getItemByClass("money", Role)
                if (this.isdrive == true) {
                    money.init("money", 20, 80, 2)

                } else {
                    var rrr = Math.random();

                    money.init("money", 10 - rrr * 9, 80, 2)

                }
                money.pos(track, Laya.stage.height / 12)

                this.roleBox.addChild(money);

            }


        } else {
            track = Laya.stage.width / 2 + 50
            var rr = Math.random();
            if(0.25 >rr> 0){
                var girl = Laya.Pool.getItemByClass("girl", Role)
                if (this.isdrive == true) {
                    girl.init("girl", 28, 80, 1)

                } else {
                    var rrr = Math.random();

                    girl.init("girl", 12 - rrr * 10, 80, 1)

                }
                girl.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(girl);
            }else if (0.5 >rr>= 0.25){
                var block = Laya.Pool.getItemByClass("block", Role)
                if (this.isdrive == true) {
                    block.init("block", 28, 80, 1)

                } else {
                    var rrr = Math.random();

                    block.init("block", 12 - rrr * 10, 80, 1)

                }
                block.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(block);
            }else if (0.75 > rr > 0.5) {
                var cat = Laya.Pool.getItemByClass("cat", Role)
                if (this.isdrive == true) {
                    cat.init("cat", 40, 80, 1)

                } else {
                    var rrr = Math.random();

                    cat.init("cat", 15 - rrr * 10, 80, 1)

                }
                cat.pos(track, Laya.stage.height / 12)

                //添加到舞台
                this.roleBox.addChild(cat);
            } else {
                var money = Laya.Pool.getItemByClass("money", Role)
                if (this.isdrive == true) {
                    money.init("money", 20, 80, 2)

                } else {
                    var rrr = Math.random();

                    money.init("money", 10 - rrr * 9, 80, 2)

                }
                money.pos(track, Laya.stage.height / 12)

                this.roleBox.addChild(money);

            }
        }


    }

}
//})();