exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "num": "123456456",
      "baseInfo": {
        "content": [
          {
            "title": "标题",
            "content": "20170906今天南京又下雨了"
          }, {
            "title": "子类型",
            "content": "私密客户思密达"
          }, {
            "title": "客户",
            "content": "张三"
          }, {
            "title": "备注",
            "content": "斯蒂芬斯蒂芬是否斯蒂芬斯蒂芬十点多"
          }
        ]
      },
      "draftInfo": {
        "content": [
          {
            "title": "拟稿",
            "content": "沈旭祥"
          }, {
            "title": "提请时间",
            "content": "20170906"
          }, {
            "title": "状态",
            "content": "已完成"
          }
        ]
      },
      "serverInfo": [
        {
          "ptyMngId":"0101011",
          "ptyMngName": "王二",
          "job": "岗位A",
          "businessDepartment": "南京奥体东营业部",
          "isMain": false
        }, {
          "ptyMngId":"0101012",
          "ptyMngName": "王三",
          "job": "岗位B",
          "businessDepartment": "南京奥体东营业部AAA",
          "isMain": true

        }, {
          "ptyMngId":"0101013",
          "ptyMngName": "李四",
          "job": "岗位C",
          "businessDepartment": "南京奥体东营业部BBB",
          "isMain": false
        }, {
          "ptyMngId":"0101014",
          "ptyMngName": "张三",
          "job": "岗位D",
          "businessDepartment": "南京奥体东营业部CCC",
          "isMain": false
        }, {
          "ptyMngId":"0101015",
          "ptyMngName": "码子",
          "job": "岗位F",
          "businessDepartment": "南京奥体东营业部DDD",
          "isMain": false
        }
      ],
      "approvalRecord":{
        "stepName":"分公司负责人审批",
        "approvalId":"001003",
        "approvlName":"周延",
        "beginTime":"20170901",
        "suggestion":"审批意见很多意见超级多的意见"
      },
      "approvalRecordList":[
        {
        "stepName":"分公司负责人审批",
        "approvalId":"001003",
        "approvlName":"周延",
        "beginTime":"20170910",
        "suggestion":"意见是真他妈的多呀！多的不得了！！！！",
        "isOk": true,
        }, {
        "stepName":"分公司负责人审批",
        "approvalId":"001003",
        "approvlName":"周延",
        "beginTime":"20170901",
        "suggestion":"审批意见很多意见超级多的意见",
        "isOk": false,
        }
      ],
    }
  };
}