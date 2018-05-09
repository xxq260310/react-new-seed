import _ from 'lodash';
import { permission, env as envHelper } from '../../helper';
import {
  EXECUTOR,
  INITIATOR,
  CONTROLLER,
  chooseMissionView,
} from './config';

const getViewInfo = (missionViewType = '') => {
  // 任务管理权限
  const hasPermissionOfManagerView = permission.hasPermissionOfManagerView();
  // 如果当前用户有职责权限并且url上没有当前视图类型，默认显示管理者视图
  let currentViewType = '';
  let missionViewList = chooseMissionView;
  // 默认不展示执行者视图与管理者视图的入口
  if (envHelper.isGrayFlag()) {
    // 支持灰度发布，则展示执行者视图与管理者视图的入口
    // 然后根据权限来，到底需不需要展示管理者视图的入口
    if (!hasPermissionOfManagerView) {
      // 没有管理者视图查看权限
      missionViewList = _.filter(chooseMissionView, item => item.value !== CONTROLLER);
      // 当前视图是执行者视图
      currentViewType = EXECUTOR;
    } else {
      // 当前视图是管理者视图
      currentViewType = CONTROLLER;
    }
    // 在灰度发布的权限情况下，如果当前url上有当前视图类型，则用url上的视图类型
    if (!_.isEmpty(missionViewType)) {
      currentViewType = missionViewType;
    }
  } else {
    // 默认只展示
    missionViewList = _.filter(chooseMissionView, item => item.value === INITIATOR);
    // 当前视图是创建者视图
    currentViewType = INITIATOR;
  }

  return {
    currentViewType,
    missionViewList,
  };
};

export default {
  getViewInfo,
};
