/*
 * @Author: LiuJianShu
 * @Date: 2017-10-17 15:32:07
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-17 15:32:28
 */

exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
        "flowClass": "合作合约退订申请",
        "auditors": null,
        "groupName": null,
        "loginUser": "002332",
        "appSubJect": null,
        "approverIdea": null,
        "operate": "2",
        "businessObject": null,
        "extraParam": null,
        "clearResponse": false,
        "currentNodeName": "流程发起",
        "flowId": "",
        "wobNum": null,
        "flowButtons": [
            {
                "flowClass": "合作合约退订申请",
                "operate": "commit",
                "currentNodeName": "流程发起",
                "btnName": "提交",
                "nextGroupName": "fqyybfzr_group",
                "nextStepName": "营业部负责人退订审批",
                "routeType": null,
                "approverNum": null,
                "flowBtnId": 121000,
                "flowAuditors": [
                    {
                        "login": "001477",
                        "empName": "001477",
                        "occupation": "南京长江路证券营业部",
                        "jobTitle": "总经理"
                    },
                    {
                        "login": "17010601",
                        "empName": "17010601",
                        "occupation": "南京长江路证券营业部",
                        "jobTitle": "总经理"
                    },
                    {
                        "login": "002332",
                        "empName": "002332",
                        "occupation": "南京长江路证券营业部",
                        "jobTitle": "总经理"
                    }
                ]
            }
        ],
        "itemId": ""
    }
  }
}