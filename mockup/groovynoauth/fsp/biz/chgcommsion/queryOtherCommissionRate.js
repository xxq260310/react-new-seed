/**
 * @Author: sunweibin
 * @Date: 2017-10-26 14:47:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-10-26 14:48:49
 * @desc 单佣金调整其他佣金费率选项
 */

 exports.response = function (req, res) {
   return {
    code: "0",
    msg: "OK",
    resultData: [
      {
        code: "HTSC_DBFARE_RATIO",
        options: [
          {
            id: "1-3N2CJYM",
            codeValue: "0.37",
            codeDesc: "万3.7"
          },
          {
            id: "1-3N2CJYM",
            codeValue: "0.37",
            codeDesc: "万3.7"
          }
        ]
      },
      {
        code: "HTSC_ZFARE_RATIO",
        options: [
          {
            id: "1-3N2CJYM",
            codeValue: "0.37",
            codeDesc: "万3.7"
          },
          {
            id: "1-3N2CJYM",
            codeValue: "0.37",
            codeDesc: "万3.7"
          }
        ]
      }
    ]
  };
 };
