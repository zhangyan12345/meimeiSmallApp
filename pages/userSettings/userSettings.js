var util = require('../../utils/selectCity.js');

var app = getApp()
Page({
    data: {
        imgUrl: null,
        
        sex: [{ "sexItem": "男", "sexId": 0 }, { "sexItem": "女", "sexId": 1 }],//选择性别
        wantCarMsg:'',//选择要买的车文字
        wantCarImage:'',//选择要买的车图片
        defaultSex: "",
        provinceArray: [],
        cityArray: [],
        countyArray: [],

        provinceIndex: 0,
        cityIndex: 0,
        countyIndex: 0,

        animation: {},    //选择性别动画
        cityAnimation:{}, //选择城市动画
        setlectCity:{}  //城市选择只需要维护这个数组
    },
    setPhotoInfo: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths)
                that.setData({
                    imgUrl: tempFilePaths
                })
            }
        })
    },
    selectSex: function (event) {//选择性别类
        var sexId = event.currentTarget.dataset.sexid;
        for (var i in this.data.sex) {
            if (i == sexId) {
                this.setData({
                    defaultSex: this.data.sex[sexId].sexItem
                })
                this.hideSexBox();
            }
        }
        app.globalData.userInfo = sexId  //设置全局的userInfo
    },
    showSexBox: function () {//选择性别动画弹出

    console.log(12121)
        var animation = wx.createAnimation({
            duration:500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.top(0).step();
        this.setData({
            animation: this.animation.export()
        })
    },
    hideSexBox: function () {//选择性别动画关闭
        var move_length = 100 + '%';
        this.animation.top(move_length).step();
        this.setData({
            animation: this.animation.export()
        })
    },
    showCityBox: function () {//选择城市动画弹出  
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.left(0).step();
        this.setData({
            cityAnimation: this.animation.export()
        })
    },
    hideCityBox: function () {//选择城市动画关闭
        var move_length = 100 + '%';
        this.animation.left(move_length).step();
        this.setData({
            cityAnimation: this.animation.export()
        })
    },
   ProID: '',
   CityID: '',
   cityArrayDemo: [],
   onLoad: function(options) {
        this.setData({//选择完我要买的车返回的数据
            wantCarMsg:options.finalMsg,
            wantCarImage:options.finalImage
        });

        var provinceArrayDemo = []
        for (var i = 0; i < util.provinceArray.length; ++i) {
          var item = util.provinceArray[i]
          provinceArrayDemo.push(item.name);
        }
        this.setData({
             provinceArray: provinceArrayDemo
        })
    },
  bindProvinceChange: function(e) {//先取省份里面的 ProID
     for (var i = 0; i < util.provinceArray.length; ++i) {
          var item = util.provinceArray[i]
          if (i==e.detail.value){
            this.ProID = item.ProID
            break
          }
      }
      this.cityArrayDemo = []//将城市里面里面的 ProID 组合在一起
      for (var i = 0; i < util.cityArray.length; ++i) {
          var item = util.cityArray[i]
          if (item.ProID==this.ProID){
            this.cityArrayDemo.push(item.name)
          }
      }
       this.setData({
          provinceIndex: e.detail.value,
          cityArray: this.cityArrayDemo,
      })
  },
  bindCityChange: function(e) {//先取市里面的 ProID
      
      for (var j = 0; j < util.cityArray.length; ++j) {
        var item = util.cityArray[j]
        if (item.name==this.cityArrayDemo[e.detail.value]){
          this.CityID = item.CityID
          break
        }
      }
    //将城市里面里面的 ProID 组合在一起
      var countyArrayDemo = []
      for (var i = 0; i < util.countyArray.length; ++i) {
          var item = util.countyArray[i]
          if (item.CityID==this.CityID){
            console.log(countyArrayDemo)
            countyArrayDemo.push(item.DisName)
          }
      }
      this.setData({
          countyArray: countyArrayDemo,
          cityIndex: e.detail.value,
          countyIndex: 0
      })
      this.data.hideSexBox();
  },
  bindCountyChange: function(e) {
    this.setData({
      countyIndex: e.detail.value
    })
  },
  wantBugCar:function(){
      wx.navigateTo({
        url: '/pages/selectCartPage/selectCartPage',
        success: function(res){
          // success
        }
      })
  }
})