// pages/nearby/nearby.js
Page({
  data:{
       findAdvisorAnimation:{},//找顾问页面选择城市动画
       findSelectCartAnimation:{},//找顾问页面选择品牌动画
       findSelectModelAnimation:{},//找顾问页面选择车型动画
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  showFindAdvisorBox:function(){//找顾问页面选择城市弹出
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.left(0).step();
        this.setData({
            findAdvisorAnimation: this.animation.export()
        })
    },
    hideFindAdvisorBox:function(){//找顾问页面选择城市收回
        var move_length = 100+'%';
        this.animation.left(move_length).step();
        this.setData({
            findAdvisorAnimation: this.animation.export()
        })
    },
    showSelectCart:function(){//找顾问页面选择品牌弹出
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.left(0).step();
        this.setData({
            findSelectCartAnimation: this.animation.export()
        })
    },
    hideSelectCart:function(){//找顾问页面选择品牌收回
        var move_length = 100+'%';
        this.animation.left(move_length).step();
        this.setData({
            findSelectCartAnimation: this.animation.export()
        })
    },
     showSelectModel:function(){//找顾问页面选择车型弹出
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.left(0).step();
        this.setData({
            findSelectModelAnimation: this.animation.export()
        })
    },
    hideSelectModel:function(){//找顾问页面选择车型收回
        var move_length = 100+'%';
        this.animation.left(move_length).step();
        this.setData({
            findSelectModelAnimation: this.animation.export()
        })
    }
})