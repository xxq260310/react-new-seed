/**
 * @Author: sunweibin
 * @Date: 2017-11-22 10:13:53
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-30 17:05:18
 * @description 此处存放与时间相关的公用方法
 */
import moment from 'moment';
import _ from 'lodash';

const time = {
  /**
   * 将时间格式字符串修改为YYYY-MM-DD格式
   * @author sunweibin
   * @param {String} str 后端接口返回的时间格式字符串
   * @param {String} formatter='YYYY-MM-DD' 需要装换成的时间格式
   * @returns {String} 格式化后的时间字符串
   */
  format(str, formatter = 'YYYY-MM-DD') {
    let date = '';
    if (str) {
      date = moment(str).format(formatter);
    }
    return date;
  },

  /**
   * 获取今天是周几
   * @author sunweibin
   * @param {Number| Date} d Date对象或者是数字(0,1,2,3,4,5,6)
   */
  weekDay(d) {
    const weekLocals = ['日', '一', '二', '三', '四', '五', '六'];
    if (typeof d === 'number') return `周${weekLocals[d]}`;
    return `周${weekLocals[d.getDay()]}`;
  },

  /**
   * 根据周期字符串返回周期开始时间、结束时间、周期时间段的对象
   * @author sunweibin
   * @param {String} cycleType 周期字符串
   */
  getDurationString(cycleType, maxDataDt) {
    const fomater = 'YYYY/MM/DD';
    let durationEnd = '';
    let durationStart = '';
    const quarter = moment().quarter();
    let lastQuarter = quarter - 1;
    let year = moment().year();
    const lastYear = year - 1;
    let temp;
    if (_.isEmpty(maxDataDt)) {
      temp = moment().subtract(1, 'days');
    } else {
      temp = moment(maxDataDt, fomater);
    }
    const dateText = temp.format('YYYY/MM/DD');
    switch (cycleType) {
      case 'beforeLastMonth':
        durationStart = moment(dateText, fomater).subtract(2, 'month').startOf('month');
        durationEnd = moment(dateText, fomater).subtract(2, 'month').endOf('month');
        break;
      case 'lastMonth':
        durationStart = moment(dateText, fomater).subtract(1, 'month').startOf('month');
        durationEnd = moment(dateText, fomater).subtract(1, 'month').endOf('month');
        break;
      case 'lastQuarter':
        if (quarter <= 1) {
          year--;
          lastQuarter = 4;
        }
        durationStart = moment(moment().year(year).startOf('quarter').quarter(lastQuarter));
        durationEnd = moment(moment().year(year).endOf('quarter').quarter(lastQuarter));
        break;
      case 'lastYear':
        durationStart = moment(moment().year(lastYear).startOf('year'));
        durationEnd = moment(moment().year(lastYear).endOf('year'));
        break;
      default:
        durationStart = moment(dateText, fomater).startOf(cycleType);
        durationEnd = moment(dateText, fomater);
        break;
    }
    const duration = {
      cycleType,
      durationStr: `${durationStart.format(fomater)}-${durationEnd.format(fomater)}`,
      begin: durationStart.format('YYYYMMDD'),
      end: durationEnd.format('YYYYMMDD'),
    };
    return duration;
  },
};

export default time;
