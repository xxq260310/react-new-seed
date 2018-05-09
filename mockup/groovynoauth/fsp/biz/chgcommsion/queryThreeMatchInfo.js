/**
 * @description 产品三匹配信息
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      riskRankMhrt: 'N',
      riskRankMhmsg: '该客户风险与所选产品风险不匹配',
      investProdMhrt: 'N',
      investProdMhmsg: '客户投资期限与产品投资期限不匹配',
      investTypeMhrt: 'N',
      investTypeMhmsg: '客户投资品种与产品投资品种不匹配',
      isMatch: 'Y',
    },
  };
};
