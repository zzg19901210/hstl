

const app = getApp()
var total_micro_second = 36 * 60 * 60 * 1000;
const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
Page({
  data: {
    src: 'https://t12.baidu.com/it/u=177559061,2124184426&fm=173&app=12&f=JPEG?w=640&h=480&s=65703BC20FD238DC00FC918203005092',
    clock: date_format(total_micro_second),
    hidStart:false,
    radioItems: [
      { name: 'A:110', value: '0' },
      { name: 'B:110', value: '1', checked: true },
      { name: 'C:120', value: '2' },
      { name: 'D:120', value: '3' },
    ],
  },
  onLoad() {
    this.setData({
      myUserInfo: app.globalData.myUserInfo
    });
    this.ctx = wx.createCameraContext();
    
  },
  startKs(){
    this.setData({
      hidStart:true
    });
    count_down(this)
    takePhoto(this);
  },
  error(e) {
    console.log(e.detail)
  },
  next(e){
    
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
})


var takePhoto=function(that) {
  that.ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      // upload(that,res.tempImagePath)
      console.log(res.tempImagePath);
      that.setData({
        src: res.tempImagePath
      });
    }
  })
}

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




/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + ":" + min + ":" + sec + " " + micro_sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
