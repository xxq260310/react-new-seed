/**
 * @Author: sunweibin
 * @Date: 2017-10-25 11:00:55
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-10-25 11:08:17
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
