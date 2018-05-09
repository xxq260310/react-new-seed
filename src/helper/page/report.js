/**
 * @Author: sunweibin
 * @Date: 2017-11-28 09:36:59
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 17:08:50
 * @description 此处存放用在绩效视图中的相关不能提取出通用的辅助方法
 */
import moment from 'moment';
import _ from 'lodash';
import { ZHUNICODE } from '../../config';
import isNewOrg from '../config/report';

const report = {
  /**
     * toUnit('123456', '元', 5) => {vale: 12.34, unit:'万元'}
     * @author 刘建树
     * @param  { string } str  需要转换的字符串数字
     * @param  { string } unit 单位
     * @param { number } per  以显示几位为转换依据，默认 5 位
     * @param { bool } isCommissionRate  对佣金率指标作特殊处理
     * @returns {Object} obj
     * @returns {String} obj.value
     * @returns {String} obj.unit
  */
  toUnit(value, unit, per = 5, isCommissionRate) {
    const PERCENT = ZHUNICODE.PERCENT;
    const PERMILLAGE = ZHUNICODE.PERMILLAGE;
    const obj = {};
    let minus = '';
    // 如果 value 有值
    if (value) {
      if (value === 'null') {
        // value 没值
        obj.value = '暂无';
        obj.unit = '';
      } else {
        let newValue = Number(value);
        // 如果 newValue 是负数
        if (newValue < 0) {
          minus = '-';
          newValue = Math.abs(newValue);
        }
        // 如果 value 的值是 0
        if (newValue === 0) {
          obj.value = newValue;
          obj.unit = unit;
        } else if (newValue < 1) {
          // 如果 value 的值小于 0
          // 如果 单位是 %
          obj.unit = unit;
          if (unit === PERCENT) {
            obj.value = Number.parseFloat((newValue * 100).toFixed(isCommissionRate ? 3 : 2));
          } else if (unit === PERMILLAGE) {
            // 如果是 千分符
            obj.value = Number.parseFloat((newValue * 1000).toFixed(isCommissionRate ? 3 : 2));
          } else {
            // 其他情况均保留两位小数
            obj.value = Number.parseFloat(newValue.toFixed(2));
          }
        } else {
          // 分割成数组
          const arr = newValue.toString().split('.');
          // 取出整数部分长度
          const length = arr[0].length;
          // 整数部分大于等于 依据 长度
          if (length >= per) {
            // 按照依据长度取出 依据 数字，超出长度以 0 补足
            const num = arr[0].substr(0, per) + arr[0].substr(per).replace(/\d/g, '0');
            switch (true) {
              case length < 9:
                obj.value = `${Number.parseFloat((num / 10000).toFixed(2))}`;
                obj.unit = `万${unit}`;
                break;
              case length >= 9 && length < 13:
                obj.value = `${Number.parseFloat((num / 100000000).toFixed(2))}`;
                obj.unit = `亿${unit}`;
                break;
              default:
                obj.value = `${Number.parseFloat((num / 1000000000000).toFixed(2))}`;
                obj.unit = `万亿${unit}`;
                break;
            }
          } else {
            // 计算小数部分长度
            // 如果有小数，小数部分取 依据 长度减整数部分长度
            let tempValue;
            if (arr[1]) {
              // 数组中的两个值长度相加
              const allLength = arr[0].length + arr[1].length;
              // 计算出需要裁剪的长度，如果大于需要的长度
              if (allLength >= per) {
                const floatIndex = allLength - per;
                arr[1] = arr[1].substr(0, floatIndex);
              } else {
                arr[1] = arr[1].substr(0, 2);
              }
              const tempStr = arr.join('.');
              tempValue = Number.parseFloat(Number(_.trimEnd(tempStr, '.')).toFixed(2));
              tempValue = tempValue === 0.00 ? 0 : tempValue;
            }
            obj.value = tempValue || newValue;
            obj.unit = unit;
          }
        }
      }
      obj.value = minus ? `${minus}${obj.value}` : obj.value;
    } else {
      // value 没值
      obj.value = '暂无';
      obj.unit = '';
    }
    return obj;
  },

  /**
   * 根据起始、结束、时间段获取环比时间段对象
   * @param {String} begin 开始时间
   * @param {String} end 结束时间
   * @param {String} duration 时间段字符串
   * @returns {Object}
   */
  getMoMDuration(begin, end, duration) {
    let tempDuration;
    if (duration === 'month' || duration === 'lastMonth') {
      tempDuration = 'month';
    } else if (duration === 'quarter' || duration === 'lastQuarter') {
      tempDuration = 'quarter';
    } else if (duration === 'year' || duration === 'lastYear') {
      tempDuration = 'year';
    } else {
      tempDuration = null;
    }
    let lastBeginMoment;
    let lastEndMoment;
    let lastDurationStr;
    if (tempDuration) {
      lastBeginMoment = moment(begin).subtract(1, tempDuration);
      lastEndMoment = moment(end).subtract(1, tempDuration);
      lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;
    } else {
      console.warn('用户自己选择的时间段');
    }

    const compareDuration = {
      durationStr: lastDurationStr,
      begin: lastBeginMoment,
      end: lastEndMoment,
    };
    return compareDuration;
  },

  /**
   * 判断是否是新的组织机构(包含财富中心层级)
   * @param {String} orgId 组织机构的orgId
   * @returns {bool}
   */
  isNewOrg(orgId) {
    return _.includes(isNewOrg, orgId);
  },
};

export default report;
