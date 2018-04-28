//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    
  },
  globalData: {
    userInfo: null,
    // serverUrl:"https://www.beijiangci.cn/hstl",
    serverUrl: "https://hhhtcz.isport.nm.cn",
    // serverUrl: "http://localhost:8080",
    myGlobalUserId: null,
    myUserInfo: null,
    wechar_user: { openid: '未获取上openid', session_key: '323232', unionid: '1232132' }

  }

})





