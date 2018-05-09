// 目标客户池的一些常量配置

/**
 * NOPERMIT = 0 表示当前用户没有目标客户池的权限
 * PERMITS1 = 1 表示当前用户有 ‘HTSC任务管理岗’，‘HTSC 首页指标查询’
 */
const NOPERMIT = 0;
const PERMITS1 = 1;

/**
 * 根据权限判断传给后端的custType的值
 */
// 客户经理
const CUST_MANAGER = '1';
// 组织机构
const ORG = '3';

// 主服务经理id，用于url和custrange组件中，不传给后端
const MAIN_MAGEGER_ID = 'msm';
// 列表页主服务经理组件中下拉列表 ‘所有’ 选项的id
const ALL_DEPARTMENT_ID = 'all';

// 根据不同的url中source的值，传给后端enterType值不同
const ENTER_TYPE = {
  search: 'searchCustPool',
  tag: 'searchCustPool',
  association: 'searchCustPool',
  business: 'businessCustPool',
  custIndicator: 'performanceCustPool',
  numOfCustOpened: 'performanceCustPool',
  sightingTelescope: 'labelSearchCustPool',
};

// 任务管理岗权限作用的首页入口列表
const ENTERLIST1 = ['search', 'tag', 'sightingTelescope', 'association', 'business'];
// 首页指标查询权限作用的首页入口列表
const ENTERLIST2 = ['custIndicator', 'numOfCustOpened'];

export default {
  NOPERMIT,
  PERMITS1,
  CUST_MANAGER,
  ORG,
  MAIN_MAGEGER_ID,
  ENTER_TYPE,
  ENTERLIST1,
  ENTERLIST2,
  ALL_DEPARTMENT_ID,
};
