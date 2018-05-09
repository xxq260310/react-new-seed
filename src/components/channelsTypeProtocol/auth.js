/**
 * @Author: sunweibin
 * @Date: 2018-02-27 15:58:41
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-06 17:05:43
 * @description 用来判断协议管理中是否展示某些字段
 */

const type = {
  openPermissinos: 'Open Permissions',
  openSoftware: 'Open Software',
  openSoftwareAndPermissinos: 'Open Software+Permissions',
  softwareContinued: 'Software Continued',
};

// 判断业务类型是否开通软件
function isOpenSoftware(businessType) {
  return businessType === type.openSoftware;
}

// 判断业务类型是否开通权限
function isOpenPermissions(businessType) {
  return businessType === type.openPermissinos;
}

// 是否软件续用
function isSoftwareContinued(businessType) {
  return businessType === type.softwareContinued;
}

// 是否开通软件+权限
function isSoftwareAndPermission(businessType) {
  return businessType === type.openSoftwareAndPermissinos;
}

// 是否 开通权限|开通软件+权限
function isInvolvePermission(businessType) {
  return isOpenPermissions(businessType)
    || isSoftwareAndPermission(businessType);
}

// 是否 开通软件|开通软件+权限|软件续用
function isInvolveSoftware(businessType) {
  return isOpenSoftware(businessType)
    || isSoftwareAndPermission(businessType)
    || isSoftwareContinued(businessType);
}

export default {
  isInvolvePermission,
  isInvolveSoftware,
};
