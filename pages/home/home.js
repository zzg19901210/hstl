const app = getApp();
Page({
  data: {
    movies: [
      { url: '/images/banner/a.jpg' },
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
        url: '/pages/study/index',
        icon: '/images/home_icon/zxdt.png'
      },
      {
        name: '成绩查看',
        url: '/pages/achievement/index?cjlx=1',
        icon: '/images/home_icon/zx.png'
      },
      {
        name: '施工考试',
        url: '/pages/examination/index',
        icon: '/images/home_icon/shigong.png'
      },
      {
        name: '施工成绩查看',
        url: '/pages/achievement/index?cjlx=2',
        icon: '/images/home_icon/sgcjcx.png'
      },
      {
        name: '我要直播',
        url: '/pages/live_list/index',
        icon: '/images/home_icon/zb.png'
      },
      {
        name: '答疑解惑',
        url: '/pages/disabuse/disabuse',
        icon: '/images/home_icon/dyjh.png'
      },
      {
        name: '专家信息',
        url: '/pages/specialist/specialist',
        icon: '/images/home_icon/zjjd.png'
      }
    ]

  }, onLoad: function () {
    var interval = setInterval(function () {
      wx.showLoading({
        title: '正在加载...',
      });
      if (app.globalData.myUserInfo == null) {
        
      } else {
        var routers = this.data.routers;
        if ("1" == app.globalData.myUserInfo.roleId){
          routers.push({
            name: '业务视频审录',
            url: '/pages/video_list/index?ywType=1&type=1',
            icon: '/images/home_icon/lz.png'
          });
          routers.push({
            name: '政治理论视频审录',
            url: '/pages/video_list/index?ywType=2&type=1',
            icon: '/images/home_icon/dzlz.png'
          });
          routers.push({
            name: '视频录制',
            url: '/pages/splz/index',
            icon: '/images/home_icon/lz.png'
          });
        } else if ("4" == app.globalData.myUserInfo.roleId){
          if ("1" == app.globalData.myUserInfo.userType){
            routers.push({
              name: '业务视频审录',
              url: '/pages/video_list/index?ywType=1&type=1',
              icon: '/images/home_icon/lz.png'
            });
          }else{
            routers.push({
              name: '政治理论视频审录',
              url: '/pages/video_list/index?ywType=2&type=1',
              icon: '/images/home_icon/dzlz.png'
            });
          }
        }
        this.setData({
          routers: routers
        });
        clearInterval(interval);
        wx.hideLoading();
      }
    }.bind(this), 1000);

  }
})
