// pages/examination/construction/index.js


const app = getApp()
// var WxParse = require('../../../plus/wxParse/wxParse.js');
var total_micro_second = 20 * 60 * 1000;
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

var firstJump=false;

Page({

  /**
   * 页面的初始数据woworkSetId
   */
  data: {
    timer: date_format(total_micro_second),
    totalTimer: 20,
    list: [],
    workSetId: 0,
    index: 0,
    checkedValue: 'A',
    hideSubimt: true,
    indexQuest: {},
    files: [],
    src: "",
    srcCount: 0,
    radioItems: [
    ],
    work: {

    },
    hidRanking: true,
    answerNums: 0,
    answerList: [],
    answerCheckList: [],
    hidStart: false,
    hideSubimt: true,
    listRanking: [],
    MyRanking: {
      itemrownum: '暂无',
      head_portrait: '',
      nickname: '',
      correct_score: 0
    },
    startdatatime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    firstJump=firstJump;
    var totalTimer = options.timer;
    total_micro_second = totalTimer * 60 * 1000;
    this.ctx = wx.createCameraContext();

    this.setData({
      workSetId: options.workSetId,
      myUserInfo: app.globalData.myUserInfo,
      totalTimer: totalTimer,
      // workSetId: 2,
      MyRanking: {
        itemrownum: '无',
        head_portrait: app.globalData.myUserInfo.headPortrait,
        nickname: app.globalData.myUserInfo.nickname,
        correct_score: 0
      }
    });
    wx.setNavigationBarTitle({
      title: options.title,
      success: function (res) {
        // success
      }
    });
    // getWork(this);
    getQuestion(this);

  },
  onShow(e){
    firstJump=false;
  },
  startKs: function (e) {
    // this.setData({
    //   hidStart:true,
    // })
    getQuestion(this);
  },
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    if (this.data.index + 1 >= this.data.list.length) {
      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
      }
      this.setData({
        radioItems: radioItems,
        checkedValue: e.detail.value
      });
      return;
    }
    wx.showLoading({
      title: '正在切换下一题',
    })
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      checkedValue: e.detail.value
    });
    this.next(e);
    wx.hideLoading();
  },
  ranking: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      hidRanking: false
    });
    findUserRankingList(this);
  },
  next: function (e) {
    var cur_index = this.data.index;
    console.log(e.currentTarget.dataset.checked);


    var checkValue = e.currentTarget.dataset.checked;
    if (cur_index + 1 >= this.data.list.length) {
      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == checkValue;
      }
      this.setData({
        radioItems: radioItems,
        checkedValue: checkValue
      });
      return;
    }
    wx.showLoading({
      title: '正在切换下一题',
    });
    var tak = parseInt(this.data.list.length / 2);
    var tt = parseInt(this.data.list.length / 5);
    if (tak == cur_index) {
      takePhoto(this);
    }
    if (tt == cur_index) {
      takePhoto(this);
    }

    // var checkValue = this.data.checkedValue;
    var cur_answerNums = this.data.answerNums;

    var hideSubimt = true;
    //判断题目是否正确
    var isRight = 1;
    if (this.data.indexQuest.answer == checkValue) {
      cur_answerNums++;
      console.log('回答正确！');
      var isRight = 1;
      // wx.showToast({
      //   title: '回答正确',
      //   icon: 'success',
      //   duration: 2000
      // })
    } else {
      var isRight = 2;
      console.log("回答错误！")
      // wx.showToast({
      //   title: '回答错误：正确答案是' + this.data.indexQuest.answer,
      //   icon: 'none',
      //   duration: 2000
      // })
    }
    var tmpAnswer = {
      'workQuestionId': this.data.indexQuest.id,
      'userSelect': checkValue,
      'correctAnswer': this.data.indexQuest.answer,
      'workQuestionContext': this.data.indexQuest.title,
      'isRight': isRight,
      'workId': this.data.workSetId,
      'userId': this.data.myUserInfo.id
    }
    var tmpanswerList = this.data.answerList;
    if (tmpanswerList[cur_index] == null) {
      tmpanswerList.push(tmpAnswer);
    } else {
      tmpanswerList[cur_index] = tmpAnswer;
    }
    cur_index++;
    //获取下一题
    var nextQuest = this.data.list[cur_index];
    var tmpAnswer = tmpanswerList[cur_index];
    var checkedValue = 'A';
    if (tmpAnswer != null) {
      checkedValue = tmpAnswer.userSelect;
    }
    this.setData({
      indexQuest: nextQuest,
      index: cur_index,
      answerNums: cur_answerNums,
      answerList: tmpanswerList,
      checkedValue: checkedValue
    });
    //重新组织题目
    getChoice(this, checkedValue);
    //增加题目
    wx.hideLoading();
  },
  previous: function (e) {

    var cur_index = this.data.index;
    if (cur_index == 0) {
      return;
    }


    cur_index--;
    var hideSubimt = true;
    var tmpAnswer = this.data.answerList[cur_index];
    //获取上一题
    var previousQuest = this.data.list[cur_index];
    var cur_answerNums = this.data.answerNums;
    if (cur_answerNums > 0) {
      if ("1" == tmpAnswer.isRight) {
        cur_answerNums--;
      }
    }
    var checkedValue = tmpAnswer.userSelect;
    if ("" == checkedValue) {
      checkedValue = 'A';
    }
    this.setData({
      answerNums: cur_answerNums,
      indexQuest: previousQuest,
      index: cur_index,
      checkedValue: checkedValue
    });
    //重新组织题目
    getChoice(this, checkedValue);

  },
  submitKs: function (e) {
    if (firstJump) {
      return;
    }
    firstJump = true;

    takePhoto(this);
    wx.showLoading({
      title: '正在保存...',
    })
    var isRight = 1;
    if (cur_index != this.data.list.length) {
      var cur_index = this.data.list.length;

      var cur_answerNums = this.data.answerNums;
      if (this.data.indexQuest.answer == this.data.checkedValue) {
        cur_answerNums++;
        console.log('回答正确！');
      } else {
        console.log("回答错误！")
      }

      var tmpAnswer = {
        'workQuestionId': this.data.indexQuest.id,
        'userSelect': this.data.checkedValue,
        'correctAnswer': this.data.indexQuest.answer,
        'workQuestionContext': this.data.indexQuest.title,
        'isRight': isRight,
        'workId': this.data.workSetId,
        'userId': this.data.myUserInfo.id
      }
      var tmpanswerList = this.data.answerList;
      tmpanswerList.push(tmpAnswer);

      if(cur_answerNums>this.data.list.size){
        cur_answerNums = this.data.list.size;
      }
      this.setData({
        // index: cur_index,
        answerNums: cur_answerNums,
        answerList: tmpanswerList
      });

    }
    // console.log(answerList);
    console.log("完成考试！");
    // submitQuestion(this);
    upload(this, 0);

  },
  hidRanking: function (e) {
    this.setData({
      hidRanking: true
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c9ae8',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  showHome: function (e) {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})

// var getWork = function (that) {
//   wx.showLoading({
//     title: '正在获取题目...'
//   })
//   wx.request({
//     url: work_url,
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Accept': 'application/json'
//     },
//     data: {
//       workSetId: that.data.workSetId
//     },
//     success: function (res) {
//       //console.info(that.data.list);
//       if (res.data.status == "0") {
//         wx.showModal({
//           title: '提示',
//           content: res.data.msg,
//           showCancel: false
//         });
//       } else {
//         that.setData({
//           work: res.data.data.obj
//         });
//         WxParse.wxParse('article', 'html', res.data.data.obj.questionIntroduction, that, 5);

//       }
//       wx.hideLoading();
//     }, fail: function (e) {
//       console.log(e);
//       wx.showModal({
//         title: '提示',
//         content: '获取信息失败',
//         showCancel: false
//       })
//       wx.hideLoading();
//     },
//     complete: function () {

//     }
//   });
// }

//获取题目信息
var getQuestion = function (that) {
  wx.showLoading({
    title: '正在获取题目...'
  });
  // WxParse.wxParse('article', 'html', "", that, 5);
  wx.request({
    url: question_url,
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
        })
      } else {
        console.log(res.data.rows[0]);
        that.setData({
          list: res.data.rows,
          index: 0,
          indexQuest: res.data.rows[0],
          hidStart: true,
          checkedValue: 'A',
          startdatatime: new Date().getTime()
        });
        // WxParse.wxParse('article', 'html', "", that, 5);
        getChoice(that, 'A');
        // count_down(that);
      }

      wx.hideLoading();

    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取题目失败',
        showCancel: false
      })

      wx.hideLoading();
    },
    complete: function () {
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
  var costTime = that.data.totalTimer * 60 * 1000 - total_micro_second;
  // costTime = parseInt(costTime / 1000);
  // console.log(picServerUrl);
  costTime = checkDateInfo(that.data.startdatatime)
  wx.request({
    url: submitAchievement,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: {
      workId: that.data.workSetId,
      workUserId: app.globalData.myGlobalUserId,
      departmentId: app.globalData.myUserInfo.departmentId,
      correctNums: that.data.answerNums,
      correctScore: correctScore,
      errorNums: errorNums,
      errorScore: errorScore,
      costTime: costTime,
      percentScore: percentScore,
      totalScore: 100,
      picUrl: picServerUrl
    },
    success: function (res) {
      //提交做题日志
      submitQuestionLogs(that, res.data.data.obj, costTime);
      // wx.hideLoading();
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交成绩失败',
        showCancel: false
      });
      wx.hideLoading();
    },
    complete: function () {

    }
  });
}

//提交做题记录
var submitQuestionLogs = function (that, obj, costTime) {
  wx.showLoading({
    title: '请稍等...'
  });
  // var costTime = that.data.totalTimer * 60 * 1000 - total_micro_second;
  // costTime = parseInt(costTime / 1000);
  // costTime = checkDateInfo(that.data.startdatatime)
  var postData = that.data.answerList;
  var sumbitData = [];
  for (var i = 0; i < postData.length; i++) {
    var tmpdata = postData[i];
    tmpdata.workLogsId = obj.id;
    sumbitData.push(tmpdata);
  }
  wx.request({
    url: submitQuestionLogsUrl,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: sumbitData,
    success: function (res) {
      wx.navigateTo({
        url: 'success/success?answerNums=' + that.data.answerNums + '&totalNums=' + that.data.list.length + '&costTime=' + costTime
      })

      wx.hideLoading();
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交日志失败',
        showCancel: false
      });

      wx.hideLoading();
    },
    complete: function () {
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

  // return hr + ":" + min + ":" + sec + " " + micro_sec;

  return hr + ":" + min + ":" + sec + " " ;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}


// 获取答案列表
var getChoice = function (that, checked) {

  var tmp1 = {
    name: that.data.indexQuest.choicea,
    value: 'A'
  }
  var tmp2 = {
    name: that.data.indexQuest.choiceb,
    value: 'B'
  }

  var tmpRideo = [];
  tmpRideo.push(tmp1);
  tmpRideo.push(tmp2);
  if (null != that.data.indexQuest.choicec && "" != that.data.indexQuest.choicec) {
    var tmp3 = {
      name: that.data.indexQuest.choicec,
      value: 'C'
    }
    tmpRideo.push(tmp3);
  }
  if (null != that.data.indexQuest.choiced && "" != that.data.indexQuest.choiced) {
    var tmp4 = {
      name: that.data.indexQuest.choiced,
      value: 'D'
    }
    tmpRideo.push(tmp4);
  }
  if ("A" == checked) {
    tmp1.checked = true
  } else if ("B" == checked) {
    tmp2.checked = true
  } else if ("C" == checked) {
    tmp3.checked = true
  } else if ("D" == checked) {
    tmp4.checked = true
  } else {
    tmp1.checked = true
  }
  that.setData({
    radioItems: tmpRideo
  })
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
    if (firstJump){
      return;
    }
    firstJump=true;
    submitQuestion(that);
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that);
  }, 1000)
}



//获取用户排行榜
var findUserRankingList = function (that) {
  wx.showLoading({
    title: '请稍等...'
  });
  wx.request({
    url: findUserRankingListUrl,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      workId: that.data.workSetId
    },
    success: function (res) {
      var tempDate = [];
      var MyRanking = that.data.MyRanking;
      var j = 1;
      for (var i = 0; i < res.data.rows.length; i++) {
        //处理排行信息
        var item = res.data.rows[i];
        //判断是否是自己的排行信息
        if (app.globalData.myGlobalUserId == res.data.rows[i].enter_user_id) {
          item['itemrownum'] = j;
          tempDate.push(item);
          j++;
          // MyRanking: {
          //   itemrownum: '无',
          //     head_portrait: app.globalData.myUserInfo.headPortrait,
          //       nickname: app.globalData.myUserInfo.nickname,
          //         correct_score: 0
          // }
          // that.setData({
          //   MyRanking:item
          // });
          MyRanking = item;
        } else {
          item['itemrownum'] = j;
          tempDate.push(item);
          j++;
        }

      }
      that.setData({
        MyRanking: MyRanking,
        listRanking: tempDate
      });
    }, fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取排行榜信息错误',
        showCancel: false
      });
    },
    complete: function () {
      wx.hideLoading();
    }
  });
}
var takePhoto = function (that) {
  that.ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      // upload(that,res.tempImagePath)
      console.log(res.tempImagePath);
      var tems = that.data.files;
      tems.push(res.tempImagePath);
      that.setData({
        files: tems
      });
    }
  })
}
var upload = function (that, index) {

  var picUrl = that.data.files;
  if (picUrl.length > 0 && that.data.srcCount < picUrl.length) {
    wx.showLoading({
      title: '正在保存...',
    });
    if (index == 0) {
      that.setData({
        src: "",
        srcCount: 0
      });
    }
    var path = picUrl[index];

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
          firstJump = false;
          return;
        }
        var data = JSON.parse(res.data);
        // console.log(that.data.tempFile);
        var picServerUrl = that.data.src;
        if (null != data.data.list && "" != data.data.list && data.data.list.length > 0) {
          var srcCount = that.data.srcCount;
          if ("" == picServerUrl) {
            picServerUrl = data.data.list[0].uri;
            srcCount = 0;
          } else {
            picServerUrl = picServerUrl + "," + data.data.list[0].uri;
          }
        }
        console.log("拼接后的图片地址：" + picServerUrl);
        srcCount++;
        that.setData({
          src: picServerUrl,
          srcCount: srcCount
        });

        var leng = picUrl.length - 1;
        console.log("图片总数为：" + leng + ",伤处总数为:" + srcCount);

        if (srcCount > leng) {
          // wx.hideToast();  //隐藏Toast
          submitQuestion(that);
        } else {
          upload(that, srcCount);
        }
        // saveTouxiang();
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        });
        firstJump = false;
        wx.hideLoading();
      },
      complete: function () {

      }
    });

  } else {
    var picServerUrl = "http://nmtc.oss-cn-beijing.aliyuncs.com/images/s7jJHNHYGzm3Q83XisPfa8AkxPnH7Det.jpg";
    that.setData({
      src: picServerUrl
    });
    submitQuestion(that);
  }


}

function checkDateInfo(dateTime) {
  var olddate = new Date(dateTime);
  //olddate = olddate.getMilliseconds();  
  console.log("old time = ", olddate);
  var result = 0;
  // var month = 1000 * 60 * 60 * 24 * 30;//将ms转换成天  
  var just = new Date().getTime();//获取当前时间，单位ms  
  console.log("current time = ", just);
  var diff = just - olddate;
  console.log("diff = ", diff);
  if (diff <= 0) {
    return result;
  }
  // var mm = diff / month;
  // mm = mm.toFixed();//取整  
  result = parseInt(diff / 1000);//转换类型  
  console.log("result = ", result);
  return result;
}