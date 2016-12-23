var md5 = require('../../utils/md5.js');
var app = getApp()
Page({
  data:{
    inputValue:"",
    flag:false,
    tel:'',
    password: '',
    encrypt_password: '',
    defaultMsg:"登录",
    uid:""
  },
   onLoad: function () {
   },
   formSubmit: function(e) {
      var that = this;
      var tel = e.detail.value.tel;
      var password = e.detail.value.password;
      var encrypt_password = md5.hex_md5(password);//密码MD5加密
      this.setData({
          encrypt_password:encrypt_password
      });
      var code = e.detail.value.code;
      this.checkPhone(tel);
      if(!this.data.flag){
            if(!password){
                this.showWarning("提示","密码不能为空");
                return;
            }else{ 
                wx.request({
                    url: app.globalData.mmBase + "/app/user/getLogin.do",
                    type:"POST",
                    data: {
                    'info': '{"telephone":"' + tel + '","password":"' + that.data.encrypt_password + '"}'
                    },
                    success: function (res) {
                        if(res.data.errCode == -1){
                            that.showWarning("提示",res.data.msg);
                        }else if(res.data.errCode == 0){
                            that.setData({
                                uid:res.data.uId
                            });
                            var id = that.data.uid;
                            try {
                                wx.setStorageSync('uid',id) //设置本地缓存验证是否登录
                            } catch (e) {  
                                console.log(e); 
                            };
                            wx.navigateTo({
                                url: '/pages/index/index?uid=' + that.data.uid,
                                success: function(res){
                                    // success
                                }
                            })
                        }
                    },
                    fail:function(error){
                        console.log(error)
                    }
            });
            }
      }else{
            if(!code){
                    this.showWarning("提示","验证码错误");
                    return;
            }else{//注册请求
                wx.request({
                        url: app.globalData.mmBase + "/app/user/updateRegister.do",
                        type:"POST",
                        data: {
                        'info': '{"telephone":"' + tel + '","password":"' + this.data.encrypt_password + '","registerCode":"'+ code +'"}'
                        },
                        success: function (res) {
                            if(res.data.errCode == -1){
                                that.showWarning("提示",res.data.msg);
                                
                            }else if(res.data.errCode == 0){//注册成功
                                that.showWarning("提示",res.data.msg +",请登录");
                                if(res.data.isnormal == 0){
                                    this.closeTap();//返回登录界面
                                    this.setData({
                                        uid:res.data.uId
                                    })
                                }
                            }
                        },
                        fail:function(error){
                            console.log(error)
                        }
                });
            }
      }


  },
  listenerPhoneInput: function(e) {//监听电话号码，并得到电话号码
      this.setData({
           tel : e.detail.value
      })
  },
  getRegisterCode:function(e){//获取验证码
      var that = this;
      var tel_num = this.data.tel;
      if( (/^1(3|4|5|7|8)\d{9}$/.test(tel_num)) ){
            wx.request({
                url: app.globalData.mmBase + "/app/user/getRegisterCode.do",
                type:"POST",
                data: {
                    'info': '{"telephone":"' + tel_num  +'"}'
                },
                success: function (res) {
                    if(res.data.errCode == -1){ 
                        that.showWarning("提示",res.data.msg);
                    }else if(res.data.errCode == 0){   
                        that.showWarning("提示",res.data.msg);
                    }
                },
                fail:function(error){
                    console.log(error)
                }
            });
      }else{
          that.showWarning("提示","手机号码有误，请重填");
      }
      
  },
  registerTap:function(){//点击注册按钮
      this.setData({
          flag:true,
          defaultMsg:"注册"
      })
  },
  closeTap:function(){//点击关闭按钮
      this.setData({
          flag:false,
          defaultMsg:"登录"
      })
  },
  showWarning:function(msg,content){//提示框
      wx.showModal({
          title: msg,
          content: content
        });
        return;
  },
  checkPhone:function (tel_num){ //验证手机号码是否正确
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel_num))){  
        wx.showModal({
          title: '提示',
          content: '手机号码有误，请重填',
          success: function(res) {
            if (res.confirm) {
                
            }
          }
        });
        return;
    } 
}
})