// pages/achievement/context/context.js
const app = getApp();
const sg_context_url = app.globalData.serverUrl + "/app/service/appWorkInterface/findAchievementListSg.json";
const zj_context_url = app.globalData.serverUrl + "/app/service/appWorkInterface/findAchievementListZj.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1',
    list: [
     
    ],
    logSetId: 1,
    workSetsId:1,
    requestUrl: zj_context_url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var setId = options.setId;
    // var setId='3';
    var tilte='答题情况';
    if("1"==options.type){
      this.setData({
        requestUrl: zj_context_url,
        logSetId: setId,
        workSetsId: setId,
        'type':1
      });
      tilte="职教考试-答题情况";
    }else{
      this.setData({
        requestUrl: sg_context_url,
        logSetId: setId,
        workSetsId: setId,
        'type': 2
      });
      tilte = "施工考试-答题情况";
    }
    wx.setNavigationBarTitle({
      title: tilte,
      success: function (res) {
        // success
      }
    });
    loadContxt(this);
  }
})

var loadContxt = function (that) {
  wx.showLoading({
    title: '正在加载...',
  })
  wx.request({
    url: that.data.requestUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      setLogId: that.data.logSetId,
      workLogsId: that.data.workSetsId
    },
    success: function (res) {
      console.info(that.data.list);
      if (res.data.rows.length === 0) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        });
      }else{
        that.setData({
          list: res.data.rows
        });
      }
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '加载失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}