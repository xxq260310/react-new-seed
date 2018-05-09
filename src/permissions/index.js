/**
 * @file permissions/index.js
 *  给组件添加相应权限
 * @author maoquan(maoquan@htsc.com)
 */

import _ from 'lodash';

import Permissionable from './Permissionable';

const PERMISSION_CUSTOMER_BOARD = '1-4EVCDEQ';

let store = {
  getState: () => {},
};

const getCheckList = (options) => {
  if (_.isArray(options)) {
    return [...options];
  } else if (_.isObject(options)) {
    return options.checkList;
  } else if (_.isString(options)) {
    return [options];
  }
  return [];
};

const checkPermission = (checkList) => {
  const state = store.getState();
  const permissions = _.map(state.app.empInfo.empRespList, item => item.respId);
  const passed = _.intersection(permissions, getCheckList(checkList));
  return !_.isEmpty(passed);
};

export default {
  init(appStore) {
    store = appStore;
  },
};

// 首页指标权限，定制看板菜单
// Usage: const XXButton = HomeIndicatorWritable(Button)
//  => <XXButton /> 等于带权限控制的Button，
//  只有拥有`PERMISSION_CUSTOMER_BOARD`权限, Button才会展现
export const HomeIndicatorWritable = Permissionable(PERMISSION_CUSTOMER_BOARD);

// 是否可以定制看板
export const canCustomBoard = () => checkPermission(PERMISSION_CUSTOMER_BOARD);
