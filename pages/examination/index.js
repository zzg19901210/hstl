//施工套题列表

const app = getApp();

// const context_url = app.globalData.serverUrl + "/studyQuestionAction/getWorkQuestionList.json";

const context_url = app.globalData.serverUrl + "/app/service/appWorkInterface/workList.json";

//获取排行榜
const findUserRankingListUrl = app.globalData.serverUrl + "/app/service/appWorkInterface/findUserRankingListAll.json";


var cur_page = 1;
const page_size = 10;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    hidden: true,
    hideHeader: true,
    hideBottom: true,
    hideBottom_loading:false,
    allPages: '',    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    loadMoreData: '加载更多……',
    hidRanking:true,
    listRanking: [],
    MyRanking: {
      itemrownum: '暂无',
      head_portrait: '',
      nickname: '',
      correct_score: 0
    },
    list: [
    //   {
    //   title: '2018-3-12',
    //   titleDesc: '20:14',
    //   totalScore: '100',
    //   activityScore: '60',
    //   totalQuestion: '50',
    //   correctQurstion: '10'
    // },
    //  {
    //   title: '2018-3-15',
    //   titleDesc: '20:14',
    //   totalScore: '100',
    //   activityScore: '60',
    //   totalQuestion: '50',
    //   correctQurstion: '10'
    // }
    ]

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
    // var date = new Date();
    // this.setData({
    //   refreshTime: date.toLocaleTimeString(),
    //   hideHeader: false,
    //   currentPage: 1
    // });
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
        hideBottom_loading:'true'
      })
      return;
    }
    var tempCurrentPage = this.data.currentPage;
    tempCurrentPage = tempCurrentPage + 1;
    that.setData({
      currentPage: tempCurrentPage,
      hideBottom: false
    })
    loadContxt(this, cur_page);

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
  },
  ranking: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      hidRanking: false
    });
    findUserRankingList(this);
  }, 
  hidRanking: function (e) {
    this.setData({
      hidRanking: true
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c9ae8',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  showHome: function (e) {
    wx.switchTab({
      url: '/pages/home/home'
    })
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
    url: context_url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      limit: page_size,
      offset: page,
      departmentId: app.globalData.myUserInfo.departmentId
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
          allPages: page+2
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
     
    }
  });
}
//获取用户排行榜
var findUserRankingList = function (that) {
  wx.showLoading({
    title: '请稍等...'
  });
  wx.request({
    url: findUserRankingListUrl,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    // data: {
    //   workId: '2'
    // },
    success: function (res) {
      var tempDate = [];
      var MyRanking = that.data.MyRanking;
      var j = 1;
      for (var i = 0; i < res.data.rows.length; i++) {
        //处理排行信息
        var item = res.data.rows[i];
        //判断是否是自己的排行信息
        if (app.globalData.myGlobalUserId == res.data.rows[i].enter_user_id) {
          item['itemrownum'] = j;
          tempDate.push(item);
          j++;
          // MyRanking: {
          //   itemrownum: '无',
          //     head_portrait: app.globalData.myUserInfo.headPortrait,
          //       nickname: app.globalData.myUserInfo.nickname,
          //         correct_score: 0
          // }
          // that.setData({
          //   MyRanking:item
          // });
          MyRanking = item;
        } else {
          item['itemrownum'] = j;
          tempDate.push(item);
          j++;
        }

      }
      that.setData({
        MyRanking: MyRanking,
        listRanking: tempDate
      });
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取排行榜信息错误',
        showCancel: false
      });
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}