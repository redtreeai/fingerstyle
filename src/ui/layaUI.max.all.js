var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var GameinfoUI=(function(_super){
		function GameinfoUI(){
			
		    this.pauseBtn=null;
		    this.dayLabel=null;
		    this.infoLabel=null;
		    this.moneyLabel=null;
		    this.startBtn=null;
		    this.rankBtn=null;
		    this.menuBtn=null;
		    this.shareBtn=null;
		    this.ggBtn=null;

			GameinfoUI.__super.call(this);
		}

		CLASS$(GameinfoUI,'ui.GameinfoUI',_super);
		var __proto__=GameinfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameinfoUI.uiView);

		}

		GameinfoUI.uiView={"type":"View","props":{"width":414,"height":736},"child":[{"type":"Button","props":{"y":10,"x":224,"width":83,"var":"pauseBtn","stateNum":1,"skin":"img/pause.png","height":32}},{"type":"Label","props":{"y":14,"x":12,"var":"dayLabel","text":"第:1天","fontSize":24,"color":"#dcee0e"}},{"type":"Label","props":{"y":298,"x":21,"width":364,"var":"infoLabel","text":"游戏结束","height":143,"fontSize":24,"color":"#f6f4f4","align":"center"}},{"type":"Label","props":{"y":17,"x":136,"var":"moneyLabel","text":"钱:0","fontSize":24,"color":"#f91410","align":"center"}},{"type":"Button","props":{"y":417,"x":172,"width":204,"var":"startBtn","rotation":0,"pivotY":5,"pivotX":69,"name":"开始游戏按钮","labelSize":48,"label":"开始游戏","height":66}},{"type":"Button","props":{"y":522,"x":194,"width":160,"var":"rankBtn","rotation":0,"pivotY":5,"pivotX":69,"name":"排行榜","labelStrokeColor":"#e52724","labelSize":48,"label":"排行榜","height":54}},{"type":"Button","props":{"y":660,"x":103,"width":217,"var":"menuBtn","labelSize":48,"label":"返回菜单","height":48}},{"type":"Button","props":{"y":580,"x":114,"width":81,"var":"shareBtn","labelSize":24,"label":"分享","height":60}},{"type":"Button","props":{"y":584,"x":212,"width":59,"var":"ggBtn","labelSize":24,"label":"广告","height":49}}]};
		return GameinfoUI;
	})(View);