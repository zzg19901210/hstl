const app = getApp()
var total_micro_second = 30 * 60 * 1000;
var sum_total_micro_second = 30 * 60 * 1000;

const question_url = app.globalData.serverUrl + "/app/service/customs/findByCustomsQuestionListByCat.json";

const submitCustomsAchievement = app.globalData.serverUrl + "/app/service/customs/submitCustomsAchievement.json";
const submitCustomsUserLogs = app.globalData.serverUrl + "/app/service/customs/submitCustomsUserLogs.json";

var timerOut;

var isLast = false;
var islastRigth = false;
var firstJump = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexQuest: {},
    list: [],
    index: 0,
    selectIndex: 0,
    catId: 1,
    answerNums: 0,
    answerList: [],
    checkedValue: '',
    clock: date_format(total_micro_second),
    hidStart: false,
    radioItems: [
      // { name: 'A:110', value: '0' },
      // { name: 'B:110', value: '1', checked: true },
      // { name: 'C:120', value: '2' },
      // { name: 'D:120', value: '3' },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    firstJump = false;
    if (null != options.catId && "undefined" != options.catId) {
      this.setData({
        catId: options.catId,
      });
    }

    wx.setNavigationBarTitle({
      title: options.title,
      success: function(res) {
        // success
      }
    });
    getQuestion(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  previous: function(e) {

    var cur_index = this.data.index;
    if (cur_index == 0) {
      return;
    }
    cur_index--;
    var hideSubimt = true;
    var tmpAnswer = this.data.answerList[cur_index];
    //获取上一题
    var previousQuest = this.data.list[cur_index];
    var checkedValue = tmpAnswer.chooseAnswer;

    var cur_answerNums = this.data.answerNums;
    if (cur_answerNums > 0) {
      if ("1" == tmpAnswer.isRight) {
        cur_answerNums--;
      }
    }
    if ("" == checkedValue) {
      checkedValue = 'A';
    }
    this.setData({
      answerNums: cur_answerNums,
      indexQuest: previousQuest,
      index: cur_index,
      selectIndex: cur_index,
      checkedValue: checkedValue
    });
    //重新组织题目
    getChoice(this, checkedValue,     this.data.indexQuest.questions_type);

  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems,
      values = e.detail.value;
    for (var i = 0, lenI = radioItems.length; i < lenI; ++i) {
      radioItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (radioItems[i].value == values[j]) {
          radioItems[i].checked = true;
          break;
        }
      }
    }
    var checked = "";
    for (var f = 0; f < radioItems.length; f++) {
      if (radioItems[f].checked == true) {
        if ("" == checked) {
          checked = radioItems[f].value;
        } else {
          checked = checked + "," + radioItems[f].value;
        }
      }
    }
    this.setData({
      radioItems: radioItems,
      checkedValue: checked
    });
  },
  submitKs: function(e) {
    if (firstJump) {
      return;
    }
    firstJump = true;
    wx.showLoading({
      title: '正在保存...',
    });

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
        'questionId': this.data.indexQuest.id,
        'chooseAnswer': this.data.checkedValue,
        'correctAnswer': this.data.indexQuest.answer,
        'questionContext': this.data.indexQuest.questions,
        'status': isRight,
        'userId': app.globalData.myGlobalUserId,
        // 'setId': this.data.setObj.id
      }
      var tmpanswerList = this.data.answerList;
      tmpanswerList.push(tmpAnswer);

      this.setData({
        // index: cur_index,
        answerNums: cur_answerNums,
        answerList: tmpanswerList
      });

    }
    // console.log(answerList);
    console.log("完成考试！");

    submitQuestion(this);
  },
  next(e) {
    var cur_index = this.data.index;
    console.log(e.currentTarget.dataset.checked);
    var checkValue = e.currentTarget.dataset.checked;
    if (islastRigth) {
      cur_answerNums = cur_answerNums - 1;
      islastRigth = false;
    }
    //判断是否是最后一道题，如果是最好一道题跳出
    if (cur_index + 1 >= this.data.list.length) {
      var radioItems = this.data.radioItems;
      isLast = true;
      if (isRight == 1) {
        islastRigth = true;
      }
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == checkValue;
      }
      this.setData({
        radioItems: radioItems,
        checkedValue: checkValue,
        selectIndex: this.data.list.length
      });
      return;
    }
    wx.showLoading({
      title: '正在切换下一题',
    });

    var cur_answerNums = this.data.answerNums;
    //判断题目是否正确
    var isRight = 1;
    if (this.data.indexQuest.questions_type == "2") {
      checkValue = this.data.checkedValue;

      if (this.data.indexQuest.answer == checkValue) {
        cur_answerNums++;
        console.log('回答正确！');
        var isRight = 1;

      } else {
        var isRight = 2;
        console.log("回答错误！")
      }
    } else {
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
    }
    var hideSubimt = true;

    var tmpAnswer = {
      'questionId': this.data.indexQuest.id,
      'chooseAnswer': checkValue,
      'correctAnswer': this.data.indexQuest.answer,
      'questionContext': this.data.indexQuest.questions,
      'status': isRight,
      'userId': app.globalData.myGlobalUserId,
      'customsId': 1
      // 'setId': this.data.setObj.id
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
    var checkedValue = '';
    if (tmpAnswer != null) {
      checkedValue = tmpAnswer.correctAnswer;
    }
    this.setData({
      indexQuest: nextQuest,
      index: cur_index,
      selectIndex: cur_index,
      answerNums: cur_answerNums,
      answerList: tmpanswerList,
      checkedValue: checkedValue
    });
    //重新组织题目
    getChoice(this, checkedValue, this.data.indexQuest.questions_type);
    wx.hideLoading();

  }
})
var getChoice = function(that, checked, lx) {
  console.log(lx);
  var tmp1 = {
    name: 'A:' + that.data.indexQuest.choice_a,
    value: 'A'
  }
  var tmp2 = {
    name: 'B:' + that.data.indexQuest.choice_b,
    value: 'B'
  }
  var tmpRideo = [];
  tmpRideo.push(tmp1);
  tmpRideo.push(tmp2);
  if (null != that.data.indexQuest.choice_c && "" != that.data.indexQuest.choice_c) {
    var tmp3 = {
      name: 'C:' + that.data.indexQuest.choice_c,
      value: 'C'
    }
    tmpRideo.push(tmp3);
  }
  if (null != that.data.indexQuest.choice_d && "" != that.data.indexQuest.choice_d) {
    var tmp4 = {
      name: 'D:' + that.data.indexQuest.choice_d,
      value: 'D'
    }
    tmpRideo.push(tmp4);
  }
  if ("2" == lx) {
    var checks = checked.split(",");
    for (var i = 0; i < checks.length; i++) {
      console.log(checks[i]);
      if ("A" == checks[i]) {
        tmp1.checked = true
      } else if ("B" == checks[i]) {
        tmp2.checked = true
      } else if ("C" == checks[i]) {
        tmp3.checked = true
      } else if ("D" == checks[i]) {
        tmp4.checked = true
      } else {
        tmp1.checked = true
      }
    }

  } else {
    if ("A" == checked) {
      tmp1.checked = true
    } else if ("B" == checked) {
      tmp2.checked = true
    } else if ("C" == checked) {
      tmp3.checked = true
    } else if ("D" == checked) {
      tmp4.checked = true
    } else {
      // tmp1.checked = true
    }
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
    if (firstJump) {
      return;
    }
    firstJump = true;
    submitQuestion(that);
    // timeout则跳出递归
    return;
  }
  timerOut = setTimeout(function() {
    // 放在最后--
    total_micro_second -= 5000;
    count_down(that);
  }, 5000)
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
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  // return hr + ":" + min + ":" + sec + " " + micro_sec;
  return hr + ":" + min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}


//获取题目信息
var getQuestion = function(that) {
  wx.showLoading({
    title: '正在获取题目...'
  })
  wx.request({
    url: question_url,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      questionNum: 20,
      customsId: 1,
      catId: that.data.catId
    },
    success: function(res) {
      wx.showLoading({
        title: '正在解析题目...',
      });
      //console.info(that.data.list);
      if (res.data.status == "0") {
        wx.hideLoading();
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
          checkedValue: '',
          hidStart: true
        });
        getChoice(that, '', res.data.rows[0].questions_type);

        // total_micro_second = res.data.data.obj.timer * 60 * 1000;
        count_down(that);

        wx.hideLoading();
      }

    },
    fail: function(e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '获取题目失败',
        showCancel: false
      })
    },
    complete: function() {
      wx.hideLoading();
    }
  });
}

//提交成绩信息
var submitQuestion = function(that) {
  wx.showLoading({
    title: '正在提交成绩...'
  });

  var setType = that.data.setType;
  var totalNums = that.data.list.length;
  var errorNums = totalNums - that.data.answerNums;
  var avgScore = parseInt(100 / totalNums);
  var correctScore = avgScore * that.data.answerNums;
  if (correctScore > 100) {
    correctScore = 100;
  }
  var errorScore = 100 - correctScore;
  var percentScore = that.data.answerNums / totalNums
  var costTime = sum_total_micro_second - total_micro_second;
  var isCustoms = 0;
  if (correctScore > 80) {
    isCustoms = 1;
  }
  costTime = parseInt(costTime / 1000);
  wx.request({
    url: submitCustomsAchievement,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: {
      // setId: that.data.setObj.id,
      userId: app.globalData.myGlobalUserId,
      departmentId: app.globalData.myUserInfo.departmentId,
      correctNums: that.data.answerNums,
      correctScore: correctScore,
      errorNums: errorNums,
      errorScore: errorScore,
      costTime: costTime,
      percentScore: percentScore,
      catId: that.data.catId,
      totalNums: totalNums,
      totalScore: 100,
      isCustoms: isCustoms

    },
    success: function(res) {
      //提交做题日志
      if (res.statusCode == 200) {
        submitQuestionLogs(that, res.data.data.obj);
      } else {
        wx.showModal({
          title: '提示',
          content: '提交成绩失败',
          showCancel: false
        });
        wx.hideLoading();
      }

    },
    fail: function(e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交成绩失败',
        showCancel: false
      });
      wx.hideLoading();
    },
    complete: function() {

    }
  });
}

//提交做题记录
var submitQuestionLogs = function(that, obj) {
  wx.showLoading({
    title: '请稍等...'
  });
  var costTime = sum_total_micro_second - total_micro_second;
  costTime = parseInt(costTime / 1000);
  var postData = that.data.answerList;
  var sumbitData = [];
  for (var i = 0; i < postData.length; i++) {
    var tmpdata = postData[i];
    tmpdata.achievementId = obj.id;
    sumbitData.push(tmpdata);
  }
  wx.request({
    url: submitCustomsUserLogs,
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    method: 'POST',
    data: sumbitData,
    success: function(res) {
      wx.showLoading({
        title: '正在计算成绩...'
      });
      wx.navigateTo({
        url: 'success/success?answerNums=' + that.data.answerNums + '&totalNums=' + that.data.list.length + '&costTime=' + costTime,
        success: function(e) {
          wx.hideLoading();
        }
      })
    },
    fail: function(e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '提交日志失败',
        showCancel: false
      });
    },
    complete: function() {
      wx.hideLoading();
    }
  });
}