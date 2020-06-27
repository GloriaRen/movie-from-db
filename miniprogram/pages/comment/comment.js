// pages/comment/comment.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    content: '', //评价内容
    score: 3, //评价分数
    images: [],
    fileIds: [],
    movieid: 1
  },
  getDetails: function(e) {
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: e.movieid
      }
    }).then( res => {
      this.setData({
        detail: JSON.parse(res.result)
      })
    }).catch( err => {
      console.log(err)
    })
  },
  // 监听评分变化
  onScoreChange: function(e) {
    this.setData({
      score: e.detail
    })
  },
  // 监听输入框变化
  onContentChange: function(e) {
    this.setData({
      content: e.detail
    })
  },
  uploadImg: function() {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },
  submit: function() {
    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          },
          fail: console.error
        })
      }));
    }
    Promise.all(promiseArr).then(res => {
      db.collection('comment').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieid,
          fileIds: this.data.fileIds
        }
      }).then(res => {
        wx.showToast({
          title: '数据库OK',
        })
      }).catch(err => {
        console.log(err)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: this.data.movieid
    })
    this.getDetails(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})