var pinyinSort = require('../../utils/pinyinSort.js');
var app = getApp();
Page({
    data:{
        result:[],
        selectCartTypeAnimation:{},
        selectCartType:null,
        scrollFlag:true,
        setScrollHeight:null,
        finalImage:null, //最终图片
        finalMsg:null  //最终文本
    },
    onLoad:function(options){//请求所有品牌
        var that = this;
        wx.request({
            url: app.globalData.mmBase + "/app/car/getAllCart.do",
            type: "POST",
            success: function (res) {
                  var array = [];
                 
                  for(var i=0;i<res.data.list.length;i++){
                      var cart = {};
                      cart.name = res.data.list[i].name
                      cart.image= res.data.list[i].image
                      cart.cartId = res.data.list[i].cartId
                      array.push(cart)
                  }
                 that.pySegSort(array);
            },
            fail: function (error) {
                  console.log(error)
            }
        });
    },
    pySegSort:function(arr){  //拼音排序
        var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
        for(var i=0;i<letters.length;i++){
            var letter = letters[i];
            var arrPy= [];
            for(var j=0;j<arr.length;j++){
                var pinyin = pinyinSort.query(arr[j].name);
                var onePy = pinyin[0].slice(0,1);
                
                if(letter == onePy){
                    arrPy.push(arr[j]);
                }
            }
            var result= {
                letter:letter,
                arrPy:arrPy
            }
            this.data.result.push(result)
            this.setData({
                result:this.data.result
            });   
        }
        var resultBigHeight = this.data.result.length*50;//50是高度
        var resultItemHeight = 0;
        for(var i= 0;i<this.data.result.length;i++){
            if(this.data.result[i].arrPy){
                if(this.data.result[i].arrPy.length == 0){
                        console.log(i)
                }else{
                    for(var j= 0;j<this.data.result[i].arrPy.length;j++){
                        resultItemHeight++;
                    }
                }
            }
        }
       resultItemHeight = resultItemHeight*100;//100也是元素高度
       var lastHeight = resultItemHeight + resultBigHeight + "rpx";
       this.setData({
           setScrollHeight:lastHeight
       })   
    },
    getFinalData:function(event){//最终选择车型
        var cartId = event.currentTarget.dataset.cartid;
        for(var i=0;i<this.data.selectCartType.length;i++){
            for(var j=0;j<this.data.selectCartType[i].carttype.length;j++){
                if(this.data.selectCartType[i].carttype[j].cartTypeId == cartId){
                    this.setData({
                        finalImage:this.data.selectCartType[i].carttype[j].image,
                        finalMsg:this.data.selectCartType[i].carttype[j].carModel
                    })
                }
            }
        }
        wx.navigateTo({
            url: "/pages/userSettings/userSettings?finalMsg=" + this.data.finalMsg + "&finalImage=" + this.data.finalImage
        })
    },
    selectCartType:function(event){//请求品牌车型
        var that = this;
        var cartId = event.currentTarget.dataset.cartid;
        this.showSelectCartTypeAnimation();
        wx.request({
            url: app.globalData.mmBase + "/app/car/getCartType.do",
            type: "POST",
            data: {
                'info': '{"cartId":"' + cartId + '"}'
            },
            success: function (res) {
                  that.setData({
                        selectCartType:res.data.list                      
                  })
            },
            fail: function (error) {
                  console.log(error)
            }
        });
    },
    showSelectCartTypeAnimation:function(){//选择城市动画弹出
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease',
        })
        this.animation = animation;
        this.animation.left(0).step();
        this.setData({
            selectCartTypeAnimation: this.animation.export()
        })
        wx.setNavigationBarTitle({//设置导航条文字
            title: '选择车型'
        })
    },
    hideSelectCartTypeAnimation:function(){//选择城市动画关闭
        var move_length = 100+'%';
        this.animation.left(move_length).step();
        this.setData({
            selectCartTypeAnimation: this.animation.export()
        })
        wx.setNavigationBarTitle({//设置导航条文字
            title: '选择品牌'
        })
    },
})