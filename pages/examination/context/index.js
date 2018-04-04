// pages/examination/context/index.js
//获取职教考试和施工考试详情
const app = getApp();
const sg_url = app.globalData.serverUrl + "/web/question/question_work_model.html";
const zj_url = app.globalData.serverUrl + "/web/question/question_set_model.html";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    examinationContext:{
     
    },
    webUrl: zj_url,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var htmlUrl =sg_url;
    var title = "职教考试";
    if("1"==options.kslx){
      title ="职教考试"
      // htmlUrl = zj_url + "?departmentId=" + app.globalData.myUserInfo.departmentId + "&userId=" + app.globalData.myGlobalUserId + "&workType=" + app.globalData.myUserInfo.workType;
      htmlUrl = zj_url + "?departmentId=0&userId=" + app.globalData.myGlobalUserId + "&workType=0";
    }else{
      title ="施工考试"
      htmlUrl = sg_url + "?workId=" + options.wordId + "&userId=" + app.globalData.myGlobalUserId;
    }
    console.log(htmlUrl);
    this.setData({
      webUrl:htmlUrl
    });
    wx.setNavigationBarTitle({
      title: title,
      success: function (res) {
        // success
      }
    });

  }

  
})

var loadContxt = function (that) {

  wx.request({
    url: sg_url,
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
