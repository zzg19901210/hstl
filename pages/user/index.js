// pages/user/index.js
const app = getApp()
const sendCode = app.globalData.serverUrl + "/smsManagerAction/sendRegisterSMSCode.json";
const bindUser = app.globalData.serverUrl + "/sysuserController/bindUserByPhone.json";
var validateUrl = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
    phoneCode: "获取验证码",
    telephone: "",
    codePhone: "",
    flag: false,
    codeDis: false,
    serverCode: "",
     userInfo:{
       
     }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }, changeCode() {
    //获取验证码
    var _this = this
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none",
        duration: 2000
      })
      // setTimeout(function () {
      //   wx.hideToast()
      // }, 2000)
      return
    }
    this.setData({
      codeDis: true
    })
    wx.showLoading({
      title: '正在发送...'
    });
    //发送短信验证码
    wx.request({
      url: sendCode,
      data: {
        mobile: this.data.telephone
      },
      header: {
        'context-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        // let data = res.data
        if (res.data.status=="0"){
          wx.showToast({
            title: '获取验证码失败，该手机不在系统中！',
            icon:'none'
          })
        }else{
          if (false) {
            _this.setData({
              codeDis: false
            });

            setTimeout(function () {
              wx.hideToast()
            }, 2000);
          } else {
            _this.setData({
              phoneCode: 60,
              serverCode: res.data.data.code
            })
            console.log(res.data.data.code);
            let time = setInterval(() => {
              let phoneCode = _this.data.phoneCode
              phoneCode--
              _this.setData({
                phoneCode: phoneCode
              })
              if (phoneCode == 0) {
                clearInterval(time)
                _this.setData({
                  phoneCode: "获取验证码",
                  flag: true
                })
              }
            }, 1000)
          }
        }
        
      },complete:function(e){
        wx.hideLoading();
      }
    })

  },
  phoneinput(e) {
    //手机输入
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      telephone: value
    })
  },
  codeinput(e) {
    let value = e.detail.value
    console.log(value)
    this.setData({
      codePhone: value
    })
  },
  bindAgreeChange: function (e) {
    //绑定同意条款
    this.setData({
      isAgree: !!e.detail.value.length
    });
    
  },
  btnBindPhone: function (e) {
    
    //保存绑定手机信息
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none",
        duration: 2000
      })
      return
    }
    let codephone = this.data.codePhone;
    if (codephone.length != 6 || isNaN(codephone)) {
      wx.showToast({
        title: '请输入有效的验证码',
        icon: "none",
        duration: 2000
      })
      return
    }
    if (codephone != this.data.serverCode){
      wx.showToast({
        title: '请输入正确的验证码',
        icon: "none",
        duration: 2000
      })
      return
    }
   
    console.log(app.globalData.wechar_user.openid);
    wx.showLoading({
      title: '请稍等...'
    });

    wx.request({
      url: bindUser,
      data: {
        phoneNo: this.data.telephone,
        code: this.data.codePhone,
        headPortrait: this.data.userInfo.avatarUrl,
        nickname: this.data.userInfo.nickName,
        type: '2',
        weixinProjectId: app.globalData.wechar_user.openid
      },
      header: {
        'context-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {

        if ("1"==res.data.status) {
          app.globalData.myGlobalUserId = res.data.data.obj.id;
          app.globalData.myUserInfo = res.data.data.obj;
          wx.switchTab({
            url: '../home/home'
          })
        } else {
          wx.showToast({
            title: '绑定失败！没有该用户！',
            icon: "none",
            duration: 2000
          })
        }
      },
      complete:function(){
        wx.hideLoading();
      }
    });
  }

});

var validateUser = function (that) {


}
