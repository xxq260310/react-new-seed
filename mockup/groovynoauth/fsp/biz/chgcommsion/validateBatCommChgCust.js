/**
 * @description 校验客户是否可以调整
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '402',
    msg: '客户没有有效的风险测评，不允许进行佣金调整！',
    resultData: null,
  };
};
