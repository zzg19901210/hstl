// pages/examination/kk/kk.js

const app = getApp()
var WxParse = require('../../../plus/wxParse/wxParse.js');

const work_url = app.globalData.serverUrl + "/app/service/appWorkInterface/getWord.json";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    work:{

    },
    workSetId:'70',
    hidStart:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workSetId: options.workSetId,
    });
    wx.setNavigationBarTitle({
      title: options.title,
      // title: '啦啦啦',
      success: function (res) {
        // success
      }
    });
    getWork(this);
  },startKs:function(e){
    wx.showLoading({
      title: '正在跳转..',
    })
    wx.navigateTo({
      url: '../construction/index?workSetId=' + this.data.workSetId + '&title=' + this.data.work.questionTitle + '&timer=' + this.data.work.timer
    })
    wx.hideLoading();
  }
})

var getWork = function (that) {
  wx.showLoading({
    title: '正在获取...'
  })
  wx.request({
    url: work_url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      workSetId: that.data.workSetId
    },
    success: function (res) {
      //console.info(that.data.list);
      if (res.data.status == "0") {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        });
      } else {
        that.setData({
          work: res.data.data.obj
        });
        if ("1"==res.data.data.obj.questionType){
          WxParse.wxParse('article', 'html', res.data.data.obj.questionIntroduction, that, 5);
        }       
      }
      wx.hideLoading();
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取信息失败',
        showCancel: false
      })
      wx.hideLoading();
    },
    complete: function () {

    }
  });
}