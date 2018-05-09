/**
 * @description 资讯订阅与退订客户列表查询接口
 * @author baojiajia
 */
exports.response = function (req, res) {
  return{
    "code": "0",
        "msg": "OK",
        "resultData": [
             {
                 "id": "1-10YMTEM",
                 "custName": "1-10YMTEM",
                 "custEcom": "02034039",
                 "riskLevel": "704020",
                 "custType": "per",
                 "riskLevelLabel": "稳健型",
                 "orgId": "ZZ001041051"
            }
       ]
  };
};
