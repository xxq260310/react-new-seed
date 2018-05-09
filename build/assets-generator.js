/**
 * @file build/assets-generator.js
 *  生成外部依赖用到的js文件，文件包含引用的css / js路径
 * @author maoquan(maoquan@htsc.com)
 */
require('shelljs/global');

var path = require('path');
var config = require('../config');

const URL_CONFIG = {
  sit: 'http://192.168.71.26:9082',
  uat: 'http://192.168.71.29:9082',
  sandbox: 'https://crm.htsc.com.cn:2443',
  online: 'https://crm.htsc.com.cn:1443'
};

var assetsRoot = config.build.assetsRoot;

// 生成chcp配置文件的路径
var assetsPath = path.join(assetsRoot, 'assets.js');

// /fspa/static/js/app.80c9a4be20138c8ebf6f.js --> app
function getName(asset) {
  return asset.slice(asset.lastIndexOf('/') + 1, asset.indexOf('.'));
}

function getPriority(asset) {
  var priority = {
    manifest: 0,
    vendor: 1,
    app: 2
  };
  return priority[getName(asset)];
}

function suffix(asset) {
  return asset.slice(asset.lastIndexOf('.') + 1);
}

module.exports = function (assets) {

  assets.sort(
    function (a, b) {
      if (suffix(a) === 'css') {
        return -1;
      }
      return getPriority(a) < getPriority(b) ? -1 : 1;
    }
  );

  var html = assets.map(
    function (asset) {
      var suffix = asset.slice(asset.lastIndexOf('.') + 1);
      if (suffix === 'css') {
        return 'document.writeln("<link href=' + asset + '  rel=stylesheet>");'
      } else if (suffix === 'js') {
        return 'document.writeln("<script type=text/javascript src=' + asset + ' defer></script>");'
      }
      return '';
    }
  )
  ShellString(html).to(assetsPath);
};
