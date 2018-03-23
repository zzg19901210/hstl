// pages/me/editUser/editText/editText.js
const app = getApp()

const editUserUrl = app.globalData.serverUrl + "/app/service/appServiceInterface/editUserInfo.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      editText: options.editText
    });
  
      wx.setNavigationBarTitle({
        title: "修改个人介绍",
        success: function (res) {
          // success
        }
      });
    
  },
  titleinput: function (e) {
    let value = e.detail.value
    console.log(value)
    this.setData({
      editText: value
    })
  },
  onSubmit: function (e) {
    saveSubmit(this);

  },

})
//保存信息
var saveSubmit = function (that) {
  wx.showLoading({
    icon: "loading",
    title: "正在提交..."
  });

  var submitData = getData(that);
  wx.request({
    url: editUserUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: submitData,
    success: function (res) {
      // console.log(res);
      app.globalData.myUserInfo.userDesc = that.data.editText;
    
      wx.showModal({
        title: '提示',
        content: '修改成功',
        showCancel: false
      });
      wx.navigateBack(1);
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '修改失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();  //隐藏Toast
    }
  });

}
var getData = function (that) {
  var data = {
    id: app.globalData.myGlobalUserId
  };
  if ("1" == that.editType) {
    data['userDesc'] = that.data.editText
  } else {
    data['userDesc'] = that.data.editText
  }
  return data;

}