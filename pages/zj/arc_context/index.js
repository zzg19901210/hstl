
const app = getApp();
const url = app.globalData.serverUrl + "/categoryInfoAction/getAllOrdinaryCat.json";
const learnUrl = app.globalData.serverUrl +"archivesUserAction/learn.json";
var WxParse = require('../../../plus/wxParse/wxParse.js');
Page({
  data: {
    aId:'0',
    article:''
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      title: options.arc_title
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
    

  
  }
})
//加载文章详情页面
var loadArch=function(that){
  wx.request({
    url: url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      aId:that.aId
    },
    success: function (res) {
      WxParse.wxParse('article', 'html', article, that, 5);

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

    }
  });
}
