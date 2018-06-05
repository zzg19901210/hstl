
const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    isFirst:false,
    showBtn:false,
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524899106672&di=ecfd188287bf667432e836244846fad9&imgtype=0&src=http%3A%2F%2Fs14.sinaimg.cn%2Fmw690%2F0062UP1Agy6RnYQ5P7n6d%26690',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2593790037,317444479&fm=27&gp=0.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524899128888&di=94fa170511385b2054183a23fd5798b5&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D165156386%2C81509996%26fm%3D214%26gp%3D0.jpg'
      ]
  },
  onLoad(options){
    wx.setNavigationBarTitle({
      title: '欢迎使用'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c9ae8',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    var that_this=this;
  
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log("code:"+res.code)
        var that = app;
        console.log(that_this.data.isFirst);
        if (!that_this.data.isFirst){
          wx.request({
            url: app.globalData.serverUrl + '/app/wechartSns/login.json',
            header: {
              'context-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: {
              code: res.code
            },
            success: function (data) {
             
              // console.log(data.data.data.obj);
              if ("2" == data.data.msg) {
                app.globalData.myGlobalUserId = 0;
                console.log(data.data.data.obj);
                app.globalData.wechar_user = data.data.data.obj;
                // wx.redirectTo({
                //   url: '../../pages/user/index',
                // });
                // wx.redirectTo({
                //   url: '../../pages/user/opendata/opendata',
                // });
                that_this.setData({
                  showBtn: true
                });
                getuserInfo();
              } else {
                app.globalData.myGlobalUserId = data.data.data.obj.id;
                app.globalData.myUserInfo = data.data.data.obj;
                // that_this.setData({
                //   isFirst: true
                // });
                wx.switchTab({
                  url: '/pages/home/home',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  },
                  fail: function (e) {
                    console.log(e);
                  }
                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '获取用户失败啦',
                icon: 'none'
              });
              // wx.redirectTo({
              //   url: '../../pages/user/index',
              // });
            }
          });
        }
        

      }
    })
   
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           app.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (app.userInfoReadyCallback) {
    //             app.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // });
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (null != e.detail.userInfo && "undefined" != e.detail.userInfo ){
      app.globalData.userInfo = e.detail.userInfo;
      wx.redirectTo({
        url: '../../pages/user/index'
      });
    }
  }
});

var getuserInfo=function(){
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: function (res) {
            // console(res.userInfo)
            app.globalData.userInfo = res.userInfo
            wx.redirectTo({
              url: '../../pages/user/index'
            });
          }
        })
      }
    }
  })
}