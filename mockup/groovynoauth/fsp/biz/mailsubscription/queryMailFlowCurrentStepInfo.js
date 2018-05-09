/**
 * @Author: baojiajia
 * @Date: 2017-11-10
 * @Last Modified by: baojiajia
 * @description 当前审批步骤
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      curentStep: '营业部负责人审核',
      curentUser: '王华(002332)',
    },
  };
};
