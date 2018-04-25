// pages/video_play/index.js

const app = getApp();

const setVodUrl = app.globalData.serverUrl + "/vodUserAction/set.json";

const getRecommenVod = app.globalData.serverUrl + "/vodInfoAction/getRecommendVod.json";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    nickname: '',
    vodId:'1',
    headPortrait:'',
    video_url:'',
    errorimges:'/images/head.jpg',
    vod_type:1,
    type:1,
    list: [
      // {
      // title: '鬼才许可贺岁片《狄仁杰之四大天王》',
      // aliImageUrl: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike80%2C5%2C5%2C80%2C26/sign=68521645b8fb43160e12722841cd2d46/ca1349540923dd540371d1e6db09b3de9c824839.jpg',
      // nickname: '徐克 、 电影'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options.dataObj);
    // var bean = decodeURIComponent(JSON.parse(options.dataObj));
    this.setData({

      title: options.title,
      video_url:options.video_url,
      nickname:options.nickname,
      vodId:options.vodId,
      headPortrait: options.headPortrait,
      vod_type: options.vod_type,
      type: options.ywType
    })
    setVod(this);
    load(this);
    wx.setNavigationBarTitle({
      title: options.title,
      success: function (res) {
        // success
      }
    });
  },errorFunction(e){
     this.setData({
       headPortrait:'/images/head.jpg'
     }) 
  }
})
//设置点播记录
var setVod = function (that) {
  wx.request({
    url: setVodUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      userId: app.globalData.myGlobalUserId,
      vodId: that.data.vodId,
      operationType:'1',
      source:'3'
    },
    success: function (res) {

    }
  });

};
//加载相关推荐信息
var load=function(that){
  wx.showLoading({
    title: '请稍等...',
  });
  wx.request({
    url: getRecommenVod,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data:{
      type: that.data.type,
      vodType: that.data.vod_type
    },
    success: function (res) {
      wx.hideLoading();
      //设置数据
      that.setData({
        list: res.data.list
      });
    }
  });
}


