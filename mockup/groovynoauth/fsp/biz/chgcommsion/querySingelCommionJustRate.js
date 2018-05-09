/**
 * @description 根据用户输入的值查询相关的目标股基佣金率码值
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        id: '1-3N2CJYM',
        codeValue: '0.37',
        codeDesc: '万3.7',
        codeType: '新佣金率',
        code: 'HTSC_COMMISSION_LEVEL',
      },
    ],
  };
};
