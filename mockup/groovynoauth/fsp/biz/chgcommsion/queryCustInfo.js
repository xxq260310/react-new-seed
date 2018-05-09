/**
 * @description 单佣金调整页面 客户查询
 * @author baojiajia
 */

exports.response = function (req, res) {
    return  {
      "code": "0",
      "msg": "OK",
      "resultData": {
        "custInfo":[
          {
            "id": "x-1111", //用户rowid
            "custName": "张三",
            "custEcon": "899999999",
            "riskLevel": "稳健性",
            "memberId": "1-1000UE5"
          },
          {
            "id": "x-2222", //用户rowid
            "custName": "李四",
            "custEcon": "8888888888",
            "riskLevel": "保守型",
            "memberId": "1-1000UE6"
          },
        ]
      }
    };
};