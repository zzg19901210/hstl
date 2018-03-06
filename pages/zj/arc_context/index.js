
const app = getApp();

const learnUrl = app.globalData.serverUrl +"/archivesUserAction/learn.json";
//获取单个
const arch_get = app.globalData.serverUrl + "/archivesInfoAction/getArticleById.json";
var WxParse = require('../../../plus/wxParse/wxParse.js');
Page({
  data: {
    aId:'0',
    article:''
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      title: options.arc_title,
      aId: options.aId
    })
    wx.setNavigationBarTitle({
      title: options.arc_title,
      success: function (res) {
        // success
      }
    });
    /**
     * html解析示例
     */
    loadArch(this);
    
  }
})
//加载文章详情页面
var loadArch=function(that){
  wx.showLoading({
    title: '加载中...',
  });

  wx.request({
    url: arch_get,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      id: that.data.aId,
    },
    success: function (res) {
      WxParse.wxParse('article', 'html', res.data.list[0].body, that, 5);
      // learnUser(that);
      wx.hideLoading();
    }
  });
}
//用户记录
var learnUser=function(that){
  wx.request({
    url: learnUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      aId: that.data.aId,
      operationType: '1',
      source: '3',
      userId: app.globalData.myGlobalUserId,
    },
    success: function (res) {
      wx.hideLoading();
    }
  });
}
