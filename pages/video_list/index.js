const app = getApp();
const url = app.globalData.serverUrl + "/vodCategoryAction/getOrdinaryVodCategory.json";
const dz_url = app.globalData.serverUrl + "/vodCategoryAction/getPartyVodCategory.json";
const context_url = app.globalData.serverUrl + "/vodInfoAction/getVodInfoListByType.json";

const context_url_arch = app.globalData.serverUrl + "/archivesInfoAction/getArchivesByCatId.json";
var page = 1;
const page_size = 10;
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    cat_list: [],
    list: [],
    hidden: true,
    page: 1,
    ywType: "1",
    xxtype: "1"

  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    page = 1;
    loadContxt(this, this.data.cat_list[e.detail.current].id, 1);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      });
      page = 1;
      loadContxt(this, this.data.cat_list[cur].id, 1);

    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function (options) {
    var that = this;

    console.log(options.type)
    that.setData({
      ywType: options.ywType,
      xxtype: options.type
    });
    if ("1" == options.type) {
      if ("2" == options.ywType) {
        wx.setNavigationBarTitle({
          title: "政治理论-视频审阅",
          success: function (res) {
            // success
          }
        });
      } else {
        wx.setNavigationBarTitle({
          title: "业务-视频审阅",
          success: function (res) {
            // success
          }
        });
      }

    } else {
      if ("2" == options.ywType) {
        wx.setNavigationBarTitle({
          title: "政治理论-视频学习",
          success: function (res) {
            // success
          }
        });
      } else {
        wx.setNavigationBarTitle({
          title: "职教资料学习",
          success: function (res) {
            // success
          }
        });
      }
    }
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 80;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    loadMore(that);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    page = 1;
    loadContxt(this, this.data.cat_list[this.data.currentTab].id, page);
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    console.log("下拉刷新:" + this.data.cat_list[this.data.currentTab].page);
    console.log(this.data.cat_list[this.data.currentTab].page)
    loadContxt(this, this.data.cat_list[this.data.currentTab].id, this.data.cat_list[this.data.currentTab].page);

  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    console.log("页面滚动：" + event.detail.scrollTop);
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    this.setData({
      list: [],
      scrollTop: 0
    });
    page = 1;
    loadContxt(this, this.data.cat_list[this.data.currentTab].id, page);
    console.log("上拉加载");


  }, btnItem: function (e) {
    var arch = e.currentTarget.dataset.arch;
    console.log(arch.title);
    wx.navigateTo({
      url: '/pages/video_play/index?dataObj=' + encodeURIComponent(JSON.stringify(arch))
    });
  }, downloadFile: function (e) {

    var type = e.currentTarget.dataset.type;
    var aId = e.currentTarget.dataset.id;
    if ("1" == type) {
      var title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '/pages/zj/arc_context/index?aId=' + aId + '&arc_title=' + title,
      });
    } else {
      var downloadFileUrl = e.currentTarget.dataset.enclosure;
      console.log(downloadFileUrl);
      // var downloadFileUrl = "http://hstl.oss-cn-beijing.aliyuncs.com/%E4%B8%AD%E5%9B%BD%E9%93%81%E8%B7%AF%E6%80%BB%E5%85%AC%E5%8F%B8%E3%80%8A%E9%93%81%E8%B7%AF%E6%8A%80%E6%9C%AF%E7%AE%A1%E7%90%86%E8%A7%84%E7%A8%8B%E3%80%8B%28%E6%99%AE%E9%80%9F%E9%93%81%E8%B7%AF%E9%83%A8%E5%88%86%29.doce80ebd3b-07f2-414b-885c-9d02f76d3a1e.doc";
      wx.showLoading({
        title: '正在打开文件',
      });
      wx.downloadFile({
        url: downloadFileUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            var filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              success: function (e) {
                wx.hideLoading();
                console.log('打开文件成功');
              }, fail: function (e) {
                wx.hideLoading();
                console.log('打开文件成功');
                wx.showToast({
                  title: '文件打开失败,请重新点击',
                  icon: 'none'
                })
              }
            });
          } else {
            wx.hideLoading();
            console.log('打开文件成功');
            wx.showToast({
              title: '文件下载失败，请重试！',
              icon: 'none'
            })
          }

        }, fail: function (e) {
          wx.showToast({
            title: '文件打开失败，请重试！',
            icon: 'none'
          })
          wx.hideLoading();
        }
      });
    }
  }

})

var loadMore = function (that) {
  loadding(that);
  var temUrl = "";
  if (that.data.ywType == "2") {
    temUrl = dz_url;
  } else {
    temUrl = url;
  }
  wx.request({
    url: temUrl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      type: that.data.xxtype
    },
    success: function (res) {
      //console.info(that.data.list);
      if (res.data.list.length == 0) {
        wx.showToast({
          title: '服务器尚未分类',
          icon: 'none'
        })
        stopLoding(that);
        return;
      }
      var cat_list = that.data.cat_list;
      for (var i = 0; i < res.data.list.length; i++) {
        cat_list.push(res.data.list[i]);
        cat_list[i]['page'] = 1;
        cat_list[i]['list_arc'] = [];
      }
      if ("2" == that.data.xxtype && "1" == that.data.ywType) {
        var kjxx = {
          title: '课件学习',
          type: '2',
          id: '30'
        };
        var zsgz = {
          title: '掌上规章',
          type: '2',
          id: '31'
        };
        cat_list.push(kjxx);
        cat_list.push(zsgz);
      }
      //设置数据
      that.setData({
        cat_list: cat_list
      });
      that.data.currentTab = 0;
      loadContxt(that, cat_list[0].id, 1);
    }
  });
}

var loadContxt = function (that, catId, page) {
  loadding(that);
  var tempurl = context_url;
  if ("2" == that.data.xxtype) {
    if (catId == 30 || catId == 31) {
      tempurl = context_url_arch;
    }
  }
  wx.request({
    url: tempurl,
    header: {
      'context-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    data: {
      limit: page_size,
      vodCatId: catId,
      catId: catId,
      offset: page,
      type: that.data.xxtype
    },
    success: function (res) {
      //console.info(that.data.list);
      var cat_list = that.data.cat_list;
      var list = cat_list[that.data.currentTab]['list_arc'];
      console.log("当前页码为:" + page);
      if (page === 1) {
        list = []
      } else {
        list = list
      }
      if (res.data.rows.length === 0) {
        stopLoding(that);
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        });
        console.log("没有更多数据了");
      } else {
        if ("30" == catId || "31" == catId) {
          for (var i = 0; i < res.data.rows.length; i++) {
            var tmpObj = {
              id: res.data.rows[i].id,
              pic_ali: res.data.rows[i].pic_ali,
              arcType: res.data.rows[i].arcType,
              enclosureUrl: res.data.rows[i].enclosureUrl,
              source: res.data.rows[i].source,
              title: res.data.rows[i].title,
              nickname: res.data.rows[i].nickname,
              writer: res.data.rows[i].nickname,
              click: res.data.rows[i].click,
              layout: res.data.rows[i].layout,
            }
            list.push(tmpObj);
          }
        } else {
          for (var i = 0; i < res.data.rows.length; i++) {
            list.push(res.data.rows[i]);
          }
        }

        //设置数据
        // that.setData({
        //   list: list
        // });
        //设置子数据

        cat_list[that.data.currentTab]['list_arc'] = list;
        page++;
        // console.log("数据加载完成的页码为:" + page);
        cat_list[that.data.currentTab].page = page;

        that.setData({
          cat_list: cat_list
        });
        // console.log("存储后的当前页码为:" + that.data.cat_list[that.data.currentTab].page);
        stopLoding(that);
      }

    }
  });
}
var stopLoding = function (that) {
  that.setData({
    hidden: true
  });
  wx.hideNavigationBarLoading() //完成停止加载
  wx.stopPullDownRefresh() //停止下拉刷新
}

var loadding = function (that) {
  wx.showNavigationBarLoading() //在标题栏中显示加载
  that.setData({
    hidden: false
  });
}
