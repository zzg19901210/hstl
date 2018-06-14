// pages/examination/kk/kk.js

const app = getApp()
var WxParse = require('../../../plus/wxParse/wxParse.js');

const work_url = app.globalData.serverUrl + "/app/service/appWorkInterface/getWord.json";

//获取排行榜
const findUserRankingListUrl = app.globalData.serverUrl + "/app/service/appWorkInterface/findUserRankingList.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work:{

    },
    workSetId:'70',
    hidStart:true,
    hidRanking:true
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
  },ranking: function (e) {
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
  },startKs:function(e){
    wx.showLoading({
      title: '正在跳转..',
    })
    wx.navigateTo({
      url: '../construction/index?workSetId=' + this.data.workSetId + '&title=' + this.data.work.questionTitle + '&timer=' + this.data.work.timer
    })
    wx.hideLoading();
  }, hidRanking: function (e) {
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
        
        if ("1"==res.data.data.obj.questionType){
          WxParse.wxParse('article', 'html', res.data.data.obj.questionIntroduction, that, 5);
        }
        that.setData({
          work: res.data.data.obj,
          hidStart: false
        });       
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
    data: {
      workId: that.data.workSetId
    },
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