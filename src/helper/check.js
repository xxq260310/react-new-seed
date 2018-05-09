/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:17:50
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-22 15:08:38
 * @description 此处存放与校验相关的公用方法(非直接与正则表达式相关)
 */
import reg from './regexp';

const check = {
  /**
   * 判断单个字符是否中文
   * @author sunweiibin
   * @param {String} char 需要进行判断的单个字符
   * @returns {Boolean}
   */
  isChinese(char) {
    return reg.chinese.test(char);
  },
  /**
   * 判断一个值是否为空，null || undefined || 'null' || ''
   * @author sunweibin
   * @param {*} v 传递的值
   * @returns {Boolean}
   */
  isNull(v) {
    if (v === null || v === 'null' || v === '' || v === undefined || v === 'undefined') {
      return true;
    }
    return false;
  },
  /**
   * 判断一个字符串是否手机号码
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isCellPhone(v) {
    return reg.cellPhone.test(v);
  },
  /**
   * 判断一个字符串是否座机
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isTelPhone(v) {
    return reg.tellPhone.test(v);
  },
  /**
   * 判断一个字符串是否电子邮箱
   * @author sunweibin
   * @param {String} v 要验证的字符串
   */
  isEmail(v) {
    return reg.email.test(v);
  },
};

export default check;
