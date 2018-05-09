/**
 * @description 咨询订阅的详情接口
 * @author baojiajia
 */
exports.response = function (req, res) {
    return  {
      "code": "0",
      "msg": "OK",
      "resultData": {
        "orderId": "12332",
        "flowCode": "2322",
        "operationType": "资讯订阅",
        "workFlowName": "资讯订阅子流程",
        "workFlowNumber":"34445",
        "nextProcessLogin": "11111",
        "prodCode": "22222",
        "status": "已完成",
        "divisionId": "0122340",
        "divisionName": "长江路营业部",
        "createdBy": "33333",
        "lastUpdBy": "2222222",
        "createdByName": "张三",
        "createdByLogin": "002333",
        "created": "2017/10/17",
        "custNum": "022223",
        "custName": "王五",
        "serviceDivisionName": "长江路服务营业部",
        "serviceManager": "李四",
        "serviceManagerLogin": "002332",
        "custLevel": "钻石卡",
        "openDivisinoName": "南京长江路服务营业部",
        "state": "江苏省",
        "city": "南京市",
        "currentCommission": "0.1",
        "newCommission": "0.2",
        "zqCommission": null,
        "stkCommission": null,
        "creditCommission": null,
        "ddCommission": null,
        "hCommission": null,
        "dzCommission": null,
        "coCommission": null,
        "stbCommission": null,
        "oCommission": null,
        "doCommission": null,
        "hkCommission": null,
        "bgCommission": null,
        "qCommission": null,
        "dqCommission": null,
        "opCommission": null,
        "dCommission": null,
        "comments": "这里是备注备注备注",
        "attachmentNum": null,
        "item": [
          {
            "prodCode": "SPDK04",
            "aliasName": "前端测试产品",
            "prodCommission": "0.3",
            "riskMatch": "Y",
            "prodMatch": "N",
            "termMatch": "N",
            "agrType": "1001",
            "subItem": [
            {
              "prodCode": "SPDK041",
              "aliasName": "前端测试子产品",
              "prodCommission": "0.3",
              "riskMatch": "Y",
              "prodMatch": "N",
              "termMatch": "N",
              "agrType": "1001",
              "subItem": null
              }
            ]
          }
        ]
      }
    };
};