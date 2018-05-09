/**
 * @description 通用Tag组件的配置项文件
 * @author sunweibin
 */

import { permissionOptions } from '../../../config';

const status = permissionOptions.stateOptions;
const tagConfig = {};
status.forEach((item) => {
  const { value, label } = item;
  tagConfig[value.toLowerCase()] = label;
});
export default tagConfig;
