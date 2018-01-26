// pages/user/index.js
const app = getApp()
const sendCode = app.globalData.serverUrl + "/studyLiveInfoAction/getAllLiveInfo.json";
const bindUser = app.globalData.serverUrl + "/studyLiveInfoAction/getAllLiveInfo.json";
var validateUrl="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree:false,
    phoneCode: "获取验证码",
    telephone: "",
    codePhone: "",
    flag : false,
    codeDis: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },
  changeCode() {
    var _this = this
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none",
        duration:2000
      })
      // setTimeout(function () {
      //   wx.hideToast()
      // }, 2000)
      return
    }
    this.setData({
      codeDis: true
    })
    //发送短信验证码
    wx.request({
      url: sendCode,
      data: {
        phone: this.data.telephone
      },
      header: {
        'context-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        // let data = res.data
        if (false) {
          _this.setData({
            codeDis: false
          });
         
          setTimeout(function () {
            wx.hideToast()
          }, 2000);
        } else {
          _this.setData({
            phoneCode: 60
          })
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
    })

  },
  phoneinput(e) {
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
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  btnBindPhone:function(e){
    let telephone = this.data.telephone
    if (telephone.length != 11 || isNaN(telephone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: "none",
        duration: 2000
      })
      return
    }
    let codephone=this.data.codePhone;
    if (codephone.length != 6 || isNaN(codephone)) {
      wx.showToast({
        title: '请输入有效的验证码',
        icon: "none",
        duration: 2000
      })
      return
    }
    wx.request({
      url: bindUser,
      data: {
        phone: this.data.telephone
      },
      header: {
        'context-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if(true){
          wx.switchTab({
            url: '../home/home'
          })
        }else{
          wx.showToast({
            title: '绑定失败！没有该用户！',
            icon: "none",
            duration: 2000
          })
        }
      }
    });
  }

});

var validateUser=function(that){
 

}
