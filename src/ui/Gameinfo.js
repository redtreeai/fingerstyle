//游戏UI类
var GameInfo = (function (_super) {
    function GameInfo() {
        GameInfo.super(this);
        this.pauseBtn.visible = false;
        this.dayLabel.visible = false;
        this.moneyLabel.visible = false;
        this.menuBtn.visible = false;
        this.ggBtn.visible = false;
        this.shareBtn.visible = false;


        //注册按钮监听事件,点击后开始游戏
        this.startBtn.on(Laya.Event.CLICK, this, this.onStartBtnClick);
        //监听排行榜点击事件
        this.rankBtn.on(Laya.Event.CLICK, this, this.onRankBtnClick);
        //回到菜单事件
        this.menuBtn.on(Laya.Event.CLICK, this, this.onMenuBtnClick);
        //监听分享事件
        this.shareBtn.on(Laya.Event.CLICK, this, this.onShareBtnClick);
        //监听广告播放时间
        this.ggBtn.on(Laya.Event.CLICK, this, this.onGgBtnClick);



        //初始化UI 显示
        this.reset();
    }
    //注册类
    Laya.class(GameInfo, "GameInfo", _super);
    var _proto = GameInfo.prototype;

    _proto.reset = function () {
        this.infoLabel.text = "";
        this.level(0);
        this.money(0);
    }




    _proto.level = function (value) {
        this.dayLabel.text = "第:" + (value + 1) + "天";
    }

    _proto.money = function (value) {
        this.moneyLabel.text = "钱:" + value;
    }

    _proto.onGgBtnClick = function (e) {

        this.ggBtn.visible = false;
        this.infoLabel.text = "";

        gg_reborn()
    }
    //点击分享
    _proto.onShareBtnClick = function (e) {
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
        this.shareBtn.visible = false;
        this.infoLabel.text = "";

        share_reborn()
    }





    _proto.onStartBtnClick = function (e) {
        this.startBtn.visible = false;
        //注册按钮监听事件,点击后开始游戏
        this.pauseBtn.visible = true;
        this.dayLabel.visible = true;
        this.moneyLabel.visible = true;
        this.rankBtn.visible = false;
        this.pauseBtn.on(Laya.Event.CLICK, this, this.onPauseBtnClick);
        this.infoLabel.visible = true;
        restart();
    }

    _proto.onRankBtnClick = function (e) {
        this.startBtn.visible = false;
        //注册按钮监听事件,点击后开始游戏
        this.rankBtn.visible = false;
        this.menuBtn.visible = true;

        //rankList()

        //监听返回菜单点击事件
        this.menuBtn.on(Laya.Event.CLICK, this, this.onMenuBtnClick);
    }

    _proto.onMenuBtnClick = function (e) {
        this.rankBtn.visible = true;
        this.startBtn.visible = true;
        this.menuBtn.visible = false;
        this.infoLabel.visible = false;
        this.shareBtn.visible = false;
        this.ggBtn.visible = false;
        //closeRank()

    }

    _proto.onPauseBtnClick = function (e) {
        e.stopPropagation();
        //暂停游戏, 并显示对应描述
        this.pauseBtn.visible = false;

        this.dayLabel.visible = false;
        this.moneyLabel.visible = false;
        this.infoLabel.text = "游戏已暂停,点击任意地方恢复游戏";
        pause();
        Laya.stage.once(Laya.Event.CLICK, this, this.onStageClick);
    }

    _proto.onStageClick = function () {
        this.infoLabel.text = "";
        this.pauseBtn.visible = true;
        this.dayLabel.visible = true;
        this.menuBtn.visible = false;
        this.moneyLabel.visible = true;
        resume();
    }
    return GameInfo;
})(ui.GameinfoUI);