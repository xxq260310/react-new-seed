/**
 * @description 查询某一个看板的信息
 */

exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
        "id": 976,
        "name": "都是",
        "boardType": "TYPE_TGJX",
        "boardTypeDesc": "投顾绩效",
        "boardStatusDesc": "未发布",
        "description": null,
        "ownerOrgId": "ZZ001041",
        "boardStatus": "UNRELEASE",
        "createTime": "2017-08-03 11:12:27",
        "updateTime": "2017-08-03 11:12:40",
        "pubTime": null,
        "isEditable": "Y",
        "orgModel": [
            {
                "id": "ZZ001041",
                "name": "经纪及财富管理部",
                "level": "1",
                "pid": "ZZ001",
                "pname": "华泰证券股份有限公司",
                "children": null
            }
        ],
        "summury": [
            {
                "key": "hignCustInfoCompletePercent",
                "name": "客户信息完备率",
                "value": null,
                "unit": "%",
                "description": "信息完善率得分*50%+信息真实性得分*50%",
                "categoryKey": null,
                "isBelongsSummury": null,
                "hasChildren": null,
                "parentKey": null,
                "parentName": null,
                "children": null,
                "isAggressive": "1"
            },
            {
                "key": "gjTranAmt",
                "name": "股基交易量",
                "value": null,
                "unit": "元",
                "description": "统计期间内股基交易量",
                "categoryKey": null,
                "isBelongsSummury": null,
                "hasChildren": null,
                "parentKey": null,
                "parentName": null,
                "children": null,
                "isAggressive": "2"
            },
            {
                "key": "platformSignAvgAmt",
                "name": "平台人均登录次数",
                "value": null,
                "unit": "次",
                "description": "投顾在统计期内登录总次数/投顾总人数",
                "categoryKey": null,
                "isBelongsSummury": null,
                "hasChildren": null,
                "parentKey": null,
                "parentName": null,
                "children": null,
                "isAggressive": "3"
            }
        ],
        "detail": null
    }
}
};
