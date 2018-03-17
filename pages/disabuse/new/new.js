// pages/disabuse/new/new.js
const app = getApp();
const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
const save_url = app.globalData.serverUrl + "/save.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    title: '',
    context: '',
    tempFile: ''
  },
  titleinput(e) {
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      title: value
    })
  },
  contextinput(e) {
    console.log(e)
    let value = e.detail.value
    console.log(value)
    this.setData({
      context: value
    })
  },
  chooseImage: function (e) {
    var that = this;
    if (this.data.files.length == 9) {
      wx.showToast({
        title: '已经达到上传最大限度！',
        icon: 'nome',
        duration: 2000
      })
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片


        upload(that, res.tempFilePaths);
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  onSubmit: function (e) {

    wx.showToast({
      title: '提问成功',
      icon: 'success',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "创建疑惑信息",
      success: function (res) {
        // success
      }
    });
  }
})


var upload =function (that, path) {

  for (var i = 0; i < path.length; i++) {
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });
    that.setData({
      tempFile: path[i]
    });
    wx.uploadFile({
      url: upload_url,
      filePath: path[i],
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
        var data =  JSON.parse(res.data);
        // console.log(that.data.tempFile);
        console.log(data.data.list[0].uri);
        that.setData({
          files: that.data.files.concat(data.data.list[0].uri)
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
    })
  }

}

var saveSubmit=function (that){
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  });
  that.setData({
    tempFile: path[i]
  });
  wx.request({
    url: save_url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      title: that.data.title,
      context:that.data.context
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
        files: that.data.files.concat(data.data.list[0].uri)
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