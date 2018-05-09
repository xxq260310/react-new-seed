exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "flowClass": "自建任务流程",
      "auditors": null,
      "groupName": null,
      "loginUser": "001206",
      "appSubJect": null,
      "approverIdea": null,
      "operate": null,
      "businessObject": null,
      "extraParam": null,
      "clearResponse": false,
      "currentNodeName": "流程发起",
      "flowId": null,
      "wobNum": null,
      "flowButtons": [
        {
          "flowClass": "自建任务流程",
          "operate": "",
          "currentNodeName": "流程发起",
          "btnName": "发起",
          "nextGroupName": "yybnbsh_group",
          "nextStepName": "部门内部审核",
          "routeType": null,
          "approverNum": null,
          "flowBtnId": 132000,
          "flowAuditors": [
            {
              "login": "002332",
              "empName": "王华",
              "occupation": "南京长江路证券营业部",
              "jobTitle": "总经理"
            }
          ]
        }
      ],
      "itemId": null
    }
  };
}
