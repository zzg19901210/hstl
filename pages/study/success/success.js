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
    var totalNums = parseInt(options.totalNums);
    var answerNum = parseInt(options.answerNums);

    if (answerNum > totalNums) {
      answerNum = totalNums;
    }
    var avgScore = parseInt(100 / totalNums);
    var correctScore = avgScore * answerNum;
    if (correctScore > 100) {
      correctScore = 100;
    }
    this.setData({
      answerNums: answerNum,
      totalNums: totalNums,
      costTime: options.costTime,
      correctScore: correctScore
    });
    wx.setNavigationBarTitle({
      title: '考试完成',
      success: function (res) {
        // success
      }
    });
  }
})