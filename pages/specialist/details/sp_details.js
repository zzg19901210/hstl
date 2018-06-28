// pages/specialist/details/sp_details.js
const app = getApp();
const getSpecialistUrl = app.globalData.serverUrl + "/app/service/appServiceInterface/queryUserById.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUserInfo:{},
    gainHonors:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "专家详细信息",
      success: function (res) {
        // success
      }
    });
    
    loadUserInfo(this,options.userId);
  },onShareAppMessage:function(e){
    return {
      title: '专家详细信息',
      desc: '',
      path: '/pages/specialist/details/sp_details?userId=' + this.data.myUserInfo.id
    }

  }
});

var loadUserInfo = function (that, userId){
  wx.showLoading({
    title: "正在加载...",
  })
  wx.request({
    url: getSpecialistUrl,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      userId:userId
    },
    success: function (res) {
      wx.hideLoading();
      if(res.data.status=="0"){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        });
      }else{
        var gainHonors = res.data.data.obj.gainHonor.split(",");
        that.setData({
          myUserInfo: res.data.data.obj,
          gainHonors: gainHonors
        });
      }
      

    },complete:function(){
      wx.hideLoading();
    }
  });
}

