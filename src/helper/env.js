/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:03:01
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-22 09:08:20
 * @description 此文件用于存放与操作系统，生产/开发环境，浏览器，使用框架相关的公用方法
 */
import bowser from 'bowser';
import qs from 'query-string';
import { constants, fspContainer } from '../config';

const env = {
  /**
   * 获取当前操作系统的
   * @author sunweibin
   * @param {null}
   * @returns {string}
   */
  getOS() {
    const osList = ['mac', 'windows', 'windowsphone'];
    for (let i = 0, len = osList.length; i < len; i++) {
      const os = osList[i];
      if (bowser[os]) {
        return os;
      }
    }
    return 'unknown';
  },
  /**
   * 获取环境信息
   * @returns {Object}
   * $app_version 字符串 应用的版本
   * $os 字符串 操作系统，例如iOS
   * $screen_height  数值  屏幕高度，例如1920
   * $screen_width 数值  屏幕宽度，例如1080
   * $browser  字符串 浏览器名，例如Chrome
   * $browser_version  字符串 浏览器版本，例如Chrome 45
   */
  getEnv() {
    return {
      $app_version: constants.version,
      $os: env.getOS(),
      $screen_width: screen.width,
      $screen_height: screen.height,
      $browser: bowser.name,
      $browser_version: `${bowser.name} ${bowser.version}`,
    };
  },

  /**
   * 获取Fsp容器
   */
  getFspContainer() {
    return document.querySelector(fspContainer.container);
  },
  /**
   * 判断当前页面是否在FSP系统下
   * @author sunweibin
   * @returns {Boolean}
   */
  isInFsp() {
    const fsp = document.querySelector(fspContainer.container);
    return !!fsp;
  },
  /**
   * 判断当前页面是否在React框架系统下
   * @author sunweibin
   * @returns {Boolean}
   */
  isInReact() {
    const rc = document.querySelector('#react-content');
    return !!rc;
  },
  /**
   * 判断当前浏览器是否IE
   * @author sunweibin
   * @returns {Boolean}
   */
  isIE() {
    return bowser.name === 'Internet Explorer';
  },
  /**
   * 判断当前浏览器是否Chrome
   * @author sunweibin
   * @returns {Boolean}
   */
  isChrome() {
    return bowser.name === 'Chrome';
  },
  /**
   * 判断当前浏览器是否Safari
   * @author sunweibin
   * @returns {Boolean}
   */
  isSafari() {
    return bowser.name === 'Safari';
  },
  /**
   * 判断当前浏览器是否Firefox
   * @author sunweibin
   * @returns {Boolean}
   */
  isFirefox() {
    return bowser.name === 'Firefox';
  },
  /**
   * 封装一下灰度发布的标记，fsp会提供一个grayFlag在window上，
   * 本地开发的时候可以在url上通过?grayFlag=true的方式手动测试，
   * 检测当前版本是不是需要支持灰度发布，以便控制代码里面的逻辑显示、隐藏、特殊处理等
   */
  isGrayFlag() {
    const nativeQuery = qs.parse(window.location.search);
    const grayFlag = window.grayFlag === true || nativeQuery.grayFlag === 'true';
    return grayFlag;
  },
};

export default env;
