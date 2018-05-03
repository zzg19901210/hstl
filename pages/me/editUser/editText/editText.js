// pages/me/editUser/editText/editText.js
const app = getApp()

// const editUserUrl = app.globalData.serverUrl + "/sysuserController/updateUserInfo.json";
const editUserUrl = app.globalData.serverUrl +"/app/service/appServiceInterface/editUserInfo.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editText:'',
    userId:'1',
    editType:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      editText: options.editText,
      userId: app.globalData.myGlobalUserId
    });
    if("1"==options.editType){
      wx.setNavigationBarTitle({
        title: "修改昵称",
        success: function (res) {
          // success
        }
      });
    }else{
      wx.setNavigationBarTitle({
        title: "修改昵称",
        success: function (res) {
          // success
        }
      });

    }
  
  },
  titleinput:function(e){
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
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method:'POST',
    data: submitData,
    success: function (res) {
      // console.log(res);
     
      wx.showModal({
        title: '提示',
        content: '修改成功',
        showCancel: false
      });
      app.globalData.myUserInfo.nickname = that.data.editText;
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
var getData=function(that){
  var data ={
    id:that.data.userId
  };
  if ("1"==that.editType){
    data['nickname']=that.data.editText
  }else{
    data['nickname'] = that.data.editText
  }
  return data;
  
}