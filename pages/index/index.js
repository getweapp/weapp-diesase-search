var app = getApp()

Page({
  data: {
    userInfo: {},
    isFail:false,
    hotList: [{ id: 1, content: "鼻炎" }, { id: 2, content: "咳嗽" }, { id: 3, content: "失眠" }, { id: 4, content: "长痘" }, { id: 5, content: "腹泻" }, { id: 6, content: "口腔溃疡" }, { id: 7, content: "皮肤干燥" }, { id: 8, content: "高血压" }],
    recommendList: []
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
    wx.request({
      url: app.globalData.appHost + '/GetArticleList',
      data: { isFresh: "yes" },
      method: 'GET',
      success: function (res) {
          that.setData({
            recommendList: res.data.List
          })
      },
      fail:function(res){
         that.setData({
           isFail:true
         })
         console.log(res.errMsg);
      }
    });
  },
  getDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?s=' + e.currentTarget.dataset.id
    })
  },
  focusHandler: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  excuteSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  excuteHotSearch:function(e){
     var sub= e.currentTarget.dataset.sub;
     var content=this.data.hotList[sub].content;
     wx.navigateTo({
      url: '../search/search?q='+ content
    })
  },
  onShareAppMessage: function () {
    return {
      title: '疾病一点搜',
      desc: '放松，愉快并便捷的了解到一些常见疾病地相关知识，做好日常预防，有助于我们健康，快乐的成长。',
      path: '/page/index/index'
    }
  }
})
