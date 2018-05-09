/**
 * @Author: sunweibin
 * @Date: 2018-03-26 14:51:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-26 14:52:08
 * @description 判断是否同一天
 */

import moment from 'moment';

export default function isSameDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return a.date() === b.date() &&
    a.month() === b.month() &&
    a.year() === b.year();
}
