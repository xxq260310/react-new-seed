/**
 * @Author: sunweibin
 * @Date: 2018-01-02 15:54:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-22 13:57:14
 * @description 存放与组织机构树相关的方法函数
 */
import config from './config/org';

const org = {
  /**
   * 判断一个组织不猛是否分公司
   * @param {String} level 组织结构级别字符串
   */
  isFiliale(level) {
    return level === config.FILIALE_LEVEL;
  },

  /**
   * 判断当前登录人部门是否是经总
   * @author Wangjunjun
   * @returns {Boolean}
   */
  isManagementHeadquarters(orgId) {
    return orgId === config.MANAGEMENTHEADQUARTERS_ORGID;
  },
};

export default org;
