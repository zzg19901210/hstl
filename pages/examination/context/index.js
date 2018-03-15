// pages/examination/context/index.js

const app = getApp();
const context_url = app.globalData.serverUrl + "/archivesInfoAction/getArchivesByCatId.json";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    examinationContext:{
      body: '<input type="radio" name="question5" value="0"> A、110 < input type=“hidden” name=“userId” value=“USERIDKEY“ > '
    },
    userInfo: app.globalData.userInfo
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
  }

  
})

var loadContxt = function (that) {
  wx.request({
    url: context_url,
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
