// pages/video_play/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '腾讯大学-啦啦啦',
    nickname: '高圆圆',
    video_url:'',
    list: [{
      title: '鬼才许可贺岁片《狄仁杰之四大天王》',
      ali_picurl: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=68521645b8fb43160e12722841cd2d46/ca1349540923dd540371d1e6db09b3de9c824839.jpg',
      desc: '徐克 、 电影'
    }, {
      title: '鬼才许可贺岁片《狄仁杰之四大天王》',
      ali_picurl: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=68521645b8fb43160e12722841cd2d46/ca1349540923dd540371d1e6db09b3de9c824839.jpg',
      desc: '徐克 、 电影'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      title: options.title,
      video_url:options.video_url
    })
    wx.setNavigationBarTitle({
      title: options.title,
      success: function (res) {
        // success
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})