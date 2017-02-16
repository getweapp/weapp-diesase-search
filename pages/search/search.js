var app = getApp()

Page({
  data: {
    focus: true,
    isHide: true,
    searchWord: "",
    diseaseItem: {},
    articleItem: {},
    diseasePageIndex: 1,
    articlePageIndex: 1,
    pageSize: 3,
    noSearchData: false,
    noSearchResult: false,
    isDisabled: false,
  },
  onLoad: function (option) {
    var that = this;
    var backNum = 0;
    if (option.q != null) {
      that.setData({
        searchWord: option.q,
        noSearchData: true,
        focus: false,
        isHide: false
      });
      //发送请求回去初始化数据
      wx.request({
        url: app.globalData.appHost + '/GetDieaseList',
        data: { PageIndex: 1, queryStr: option.q },
        method: 'GET',
        success: function (res) {
          //如果没有相关文章
          if (res.data.total == 0) {
            if (backNum != 0) {

            } else {
              that.setData({
                noSearchResult: true,
              })
            }
          } else {
            that.setData({
              noSearchResult: false,
            })
          }
          backNum++;
          //如果成功取到相关疾病
          res.data.isShowDisease = res.data.total > 3;
          for (var i = 0; i < res.data.List.length; i++) {
            if (i == 0) {
              res.data.List[i].isHideContent = false;
              res.data.List[i].isHideDown = true;
              res.data.List[i].isHideUp = false;
            } else {
              res.data.List[i].isHideContent = true;
              res.data.List[i].isHideDown = false;
              res.data.List[i].isHideUp = true;
            }
          }
          that.setData({
            diseaseItem: res.data
          })
        },
      })
      wx.request({
        url: app.globalData.appHost + '/GetArticleList',
        data: { PageIndex: 1, queryStr: option.q },
        method: 'GET',
        success: function (res) {
          //如果没有相关文章
          if (res.data.total == 0) {
            if (backNum != 0) {

            } else {
              that.setData({
                noSearchResult: true,
              })
            }
          } else {
            that.setData({
              noSearchResult: false,
            })
          }
          backNum++;
          //如果成功取到相关文章
          res.data.isShowArticle = res.data.total > 3;
          that.setData({
            articleItem: res.data
          });

        },
      })
    }

  },

  getDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?s=' + e.currentTarget.dataset.id
    })
  },
  getMoreDisease: function (e) {
    var that = this
    wx.request({
      url: app.globalData.appHost + '/ColleagueCircle/Search/GetDieaseList',
      data: { PageIndex: ++that.data.diseasePageIndex, queryStr: that.data.searchWord },
      method: 'GET',
      success: function (res) {
        //如果成功取到相关疾病
        var pageCount = Math.ceil(res.data.total / that.data.pageSize);
        if (that.data.diseasePageIndex == pageCount) {
          //就说明到最后一页
          that.data.diseaseItem.isShowDisease = false;
        } else {
          that.data.diseaseItem.isShowDisease = true;
        }
        for (var i = 0; i < res.data.List.length; i++) {
          res.data.List[i].isHideContent = true;
          res.data.List[i].isHideDown = false;
          res.data.List[i].isHideUp = true;
        }
        that.data.diseaseItem.List.push(...res.data.List);
        that.setData({
          diseaseItem: that.data.diseaseItem
        })
      },
    })
  },
  getMoreArticle: function (e) {
    var that = this
    wx.request({
      url: app.globalData.appHost + '/GetArticleList',
      data: { PageIndex: ++that.data.articlePageIndex, queryStr: that.data.searchWord },
      method: 'GET',
      success: function (res) {
        //如果成功取到相关疾病
        var pageCount = Math.ceil(res.data.total / that.data.pageSize);
        if (that.data.articlePageIndex == pageCount) {
          //就说明到最后一页
          that.data.articleItem.isShowArticle = false;
        } else {
          that.data.articleItem.isShowArticle = true;
        }
        that.data.articleItem.List.push(...res.data.List);
        that.setData({
          articleItem: that.data.articleItem
        })
      },
    })
  },
  excuteSearch: function (e) {
    var that = this;
    var backNum = 0;
    //清空上次的search结果
    that.setData({
      noSearchResult: false,
    })

    if (that.data.searchWord == "") {
      //清除上次搜索结果
      that.setData({
        searchWord: "",
        diseaseItem: {},
        articleItem: {},
        diseasePageIndex: 1,
        articlePageIndex: 1,
        noSearchData: false
      })
      wx.showToast({
        title: '请先输入关键字',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
      return false;
    }

    //发送请求回去初始化数据
    wx.request({
      url: app.globalData.appHost + '/GetDieaseList',
      data: { PageIndex: 1, queryStr: that.data.searchWord },
      method: 'GET',
      success: function (res) {
        //如果没有相关文章
        if (res.data.total == 0) {
          if (backNum != 0) {

          } else {
            that.setData({
              noSearchResult: true,
            })
          }
        } else {
          that.setData({
            noSearchResult: false,
          })
        }
        backNum++;
        //如果成功取到相关疾病
        res.data.isShowDisease = res.data.total > 3;
        //循环赋值 
        for (var i = 0; i < res.data.List.length; i++) {
          if (i == 0) {
            res.data.List[i].isHideContent = false;
            res.data.List[i].isHideDown = true;
            res.data.List[i].isHideUp = false;
          } else {
            res.data.List[i].isHideContent = true;
            res.data.List[i].isHideDown = false;
            res.data.List[i].isHideUp = true;
          }
        }
        that.setData({
          diseaseItem: res.data,
        })
      },
    })
    wx.request({
      url: app.globalData.appHost + '/GetArticleList',
      data: { PageIndex: 1, queryStr: that.data.searchWord },
      method: 'GET',
      success: function (res) {
        //如果没有相关文章
        if (res.data.total == 0) {
          if (backNum != 0) {

          } else {
            that.setData({
              noSearchResult: true,
            })
          }
        } else {
          that.setData({
            noSearchResult: false,
          })
        }
        backNum++;
        //如果成功取到相关文章
        res.data.isShowArticle = res.data.total > 3;
        that.setData({
          articleItem: res.data
        });
      },
    })
  },
  inputHandler: function (e) {
    this.setData({
      searchWord: e.detail.value
    })
    if (this.data.searchWord != "") {
      this.setData({
        isHide: false
      })
    } else {
      this.setData({
        isHide: true
      })
    }
  },
  focusHandler: function (e) {
    if (this.data.searchWord != "") {
      this.setData({
        isHide: false
      })
    }
  },
  blurHandler: function (e) {
    if (this.data.searchWord == "") {
      this.setData({
        isHide: true
      })
    }
  },
  clearInput: function (e) {
    if (this.data.searchWord != "") {
      this.setData({
        isHide: true,
        focus: false,
        searchWord: ""
      })
    }
  },
  rollUp: function (e) {
    var sub = e.currentTarget.dataset.sub;
    //变化当前item
    if (this.data.diseaseItem.List.length > 0) {
      this.data.diseaseItem.List[sub].isHideContent = true;
      this.data.diseaseItem.List[sub].isHideUp = true;
      this.data.diseaseItem.List[sub].isHideDown = false;
    }
    this.setData({
      diseaseItem: this.data.diseaseItem
    })

  },
  rollDown: function (e) {
    var sub = e.currentTarget.dataset.sub;
    //变化当前item
    if (this.data.diseaseItem.List.length > 0) {
      this.data.diseaseItem.List[sub].isHideContent = false;
      this.data.diseaseItem.List[sub].isHideUp = false;
      this.data.diseaseItem.List[sub].isHideDown = true;
    }
    this.setData({
      diseaseItem: this.data.diseaseItem
    })
  }
})