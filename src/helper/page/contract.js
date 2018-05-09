/**
 * @Author: sunweibin
 * @Date: 2017-11-28 09:53:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-23 09:59:23
 * @description 此处存放合作合约使用的辅助方法
 */
import { env, permission } from '../../helper';

const contract = {
  // 检测合作合约项目，当前用户是否有相应的职责、职位权限
  hasPermission(empInfo) {
    let hasPermissionOnBtn = true;
    if (env.isInFsp()) {
      hasPermissionOnBtn = permission.hasPermissionOfPostion(empInfo);
    }
    return hasPermissionOnBtn;
  },
};

export default contract;
