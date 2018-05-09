/**
 * @file config/request.js
 *  request配置文件
 * @author maoquan(maoquan@htsc.com)
 */
import { apiPrefix, fspPrefix } from './constants';

export default {
  timeout: 15000,
  // 这里的接口处理是为了调试的方便，一般情况下该标志都是false
  apiPrefix: process.env.REMOVE_PREFIX === true ? '/mcrm/api' : apiPrefix,
  fspPrefix,
  prefix: process.env.REMOVE_PREFIX === true ? '/mcrm/api' : '/fspa/mcrm/api',
  ERROR_SEPARATOR: '$%^#%^#$^%#%$#',
};
