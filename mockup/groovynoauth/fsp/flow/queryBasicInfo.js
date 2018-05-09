/*
 * @Author: wangjunjun
 * 全渠道服务记录列表
 */
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "motDetailModel": {
        "eventName": "提醒客户办理已满足条件的业务",
        "eventType": "25",
        "exeType": "必做任务",
        "strategyDesc": "asdsgfdhgkhltl",
        "infoContent": "用户已达到办理 $可开通业务 业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。",
        "timelyIntervalValue": 8
      },
      "tagetCustModel": {
        "custSource": "业务目标客户池",
        "custNum": 1,
        "dataName": null
      },
      "workflowHistoryBeanList": [{
        "entryTime": "",
        "handler": "002332",
        "handleName": "002332",
        "handleTime": "2017-11-15 10:32:24",
        "comment": "流程发起",
        "stepName": "流程发起"
      }]
    }
  }
}