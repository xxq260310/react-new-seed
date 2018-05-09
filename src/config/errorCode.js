/**
 * @description 后台请求返回的code码含义
 * @author sunweibin
 */

// 所有Code含义
const responseCode = {
  SUCCESS: '0',
  DUPLICATE_NAME: '-2',
};
// 需要排除全局捕获的code
const excludeCode = [
  {
    code: '0',
    message: '请求成功',
  },
  {
    code: '-2',
    message: '看板名称重复',
  },
];

export default { responseCode, excludeCode };
