// pages/study/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerNums:'10',
    totalNums:'20',
    costTime:'360',
    correctScore:50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var avgScore = 100 / options.totalNums;
    var correctScore = avgScore * options.answerNums;

    that.data({
      answerNums: options.answerNums,
      totalNums: options.totalNums,
      costTime: options.costTime,
      correctScore: correctScore
    })
    wx.setNavigationBarTitle({
      title: '考试完成',
      success: function (res) {
        // success
      }
    });
  }
})