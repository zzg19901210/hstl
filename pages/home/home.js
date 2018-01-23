Page({
  data: {
    movies: [
      { url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'},
      { url: 'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg' },
      { url: 'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg' },
      { url: 'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg' }
    ],
    imageWidth: wx.getSystemInfoSync().windowWidth,
    routers: [
      {
        name: '视频录制',
        url: '',
        icon: '/images/home_icon/lz.png'
      },
      {
        name: '党政学习',
        url: '',
        icon: '/images/home_icon/dz.png'
      },
      {
        name: '业务学习',
        url: '',
        icon: '/images/home_icon/zj.png'
      },
      {
        name: '成绩查看',
        url: '',
        icon: '/images/home_icon/zx.png'
      },
      {
        name: '在线考试',
        url: '',
        icon: '/images/home_icon/zxdt.png'
      },
      {
        name: '我要直播',
        url: '',
        icon: '/images/home_icon/zb.png'
      }
    ]


  }, onLoad: function (){
    // wx.request({
    //   url: 'https://test.nmtc.com.cn/cmsServerAction/allCat.json', //仅为示例，并非真实的接口地址
    //   data: {
    //     x: '',
    //     y: ''
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // });
  }
})