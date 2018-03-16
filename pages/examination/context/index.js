// pages/examination/context/index.js

const app = getApp();
const sg_url = app.globalData.serverUrl + "/studyQuestionAction/getWorkQuestionInfo.json";
const zj_url = app.globalData.serverUrl + "/";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    examinationContext:{
      body: '<input type="radio" name="question5" value="0"> A、110 < input type=“hidden” name=“userId” value=“USERIDKEY“ > '
    },
    webUrl: app.globalData.serverUrl+'/login.html?id=3',
    userInfo: app.globalData.myUserInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "施工考试",
      success: function (res) {
        // success
      }
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    var article = '<div>我是HTML代码</div>';
    WxParse.wxParse('article', 'html','<input type="radio" name="question5" value="0"> A、110 < input type=“hidden” name=“userId” value=“USERIDKEY“ >', this, 5); 
  }

  
})

var loadContxt = function (that) {
  wx.request({
    url: sg_url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      id: 1
    },
    success: function (res) {
      that.setData({
        list: list
      });
      
    }
  });
}
