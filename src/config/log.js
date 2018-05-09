/**
 * @file config/log.js
 *  神策数据收集相关配置
 * @author maoquan(maoquan@htsc.com)
 */

import constants from './constants';

const EVENT_PROFILE_ACTION = 'sendProfile';

const config = {
  url: '/fspa/log/sa',
  interval: 1 * 60 * 1000,
  // 开启日志监控
  enable: true,
  projectName: constants.inHTSCDomain ? 'FSP_2' : 'DEV_TEST',
  blacklist: [
    '@@DVA_LOADING/HIDE',
    '@@DVA_LOADING/SHOW',
    '@@HT_LOADING/SHOW_ACTIVITY_INDICATOR',
    '@@HT_LOADING/HIDE_ACTIVITY_INDICATOR',
    'persist/REHYDRATE',
  ],
  whitelist: [
    // 点击日志
    /\/?click/,
    // profile_set
    EVENT_PROFILE_ACTION,
    // 路由变化
    /LOCATION_CHANGE/,
    // 按钮点击
    'ButtonClick',
    // 下拉选择
    'DropdownSelect',
    // 日期选择
    'CalendarSelect',
    // 查看列表项
    'ViewItem',
    // 下钻
    'DrillDown',
    // 其他可点击元素
    'Click',
    // 手动发送页面浏览
    '$pageview',
  ],
  eventPropertyMap: {
    // 页面pv
    '@@router/LOCATION_CHANGE': {
      values: [
        'pathname',
        'search',
      ],
    },
  },
  // 神策系统保留属性，未避免冲突，对这些属性+后缀处理
  // 如 time ==> time_0
  mapFiledList: [
    'time',
    'date',
    'datetime',
    'distinct_id',
    'event',
    'events',
    'first_id',
    'id',
    'original_id',
    'device_id',
    'properties',
    'second_id',
    'time',
    'user_id',
    'users',
  ],
  // 发送profile_set的action名称
  EVENT_PROFILE_ACTION,
};

export default config;
