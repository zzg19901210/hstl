// pages/examination/construction/index.js


const app = getApp()
var WxParse = require('../../../plus/wxParse/wxParse.js');
var total_micro_second = 36 * 60 * 60 * 1000;
// 获取上传文件路径
const upload_url = app.globalData.serverUrl + "/common/upload/up.json";

//获取套题信息
const work_url = app.globalData.serverUrl + "/app/service/appWorkInterface/getWord.json";
//获取问题列表
const question_url = app.globalData.serverUrl + "/app/service/appWorkInterface/getQuestions.json";
//做题日志
const submitQuestionLogsUrl = app.globalData.serverUrl + "/app/service/appWorkInterface/submitQuestionLogs.json";
// 成绩提交
const submitAchievement = app.globalData.serverUrl + "/app/service/appWorkInterface/submitAchievement.json";
//获取排行榜
const findUserRankingListUrl = app.globalData.serverUrl + "/app/service/appWorkInterface/findUserRankingList.json";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: date_format(total_micro_second),
    list: [],
    workSetId:0,
    listRanking: [],
    index: 0,
    checkedValue: 'A',
    hideSubimt: true,
    indexQuest:{},
    radioItems: [
    ],
    work:{

    },
    hidStart:false,
    MyRanking: {
      itemrownum: '暂无',
      head_portrait: '',
      nickname: '',
      correct_score: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // workSetId: options.workSetId,
      workSetId: 2,
      MyRanking: {
        itemrownum: '无',
        // head_portrait: app.globalData.myUserInfo.headPortrait,
        // nickname: app.globalData.myUserInfo.nickname,
        correct_score: 0
      }
    });
    wx.setNavigationBarTitle({
      // title: options.title,
      title: '啦啦啦',
      success: function (res) {
        // success
      }
    });
    getWork(this);
  },
  startKs:function(e){
    // this.setData({
    //   hidStart:true,
    // })
    getQuestion(this);
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      checkedValue: e.detail.value
    });
  },
})

var getWork=function(that){
  wx.showLoading({
    title: '正在获取题目...'
  })
  wx.request({
    url: work_url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      workSetId: that.data.workSetId
    },
    success: function (res) {
      //console.info(that.data.list);
      if (res.data.status == "0") {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        });
      } else {
        that.setData({
          work: res.data.data.obj
        });
        WxParse.wxParse('article', 'html', res.data.data.obj.questionIntroduction, that, 5);
      }
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取信息失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}

//获取题目信息
var getQuestion = function (that) {
  wx.showLoading({
    title: '正在获取题目...'
  })
  wx.request({
    url: question_url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      woworkSetId: that.data.workSetId
    },
    success: function (res) {
      //console.info(that.data.list);
      if (res.data.status == "0") {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      } else {
        
        that.setData({
          list: res.data.rows,
          index: 0,
          indexQuest: res.data.rows[0],
          hidStart: true,
          checkedValue: 'A'
        });
        getChoice(that);
        count_down(that);
      }

    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取题目失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}


//提交成绩信息
var submitQuestion = function (that) {
  wx.showLoading({
    title: '正在提交成绩...'
  });

  var picServerUrl = that.data.src;


  var totalNums = that.data.list.length;
  var errorNums = totalNums - that.data.answerNums;
  var avgScore = 100 / totalNums;
  var correctScore = avgScore * that.data.answerNums;
  var errorScore = avgScore * errorNums;
  var percentScore = that.data.answerNums / totalNums
  var costTime = 36 * 60 * 60 * 1000 - total_micro_second;
  costTime = parseInt(costTime / 1000);
  console.log(picServerUrl);
  wx.request({
    url: submitAchievement,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: {
      setId: that.data.setObj.id,
      enterUserId: app.globalData.myGlobalUserId,
      departmentId: app.globalData.myUserInfo.departmentId,
      correctNums: that.data.answerNums,
      correctScore: correctScore,
      errorNums: errorNums,
      errorScore: errorScore,
      costTime: costTime,
      percentScore: percentScore,
      picUrl: picServerUrl
    },
    success: function (res) {
      //提交做题日志
      submitQuestionLogs(that);
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交成绩失败',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}

//提交做题记录
var submitQuestionLogs = function (that) {
  wx.showLoading({
    title: '请稍等...'
  });
  var costTime = 36 * 60 * 60 * 1000 - total_micro_second;
  wx.request({
    url: submitQuestionLogsUrl,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: that.data.answerList,
    success: function (res) {
      wx.redirectTo({
        url: 'success/success?answerNums=' + that.data.answerNums + '&totalNums=' + that.data.list.length + '&costTime=' + costTime
      })
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交日志失败',
        showCancel: false
      });
    },
    complete: function () {
      wx.hideLoading();
    }
  });
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


// 获取答案列表
var getChoice = function (that) {
  var tmp1 = {
    name: "A:" + that.data.indexQuest.choice_a,
    value: 'A',
    checked: true
  }
  var tmp2 = {
    name: "B:" + that.data.indexQuest.choice_b,
    value: 'B'
  }

  var tmpRideo = [];
  tmpRideo.push(tmp1);
  tmpRideo.push(tmp2);
  if (null != that.data.indexQuest.choice_c && "" != that.data.indexQuest.choice_c) {
    var tmp3 = {
      name: "C:" + that.data.indexQuest.choice_c,
      value: 'C'
    }
    tmpRideo.push(tmp3);
  }
  if (null != that.data.indexQuest.choice_d && "" != that.data.indexQuest.choice_d) {
    var tmp4 = {
      name: "D:" + that.data.indexQuest.choice_d,
      value: 'D'
    }
    tmpRideo.push(tmp4);
  }
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
    //时间完成提交答案
    submitQuestionLogs(that);
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
}

