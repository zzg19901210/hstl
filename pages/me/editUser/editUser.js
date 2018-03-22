// pages/me/editUser/editUser.js

const app = getApp()

const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
const save_url = app.globalData.serverUrl + "/common/upload/saveUserInfo.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUserInfo: {},
    headPortrait: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      myUserInfo: app.globalData.myUserInfo,
      headPortrait: app.globalData.myUserInfo.headPortrait
    });

  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        upload(that, res.tempFilePaths);
      }
    })
  },
})
var upload = function (that, path) {


  wx.showToast({
    icon: "loading",
    title: "正在上传"
  });

  wx.uploadFile({
    url: upload_url,
    filePath: path[0],
    name: 'file',
    header: { "Content-Type": "multipart/form-data", 'Accept': 'application/json' },
    formData: {
      //和服务器约定的token, 一般也可以放在header中
      'session_token': wx.getStorageSync('session_token')
    },
    success: function (res) {
      console.log(res);
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
        return;
      }
      var data = JSON.parse(res.data);
      // console.log(that.data.tempFile);
      console.log(data.data.list[0].uri);
      that.setData({
        headPortrait: data.data.list[0].uri
      });
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '上传失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideToast();  //隐藏Toast
    }
  });

}

var saveTouxiang=function(that){
  wx.showLoading({
    icon: "loading",
    title: "正在保存..."
  });

  wx.request({
    url: save_url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      title: that.data.title,
      bodyDsec: that.data.context,
      picUrl: that.data.files.toString(),
      status: '1',
      workType: app.globalData.myGlobalUserId,
      userId: app.globalData.myGlobalUserId,
      departmentId: app.globalData.myUserInfo.departmentId
    },
    success: function (res) {
      // console.log(res);
      wx.navigateBack(1);

      wx.showModal({
        title: '提示',
        content: '添加成功',
        showCancel: false
      });
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '添加失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();  //隐藏Toast
    }
  });
}
