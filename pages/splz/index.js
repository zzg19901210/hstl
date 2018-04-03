

const app = getApp()

const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
Page({
  data:{
    src:'https://t12.baidu.com/it/u=177559061,2124184426&fm=173&app=12&f=JPEG?w=640&h=480&s=65703BC20FD238DC00FC918203005092'
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