/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

// 这里毛总要注释掉，不要再更改了
hotClient.subscribe(function (event) {
  // if (event.action === 'reload') {
  //   window.location.reload()
  // }
})
