// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  // 电影列表接口 http://api.douban.com/v2/movie/in_theaters apikey=0df993c66c0c636e29ecbb5344252a4a&
  // 电影详情接口 http://api.douban.com/v2/movie/subject/id
	return rp(`http://api.douban.com/v2/movie/in_theaters?start=${event.start}&count=${event.count}`)
    .then( res => {
      console.log('云函数')
      return res
    })
    .catch( err => {
      console.log(err)
    });
}