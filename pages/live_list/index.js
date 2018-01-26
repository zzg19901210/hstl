// pages/live_list/index.js
const app = getApp();
const url = app.globalData.serverUrl + "/studyLiveInfoAction/getAllLiveInfo.json";
var page_size=8;
var page=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loadLive(this);
  }
});
var loadLive=function(that){
  loadding(that);
  wx.request({
    url: url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      limit: page_size,
      offset: page
    },
    success: function (res) {
      //console.info(that.data.list);
      var list = that.data.list;
      
      console.log("当前页码为:" + page);
      if (page === 1) {
        list = []
      } else {
        list = that.data.list
      }
      if (res.data.rows.length === 0) {
        stopLoding(that);
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        });
        console.log("没有更多数据了");

      } else {
        for (var i = 0; i < res.data.rows.length; i++) {
          list.push(res.data.rows[i]);
        }
       
        that.setData({
          list: list
        });
        // console.log("存储后的当前页码为:" + that.data.cat_list[that.data.currentTab].page);
        stopLoding(that);
      }

    }
  });
};

var stopLoding = function (that) {
  that.setData({
    hidden: true
  });
  wx.hideNavigationBarLoading() //完成停止加载
  wx.stopPullDownRefresh() //停止下拉刷新
}

var loadding = function (that) {
  wx.showNavigationBarLoading() //在标题栏中显示加载
  that.setData({
    hidden: false
  });
}