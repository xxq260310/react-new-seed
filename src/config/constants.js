/**
 * @file config/constants.js
 *  一些系统常量定义
 * @author maoquan(maoquan@htsc.com)
 */

export default {
  container: '.react-app',
  logoText: '华泰证券',
  version: '1.6.2',
  boardId: 1,
  boardType: 'TYPE_TGJX',
  historyBoardId: 3,
  historyBoardType: 'TYPE_LSDB_TGJX',
  apiPrefix: '/fspa/mcrm/api',
  fspPrefix: '/fsp',
  inHTSCDomain: location.hostname.indexOf('htsc.com.cn') > -1,
  jingZongLevel: '1', // 经总的level值
  filialeLevel: '2', // 分公司的level值
  hbgxSummaryType: 'hbgx', // 汇总方式（汇报关系）
  jxstSummaryType: 'jxst', // 汇总方式（绩效视图）
  enableLocalStorage: true, // 是否打开本地缓存
};
