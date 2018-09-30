// pages/achievement/context/context.js
const app = getApp();
const sg_context_url = app.globalData.serverUrl + "/app/service/appWorkInterface/findAchievementListSg.json";
const zj_context_url = app.globalData.serverUrl + "/app/service/appWorkInterface/findAchievementListZj.json";

const zsjs_context_url = app.globalData.serverUrl + "/app/service/customs/getAchievementListByDetails.json";
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
    achievementId:1,
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
        achievementId: setId,
        'type':1
      });
      tilte="职教考试-答题情况";
    } else if ("3" == options.type) {
      this.setData({
        requestUrl: zsjs_context_url,
        logSetId: setId,
        workSetsId: setId,
        achievementId: setId,
        'type': 3
      });
      tilte = "知识竞赛-答题情况";
    }else{
      this.setData({
        requestUrl: sg_context_url,
        logSetId: setId,
        workSetsId: setId,
        'type': 2,
        achievementId: setId
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
      workLogsId: that.data.workSetsId,
      achievementId: that.data.achievementId
    },
    success: function (res) {
      console.info(that.data.list);
      if (res.data.rows.length === 0) {
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        });
      }else{
        var list=[];
        for (var i = 0; i < res.data.rows.length; i++) {
          var tmpdata = res.data.rows[i];
          var selects=[];
          if(that.data.type=="2"){
            selects = tmpdata.userSelect.split(",");
          } else if (that.data.type == "3") {
            selects = tmpdata.chooseAnswer.split(",");
          } else  {
            selects = tmpdata.correctAnswer.split(",");
          }
          tmpdata.selects = selects;
          list.push(tmpdata);
        }

        that.setData({
          list: list
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