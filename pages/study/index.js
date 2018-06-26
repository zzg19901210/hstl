
const app = getApp()
var total_micro_second = 20 * 60 * 1000;
// 获取上传文件路径
const upload_url = app.globalData.serverUrl + "/common/upload/up.json";
//获取问题列表
const question_url = app.globalData.serverUrl + "/studyQuestionAction/getQuestionsByNumAndTypeAndDepartmentId.json";
//做题日志
const submitQuestionLogsUrl = app.globalData.serverUrl + "/app/service/appServiceInterface/submitQuestionLogs.json";
// 成绩提交
const submitAchievement = app.globalData.serverUrl + "/app/service/appServiceInterface/submitAchievement.json";
//获取排行榜
const findUserRankingListUrl = app.globalData.serverUrl + "/app/service/appServiceInterface/findUserRankingList.json";
const findUserRankingListByCatId = app.globalData.serverUrl + "/app/service/appServiceInterface/findUserRankingListByCatId.json";
Page({
  data: {
    clock: date_format(total_micro_second),
    hidStart: false,
    hidRanking: true,
    rankingType:1,
    list: [],
    index: 0,
    indexQuest: {},
    files: [],
    answerNums: 0,
    answerList: [],
    checkedValue: 'A',
    hideSubimt: true,
    setObj: {},
    src: '',
    srcCount: 0,
    catId: 0,
    setType:'1',
    radioItems: [
      // { name: 'A:110', value: '0' },
      // { name: 'B:110', value: '1', checked: true },
      // { name: 'C:120', value: '2' },
      // { name: 'D:120', value: '3' },
    ],
    listRanking: [],
    MyRanking: {
      itemrownum: '暂无',
      head_portrait: '',
      nickname: '',
      correct_score: 0
    }
  },
  onLoad(options) {
    console.log(app.globalData.myUserInfo);
    this.setData({
      myUserInfo: app.globalData.myUserInfo,
      catId: options.catId,
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
    this.ctx = wx.createCameraContext();

  },
  startKs() {
    getQuestion(this,1);
    takePhoto(this);

  },startLx() {
    getQuestion(this,2);
    takePhoto(this);
  },
  error(e) {
    console.log(e.detail)
  },
  next(e) {
    var cur_index = this.data.index;
    // console.log(e.currentTarget.dataset.checked);
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
    if (tak == cur_index) {
      takePhoto(this);
    }
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
      'questionId': this.data.indexQuest.id,
      'correctAnswer': checkValue ,
      'answer': this.data.indexQuest.answer,
      'questionContext': this.data.indexQuest.questions,
      'isRight': isRight,
      'userId': app.globalData.myGlobalUserId,
      'setId': this.data.setObj.id
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
      checkedValue = tmpAnswer.correctAnswer;
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
    var checkedValue = tmpAnswer.correctAnswer;

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
      checkedValue: checkedValue
    });
    //重新组织题目
    getChoice(this, checkedValue);

  },
  submitKs: function (e) {
    wx.showLoading({
      title: '正在保存...',
    })
    takePhoto(this);
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
        'correctAnswer': this.data.checkedValue,
        'answer': this.data.indexQuest.answer,
        'questionContext': this.data.indexQuest.questions,
        'isRight': isRight,
        'userId': app.globalData.myGlobalUserId,
        'setId': this.data.setObj.id
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

    upload(this,0);
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
  },clicktkph:function(e){
    findUserRankingList(this, findUserRankingListByCatId);
    console.log("点击了题库排行");
    this.setData({
      rankingType: 2
    });
  },clickzph: function (e) {
    console.log("点击了总题库排行");
    findUserRankingList(this, findUserRankingListUrl);
    this.setData({
      rankingType:1
    });
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
    findUserRankingList(this, findUserRankingListUrl);
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
        console.log("图片总数为：" + leng + " 上传总数为:" + srcCount);

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
        })
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

//获取题目信息
var getQuestion = function (that,setType) {
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
      nums: 10,
      type: 1,
      setType: setType,
      workType: 0,
      departmentId: 0,
      catId: that.data.catId,
      isHide: 0
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
          list: res.data.list,
          index: 0,
          indexQuest: res.data.list[0],
          setObj: res.data.data.obj,
          setType: setType,
          hidStart: true,
          checkedValue: 'A'
        });
        getChoice(that,'A');
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

  var setType=that.data.setType;
  var totalNums = that.data.list.length;
  var errorNums = totalNums - that.data.answerNums;
  var avgScore = 100 / totalNums;
  var correctScore = avgScore * that.data.answerNums;
  var errorScore = avgScore * errorNums;
  var percentScore = that.data.answerNums / totalNums
  var costTime = 20 * 60 * 1000 - total_micro_second;
 
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
      picUrl: picServerUrl,
      catId: that.data.catId, 
      setType:setType
    },
    success: function (res) {
      //提交做题日志
      submitQuestionLogs(that, res.data.data.obj);
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
var submitQuestionLogs = function (that, obj) {
  wx.showLoading({
    title: '请稍等...'
  });
  var costTime = 20 * 60 * 1000 - total_micro_second;
  costTime = parseInt(costTime / 1000);
  var postData = that.data.answerList;
  var sumbitData = [];
  for (var i = 0; i < postData.length; i++) {
    var tmpdata = postData[i];
    tmpdata.setLogId = obj.id;
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
      wx.showLoading({
        title: '正在计算成绩...'
      });
      wx.navigateTo({
        url: 'success/success?answerNums=' + that.data.answerNums + '&totalNums=' + that.data.list.length + '&costTime=' + costTime,
        success: function (e) {
          wx.hideLoading();
        }
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

// 获取答案列表
var getChoice = function (that, checked) {

  var tmp1 = {
    name:'A:'+that.data.indexQuest.choice_a,
    value: 'A'
  }
  var tmp2 = {
    name: 'B:' +that.data.indexQuest.choice_b,
    value: 'B'
  }
  var tmpRideo = [];
  tmpRideo.push(tmp1);
  tmpRideo.push(tmp2);
  if (null != that.data.indexQuest.choice_c && "" != that.data.indexQuest.choice_c) {
    var tmp3 = {
      name: 'D:' +that.data.indexQuest.choice_c,
      value: 'C'
    }
    tmpRideo.push(tmp3);
  }
  if (null != that.data.indexQuest.choice_d && "" != that.data.indexQuest.choice_d) {
    var tmp4 = {
      name: 'D:' +that.data.indexQuest.choice_d,
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
    submitQuestionLogs(that);
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 1000;
    count_down(that);
  }, 1000)
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


//获取用户排行榜
var findUserRankingList = function (that,uri) {
  wx.showLoading({
    title: '请稍等...'
  });

  wx.request({
    url: uri,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data:{
      catId: that.data.catId
    },
    // data: that.data.answerList,
    success: function (res) {
      var tempDate = [];
      var MyRanking= {
        itemrownum: '无',
        head_portrait: app.globalData.myUserInfo.headPortrait,
        nickname: app.globalData.myUserInfo.nickname,
        correct_score: 0
      };
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