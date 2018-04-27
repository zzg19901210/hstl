// pages/me/bindUser/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechar_url:'https://vote.lrkpzx.com/codetoany/getcode.php?auk=hstl&scope=snsapi_base&userId=2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var url = "https://vote.lrkpzx.com/codetoany/getcode.php?auk=hstl&scope=snsapi_base&userId=" + app.globalData.myGlobalUserId;
    this.setData({
      wechar_url:url
    });
  }
})