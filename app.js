App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onError: function(msg) {
    console.log(msg)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          if (code) {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                var user = res.userInfo;
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                var {nickName, avatarUrl, gender, province, city, country} = user;
                //console.log("nickName:" + nickName +"<br/>gender"+gender);
                var params = {
                  'code': code,
                  'user': user,
                  'encryptedData': encryptedData,
                  'iv': iv
                }
                /*wx.request({
                  url: 'localhost:24829/news/AEPCForm/GetUserOpenId',
                  data: params,
                  method: 'Post', 
                  success: function(res){
                      if( res!=null){ 
                        var appid="wxcd1a38830472734d";
                        var sessionkey=res.session_key;
                        var pc = new WXBizDataCrypt(appId, sessionKey)
                        var data = pc.decryptData(encryptedData , iv)
                        console.log('解密后 data: ', data)
                      }else{
                          console.log('获取用户登录态失败！' + res.errMsg)
                      }
                  }
                })*/
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    appHost: "https://api.getweapp.com/vendor/zainot"
  }
})