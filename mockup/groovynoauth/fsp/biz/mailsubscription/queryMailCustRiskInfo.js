/**
 * @description 资讯订阅客户列表校验接口
 * @author baojiajia
 */
exports.response = function (req, res) {
  return{
           "code": "0",
           "msg": "OK",
           "resultData": 
           {
                "riskRt": "Y",
                "investRt": "N",
                "investTerm": "N",
                "validmsg": "当前客户存在有效的或在途的佣金收费协议",
           }
    }
};
