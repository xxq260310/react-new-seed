/**
 * @Author: sunweibin
 * @Date: 2018-03-26 14:50:34
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-26 14:51:05
 * @description 判断两个日期是否a在b后
 */

import moment from 'moment';

import isBeforeDay from './isBeforeDay';
import isSameDay from './isSameDay';

export default function isAfterDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b) && !isSameDay(a, b);
}
