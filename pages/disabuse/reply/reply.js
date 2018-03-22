// pages/disabuse/reply/reply.js

const app = getApp();
const disabuseInfoUrl = app.globalData.serverUrl + "/studyDisabuseInfoAction/disabuseInfo.json";
const disabuseReplyListUrl = app.globalData.serverUrl + "/studyDisabuseInfoAction/disabuseReplyList.json";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabuseId: 1,
    disabuseInfo: {

    },
    userList: [{
      // nickname: '张三',
      // headProt: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3993375852,282817372&fm=11&gp=0.jpg',
      // context: '我们有时设置一个对象盒子时候避免对象没有内容时候不能撑开，但内容多少不能确定所以又不能固定高度，这个时候我们就会需要css来设置min-height最小高度撑高对象盒子。当内容少时候最小高度能将内容显示出，如果内容多余最小高度能装下时候，对象也会再随内容增多而增高。',
      // picUrl: ['http://img1.imgtn.bdimg.com/it/u=3594169831,4167680482&fm=27&gp=0.jpg', 'http://img1.ph.126.net/MSl2suFUW5LoQ9svzZxeEQ==/6597136836867473083.jpg', 'http://imgsrc.baidu.com/image/c0%3Dshijue1%2C0%2C0%2C294%2C40/sign=ec2066cd5d2c11dfcadcb7600b4e08a5/a8ec8a13632762d079fa0591aaec08fa503dc6dc.jpg','http://img0.ph.126.net/MZYgy-cIPpokPNOdJiOHWQ==/6597755861912590989.jpg']
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      disabuseId: options.disabuseId
    });
    getDisabuseInfo(this);
    wx.setNavigationBarTitle({
      title: "答疑详情",
      success: function (res) {
        // success
      }
    });
  },
  onAdd: function (event) {
    wx.navigateTo({
      url: '/pages/disabuse/replyNew/new?disabuseId=' + this.data.disabuseId + '&title=' + this.data.disabuseInfo.title
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.disabuseInfo.pic // 需要预览的图片http链接列表
    })
  }


});
//获取详细信息
var getDisabuseInfo = function (that) {
  wx.showLoading({
    icon: "loading",
    title: "请稍等..."
  });

  wx.request({
    url: disabuseInfoUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      id: that.data.disabuseId,
    },
    success: function (res) {
      console.log(res.data);
      var obj = res.data.data.obj;
      that.setData({
        disabuseInfo: obj
      });
    },
    fail: function (e) {

    },
    complete: function () {
      wx.hideLoading();  //隐藏Toast
      getReplyList(that);
    }
  });

}

var getReplyList = function (that) {
  wx.showLoading({
    icon: "loading",
    title: "请稍等..."
  });

  wx.request({
    url: disabuseReplyListUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      disabuseId: that.data.disabuseId,
    },
    success: function (res) {
      if (res.data.rows.length < 1) {

      }
      that.setData({
        userList: res.data.rows
      });
    },
    fail: function (e) {

    },
    complete: function () {
      wx.hideLoading();  //隐藏Toast
    }
  });
}

function getDateDiff(dateTimeStamp) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = "" + parseInt(monthC / 12) + "年前";
    }
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }

  return result;
};