Page({
  data: {
    movies: [
      { url: '/images/banner/a.jpg'},
      { url: '/images/banner/b.jpg' },
      { url: '/images/banner/c.jpg' },
      { url: '/images/banner/e.jpg' },
      { url: '/images/banner/d.jpg' }
    ],
    imageWidth: wx.getSystemInfoSync().windowWidth,
    routers: [
      // {
      //   name: '视频录制',
      //   url: '/pages/splz/index',
      //   icon: '/images/home_icon/lz.png'
      // },
      {
        name: '政治理论视频学习',
        url: '/pages/video_list/index?ywType=2&type=2',
        icon: '/images/home_icon/dz.png'
      },
      {
        name: '业务视频学习',
        url: '/pages/video_list/index?ywType=1&type=2',
        icon: '/images/home_icon/zj.png'
      },
      {
        name: '在线考试',
        url: '',
        icon: '/images/home_icon/zxdt.png'
      },
      {
        name: '成绩查看',
        url: '',
        icon: '/images/home_icon/zx.png'
      },
      {
        name: '施工考试',
        url: '',
        icon: '/images/home_icon/zxdt.png'
      },
      {
        name: '施工成绩查看',
        url: '',
        icon: '/images/home_icon/zx.png'
      },
      {
        name: '我要直播',
        url: '/pages/live_list/index',
        icon: '/images/home_icon/zb.png'
      },
      {
        name: '业务视频审录',
        url: '/pages/video_list/index?ywType=1&type=1',
        icon: '/images/home_icon/zb.png'
      },
      {
        name: '政治理论视频审录',
        url: '/pages/video_list/index?ywType=2&type=1',
        icon: '/images/home_icon/zb.png'
      }
    ]

  }, onLoad: function (){
    
  }
})               