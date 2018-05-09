/**
 * @file config/fspRoutes.js
 *  路由和請求的url之間的映射表
 * @author zhufeiyang
 */

/**
 * 由于要嵌入fsp页面，原fsp页面代码的调用参数只与url相关，
 * 但是在react中，需要与path进行关联，从而跳转新的页面
 * 所以设置这个映射表，根据fsp的url，映射相应的react框架的path
 * 次级导航菜单涉及到的fsp页面非常多，所以不在这里配置，而是直接复用后端的数据
 */
const fspRoutes = [
  // 跳回首页
  {
    path: '/customerPool',
    action: '',
    url: '/homepage', // url属性可以为string类型，或者为RegExp类型，从而方便匹配
  },
  // MOT任务相关
  {
    path: '/fsp/motTask',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_TASK_MANAGE',
    url: '/mot/manage/showMotTaskSubTabWin?taskType=MOT',
  },
  {
    path: '/fsp/motTaskHandle',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_TASK_HANDLE',
    url: '/mot/manage/showHandle',
  },
  // 服务记录管理
  {
    path: '/fsp/taskCenter/serviceManage',
    action: 'loadInTab',
    containerId: 'FSP_MOT_TAB_SERVICELIST',
    url: '/mot/service/showList',
  },
  // 投顾签约
  {
    path: '/fsp/investContract',
    action: 'loadInTab',
    containerId: 'FSP_TGINVEST_LIST_TAB',
    url: '/tgcontract/list/listContent',
  },
  // 投顾签约向导
  {
    path: '/fsp/contractWizard',
    action: 'loadInTab',
    containerId: 'utb-stockcontract-wizard',
    url: '/client/investcontract/wizard/',
  },
  // 佣金调整向导
  {
    path: '/fsp/serviceOrderingWizard',
    action: 'loadInTab',
    url: '/client/serviceOrdering/wizard/',
  },
  // 客户管理
  {
    path: '/fsp/customerCenter/customerManage',
    action: 'loadInTab',
    containerId: 'FSP_CUST_TAB_CENTER_MANAGE', // 外层容器id
    url: '/customer/manage/showCustManageTabWin',
  },
  // 客户360
  {
    path: '/fsp/customerCenter/customer360',
    action: 'loadInTab',
    containerId: 'FSP_360VIEW_M_TAB',
    url: '/customerCenter/360/',
  },
  // 合约详情
  {
    path: '/fsp/customerCenter/360OrderDetail',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=orderDetail)/,
  },
  // 合约历史记录
  {
    path: '/fsp/customerCenter/360orderHisDetail',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=orderHisDetail)/,
  },
  // 佣金查询
  {
    path: '/fsp/customerCenter/toCommission',
    action: 'loadInTab',
    url: /\/customerCenter\/360\/.+(?=toCommission)/,
  },
  // 消息中心
  {
    path: '/fsp/messageCenter',
    action: 'loadInTab',
    url: '/messgeCenter',
  },
  // 产品中心
  {
    path: '/fsp/productCenter/productPool',
    action: 'loadInTab',
    url: '/product/pool/selectProduct',
  },
  {
    path: '/fsp/productCenter/salesCalendar',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_sales_calendar.do?clientType=crm',
  },
  {
    path: '/fsp/productCenter/financeProducts',
    action: 'loadInIframe',
    url: '/htsc-product-base/product_search_currency.do?clientType=crm&special_enter=1',
  },
  // 投诉工单管理
  {
    path: '/fsp/serviceCenter/custcomplaint',
    action: 'loadInTab',
    containerId: 'FSP_CUST_COMPLAINT_MANGER',
    url: '/custcomplaint/manage/listContent',
  },
  // 资产配置明细
  {
    path: '/fsp/implementation/initsee',
    action: 'loadInTab',
    url: '/asset/implementation/initsee',
  },
  // 资产配置向导
  {
    path: '/fsp/implementation/wizard',
    action: 'loadInTab',
    url: '/asset/implementation/wizard/main',
  },
  // 工单投诉信息
  {
    path: '/fsp/serviceCenter/complaintInfo',
    action: 'loadInTab',
    url: '/custcomplaint/manage/viewCustComplaintInfo',
  },
  // 资产配置实施
  {
    path: '/fsp/serviceCenter/asset/implementation',
    action: 'loadInTab',
    containerId: 'FSP_ASSET_ALLOCATION',
    url: '/asset/implementation/main',
  },
  // 资产配置模板
  {
    path: '/fsp/serviceCenter/asset/basis',
    action: 'loadInTab',
    url: '/asset/basis/mainTab',
  },
  // 资讯中心
  {
    path: '/fsp/strategyCenter/informationCenter',
    action: 'loadInIframe',
    url: '/jeip/psso/htscsso.jsp?biz_sys_key=zxzx',
  },
];

export default fspRoutes;

