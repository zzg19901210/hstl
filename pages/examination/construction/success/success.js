// pages/study/success/success.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerNums:'10',
    totalNums:'20',
    costTime:'360',
    correctScore:50,
    nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var avgScore = 100 / options.totalNums;
    var correctScore = avgScore * options.answerNums;

    this.setData({
      answerNums: options.answerNums,
      totalNums: options.totalNums,
      costTime: options.costTime,
      correctScore: correctScore,
      nickname: app.globalData.myUserInfo.nickname
    })
    wx.setNavigationBarTitle({
      title: '考试完成',
      success: function (res) {
        // success
      }
    });
  }
})