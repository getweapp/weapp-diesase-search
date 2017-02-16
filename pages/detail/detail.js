//获取应用实例
var app = getApp()
Page({
  data: {
    article: {},
  },
  onLoad: function (option) {
    var that = this
    wx.request({
      url: app.globalData.appHost + '/GetArticleById',
      data: { id: option.s },
      method: 'GET',
      success: function (res) {
        that.setData({
          article: res.data
        })
      },
      fail:function(res){
         console.log(res.errMsg);
      }
    })
  }
})
