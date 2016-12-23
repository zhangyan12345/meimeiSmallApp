//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    cityData:null,
    appHotCart:null,
    homeBanner:null,
    animationData: {},
    defaultCity:1,
    currentuId: ""
  },
  selcetedCity:function(event){
      var cityId = event.currentTarget.dataset.cityid;
      this.setData({
          defaultCity:cityId
      });
      app.globalData.globalDefaultCity = cityId;
      this.getBaseData();
      this.hideCityBox();
      this.getHomeBanner();

  },
  onLoad: function (options) { 
       this.setData({
           defaultCity:app.globalData.globalDefaultCity
       });
       var that = this;
       this.data.currentPostId = options.uid;
        wx.request({//得到城市数据
            url: app.globalData.mmBase + "/app/common/getCity.do",
            type:"GET",
            header:{
              'Content-Type': 'application/json'
            },
            success: function (res) {
              that.setData({
                  cityData: res.data.open
              });console.log(that.data.cityData)
            }
      });
      this.getBaseData();////加载首页数据
      this.getAppHotCart();
      this.getHomeBanner();

   },
   getBaseData:function(){
        var that = this;
       wx.request({//加载首页数据
            url: app.globalData.mmBase + "/app/user/getWantcar.do",
            type:"GET",
            data: {
                'info': '{"cityNo":"' + this.data.defaultCity + '","uId":"' + this.data.currentuId + '"}'
            },
            header:{
              'Content-Type': 'application/json'
            },
            success: function (res) {console.log(res.data)
            
            }
      });
   },
   getAppHotCart:function(){//首页热门推荐获取数据
       var that = this;
       wx.request({
            url: app.globalData.mmBase + "/app/car/getAppHotCart.do",
            type:"GET",
            header:{
              'Content-Type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    appHotCart: res.data.list
                })
            }
      });
   },
   getHomeBanner:function(){//首页轮播数据获取
       var that = this;
       wx.request({
            url: app.globalData.mmBase + "/app/common/selectAd.do",
            type:"GET",
            data: {
                'info': '{"type":"0","appType":"0","cityNo":"'+ this.data.defaultCity +'"}'
            },
            header:{
              'Content-Type': 'application/json'
            },
            success: function (res) {console.log(res.data.list)
                that.setData({
                    homeBanner: res.data.list
                })
            }
      });
   },
   showCityBox:function(){//选择城市动画弹出
      var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
      })
      this.animation = animation;
      this.animation.top(0).step();
      this.setData({
        animationData: this.animation.export()
      })
  },
  hideCityBox:function(){//选择城市动画关闭
      var move_length = -100+'%';
      this.animation.top(move_length).step();
      this.setData({
        animationData: this.animation.export()
      })
  },
   goFindPeople:function(){
       wx.navigateTo({
         url: '/pages/nearby/nearby'
       
       })
   },
    goActivity:function(){
       wx.navigateTo({
         url: '/pages/activity/activity'
       })
   }
})
