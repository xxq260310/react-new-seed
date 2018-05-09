/**
 * 删除看板
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: '您没有权限删除该看板或者该看板已经被删除',
  };
};