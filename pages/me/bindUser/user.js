// pages/me/bindUser/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechar_url:'http://vote.lrkpzx.com/codetoany/getcode.php?auk=hstlTest&scope=snsapi_base&userId=2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var url = "http://vote.lrkpzx.com/codetoany/getcode.php?auk=hstlTest&scope=snsapi_base&userId=" + this.globalData.myGlobalUserId;
    this.setData({
      wechar_url:url
    });
  }
})