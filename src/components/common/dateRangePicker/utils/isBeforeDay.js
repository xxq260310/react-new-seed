/**
 * @Author: sunweibin
 * @Date: 2018-03-26 14:47:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-26 14:49:37
 * @description 判断两个日期是否a在b前
 */

import moment from 'moment';

export default function isBeforeDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

  const aYear = a.year();
  const aMonth = a.month();

  const bYear = b.year();
  const bMonth = b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) return a.date() < b.date();
  if (isSameYear) return aMonth < bMonth;
  return aYear < bYear;
}
