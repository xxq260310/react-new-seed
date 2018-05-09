/**
 * @Author: sunweibin
 * @Date: 2017-11-02 13:38:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-03 10:14:48
 * @description 客户校验接口
 */

 exports.response = function (req, res) {
   return {
    code: "0",
    msg: "OK",
    resultData: {
      riskRt: "Y", // 风险测评是否有效 Y 有效 N 无效 要进行提示 需提醒 “客户风险测评已过期，需更新风险测评！”
      investRt: "N", // 偏好产品是否为空  Y 为空 进行提示    (【该客户投资偏好信息缺失，先请客户补齐信息】)
      investTerm: "N",  // 投资期限是否为空 Y 为空  进行提示 【该客户投资期限信息缺失，先请客户补齐信息】、
      hasorder: "N", // 是否有在途订单  包括投顾签约 和 佣金调整 Y 要提示 validmsg
      validmsg: "", // 错误信息
      openRzrq: "Y", // 是否开通两融业务
      lowerRisk: "N", // 是否最低风险类别
    },
   };
 };
