/**
 * @Author: sunweibin
 * @Date: 2017-11-22 11:14:36
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-08 16:12:48
 * @description 此处存放与url数据相关的通用方法
 */
import qs from 'query-string';

const url = {
  /**
   * 将url上的参数字符串，转化成JS对象
   * @author sunweibin
   * @param {String} search url上的参数字符串
   * @returns {Objcet}
   */
  parse(search) {
    return qs.parse(search) || {};
  },
  /**
   * 将JS对象转化成url上的参数字符串
   * @author sunweibin
   * @param {Object} query={} 需要转换成字符串的对象
   * @returns {String} 无?号的url参数字符串
   */
  stringify(query = {}) {
    return qs.stringify(query);
  },
  /**
   * 将url转化为对象
   * @param {String} url
   * @returns {Object} 包含pathname,query的对象
   */
  parseUrl(inputUrl = '') {
    const match = /([^?]*)\?(.*)/.exec(inputUrl);
    const pathname = match[1];
    const query = this.parse(match[2]);
    return {
      pathname,
      query,
    };
  },
  /**
   * 检查当前页面路径是否匹配指定路径的子路由
   * @author xuxiaoqin
   * @param {String} route 当前子路由
   * @param {String} pathname 当前页面路径
   */
  matchRoute(route, pathname) {
    return RegExp(route).test(pathname);
  },
};

export default url;
