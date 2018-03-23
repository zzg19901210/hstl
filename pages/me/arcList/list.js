// pages/me/arcList/list.js
//获取用户文章浏览信息
const app = getApp();
const url = app.globalData.serverUrl + "/archivesUserAction/getLearnByUserId.json";
const page_size = 10;
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    hidden: true,
    hideHeader: true,
    hideBottom: true,
    hideBottom_loading: false,
    allPages: '',    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '加载更多……',
    list: [

    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '我的资料浏览记录',
      success: function (res) {
        // success
      }
    });


  },
  onShow: function (e) {
    loadContxt(this);
  },
  onPullDownRefresh: function () {

    var date = new Date();
    this.setData({
      refreshTime: date.toLocaleTimeString(),
      hideHeader: false,
      currentPage: 1
    })
    loadContxt(this);
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    if (that.data.currentPage == that.data.allPages) {
      that.setData({
        loadMoreData: '已经到顶',
        hideBottom_loading: 'true'
      })
      return;
    }
    var tempCurrentPage = this.data.currentPage;
    tempCurrentPage = tempCurrentPage + 1;
    that.setData({
      currentPage: tempCurrentPage,
      hideBottom: false
    })
    loadContxt(this);

  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    var date = new Date();
    this.setData({
      scrollTop: 0,
      refreshTime: date.toLocaleTimeString(),
      hideHeader: false,
      currentPage: 1
    })
    loadContxt(this);
    console.log("上拉刷新");
  },
  errorFunction: function (event) {
    console.log("进入小程序详情页");
  }
})

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

var loadContxt = function (that) {
  loadding(that);

  var page = that.data.currentPage;
  wx.request({
    url: url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      limit: page_size,
      offset: page,
      // userId: app.globalData.myGlobalUserId
    },
    success: function (res) {
      //console.info(that.data.list);
      var list = null;
      if (page === 1) {
        list = []
        that.setData({
          list: res.data.rows,
          hideHeader: true
        });
        stopLoding(that);
      } else {
        list = that.data.list
        for (var i = 0; i < res.data.rows.length; i++) {
          list.push(res.data.rows[i]);
        }
        that.setData({
          list: list,
          hideBottom: true,
          allPages: page + 2
        });
        if (res.data.rows.length === 0) {
          stopLoding(that);
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          });
          console.log("没有更多数据了");
          that.setData({
            allPages: page
          });
        }
        stopLoding(that);
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
      stopLoding(that); //隐藏Toast
    }
  });
}