//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code:"+res.code)
        var that=this;
        wx.request({
          url: this.globalData.serverUrl+'/app/wechartSns/login.json',
          header: {
            'context-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: {
            code:res.code
          },
          success: function (res) {
          
            // if("2"==res.data.msg){
            //   that.globalData.myGlobalUserId = 0;
            //   that.globalData.wechar_user=res.data.obj;
            //   wx.navigateTo({
            //     url: '../../pages/user/index'
            //   });
            // }else{
            //   that.globalData.myGlobalUserId = res.data.obj.id;
            // }
            
          },
          fail:function(res){
            wx.showToast({
              title: '获取用户失败啦',
              icon:'none'
            })
          }
        });

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    serverUrl:"https://www.beijiangci.cn/hstl",
    myGlobalUserId:null,
    wecharUser: { openid: '未获取上openid',session_key: '323232', unionid:'1232132'}

  }
 
})





