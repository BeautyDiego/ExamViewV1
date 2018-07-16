/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = 'http://localhost:24344'
let frontWebUrl = 'http://localhost:8080'

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://112.74.42.29:8211'
  frontWebUrl = 'http://112.74.42.29:8210'
}


export {
  frontWebUrl,
  baseUrl
}
