

const app = getApp()

const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
Page({
  data:{
    src:'',
    recordStart:false
  },
  onLoad() {
    this.setData({
      myUserInfo: app.globalData.myUserInfo
    });
    this.ctx = wx.createCameraContext();
  },
  takePhoto() {
    var that=this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        // upload(that,res.tempImagePath)
        console.log(res.tempImagePath);
        that.setData({
          src: res.tempImagePath
        });
      }
    })
  }, startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})

var upload = function (that, path) {


  wx.showToast({
    icon: "loading",
    title: "正在上传"
  });

  wx.uploadFile({
    url: upload_url,
    filePath: path,
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
        src: data.data.list[0].uri
      });
      // saveTouxiang();
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