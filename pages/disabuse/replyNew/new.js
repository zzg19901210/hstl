// pages/disabuse/new/new.js
const app = getApp();
const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
const save_url = app.globalData.serverUrl + "/studyDisabuseInfoAction/answerDisabuseInfo.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '我是标题',
    context: '',
    disabuseId:'5'
  },
  contextinput(e) {
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      context: value
    })
  },
  onSubmit: function (e) {
    saveSubmit(this);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      disabuseId: options.disabuseId
    })
   
    wx.setNavigationBarTitle({
      title: "回复信息",
      success: function (res) {
        // success
      }
    });
  }
})

//保存信息
var saveSubmit = function (that) {
  wx.showLoading({
    icon: "loading",
    title: "正在提交..."
  });

  //验证表单
  if (yezheng(that)) {
    wx.hideLoading();
    return;
  }
  wx.request({
    url: save_url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method:'POST',
    data: {
      disabuseId: that.data.disabuseId,
      context: that.data.context,
      status: '2',
      userId: app.globalData.myGlobalUserId,
      departmentId: app.globalData.myUserInfo.departmentId
    },
    success: function (res) {
      // console.log(res);
      if ("200" == res.statusCode){
        wx.navigateBack(1);

        wx.showModal({
          title: '提示',
          content: '回复成功',
          showCancel: false
        });
      }
      wx.showModal({
        title: '提示',
        content: '回复失败:错误代码 ' + res.statusCode,
        showCancel: false
      })
      return ;
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '回复失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();  //隐藏Toast
    }
  });

}
var yezheng = function (that) {
 
  if (that.data.context.length < 1) {
    wx.showToast({
      title: '请输入问题描述',
      duration: 1000,
      icon: 'none'
    });
    return true;
  }
  
  return false;
}
