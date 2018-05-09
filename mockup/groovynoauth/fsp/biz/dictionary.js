/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
    "code": "0", 
    "msg": "OK", 
    "resultData": {
      "kPIDateScopeType": [
        {
          "key": "518003", 
          "value": "本月"
        }, 
        {
          "key": "518004", 
          "value": "本季"
        }, 
        {
          "key": "518005", 
          "value": "本年"
        }
      ], 
      "custBusinessType": [
        {
          "key": "", 
          "value": "不限"
        }, 
        {
          "key": "817270", 
          "value": "个股期权"
        }, 
        {
          "key": "817260", 
          "value": "新三板"
        }, 
        {
          "key": "817030", 
          "value": "融资融券"
        }, 
        {
          "key": "817450", 
          "value": "IPO网下配售"
        }, 
        {
          "key": "817440", 
          "value": "深港通"
        }, 
        {
          "key": "817170", 
          "value": "涨乐财富通"
        }, 
        {
          "key": "817200", 
          "value": "沪港通"
        }, 
        {
          "key": "817460", 
          "value": "开通沪市分级基金"
        }, 
        {
          "key": "817470", 
          "value": "开通深市分级基金"
        }, 
        {
          "key": "817240", 
          "value": "OTC柜台业务"
        }, 
        {
          "key": "817010", 
          "value": "创业板"
        }, 
        {
          "key": "817050", 
          "value": "天天发"
        }
      ], 
      "custType": [
        {
          "key": "", 
          "value": "不限"
        }, 
        {
          "key": "N", 
          "value": "零售客户"
        }, 
        {
          "key": "Y", 
          "value": "高净值"
        }
      ], 
      "custNature": [
        {
          "key": "", 
          "value": "不限"
        }, 
        {
          "key": "F", 
          "value": "产品"
        }, 
        {
          "key": "P", 
          "value": "个人"
        }, 
        {
          "key": "O", 
          "value": "机构"
        }
      ], 
      "custRiskBearing": [
        {
          "key": "", 
          "value": "不限"
        }, 
        {
          "key": "704010", 
          "value": "激进型"
        }, 
        {
          "key": "704040", 
          "value": "保守型（最低类别）"
        }, 
        {
          "key": "704030", 
          "value": "保守型"
        }, 
        {
          "key": "704020", 
          "value": "稳健型"
        }, 
        {
          "key": "704025", 
          "value": "谨慎型"
        }, 
        {
          "key": "704015", 
          "value": "积极型"
        }
      ], 
      "taskTypes": [
        {
          "key": "other", 
          "value": "其他", 
          "defaultExecuteType": "Chance"
        }, 
        {
          "key": "stockCustVisit", 
          "value": "存量客户回访", 
          "defaultExecuteType": "Chance"
        }, 
        {
          "key": "businessRecommend", 
          "value": "业务推荐", 
          "defaultExecuteType": "Mission"
        }, 
        {
          "key": "newCustVisit", 
          "value": "新客户回访", 
          "defaultExecuteType": "Chance"
        }
      ], 
      "executeTypes": [
        {
          "key": "Chance", 
          "value": "选做"
        }, 
        {
          "key": "Mission", 
          "value": "必做"
        }
      ],
      "serveWay": [
        {
          "key": 'HTSC Phone',
          "value": '电话',
        },
        {
          "key": 'Mail',
          "value": '邮件',
        },
        {
          "key": 'HTSC SMS',
          "value": '短信',
        },
        {
          "key": 'wx',
          "value": '微信',
        },
        {
          "key": 'Interview',
          "value": '面谈',
        },
        {
          "key": 'HTSC Other',
          "value": '其他',
        },
      ],
      "serveType": [
        {
          "key": 'Campaign Action',
          "value": '服务营销',
        },
        {
          "key": 'Fins Su',
          "value": '理财建议',
        },
        {
          "key": 'New Customer Visit',
          "value": '新客户回访',
        },
      ],
      "workResult": [
        {
          "key": 'HTSC Complete',
          "value": '完整完成',
        },
        {
          "key": 'HTSC Partly Completed',
          "value": '部分完成',
        },
        {
          "key": 'HTSC Booking',
          "value": '预约下次',
        },
      ],
      "taskDescs": [
        {
          "userType": "businessCustPool", 
          "defaultTaskType": "businessRecommend", 
          "taskName": null, 
          "taskDesc": "用户已达到办理#{可开通业务列表}业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。", 
          "defaultExecuteType": "Mission"
        }, 
        {
          "userType": "performanceBusinessOpenCustPool", 
          "defaultTaskType": "stockCustVisit", 
          "taskName": null, 
          "taskDesc": "用户在#{开户日}开户，建议跟踪服务了解客户是否有问题需要解决", 
          "defaultExecuteType": "Chance"
        }, 
        {
          "userType": "performanceIncrementCustPool", 
          "defaultTaskType": "newCustVisit", 
          "taskName": null, 
          "taskDesc": "用户在2周内办理了#{14日内开通的业务}业务，建议跟踪服务了解客户是否有问题需要解决。", 
          "defaultExecuteType": "Chance"
        }, 
        {
          "userType": "performanceBusinessOpenCustPool", 
          "defaultTaskType": null, 
          "taskName": null, 
          "taskDesc": "", 
          "defaultExecuteType": "Chance"
        }
      ],
      "serveChannel":[
        {
           "key":"wx",
           "value":"微信"
        },
        {
           "key":"Phone",
           "value":"电话"
        },
        {
           "key":"Interview",
           "value":"面谈"
        },
        {
           "key":"Others",
           "value":"其他"
        },
        {
           "key":"SMS",
           "value":"短信"
        },
        {
           "key":"Email",
           "value":"邮件"
        },
        {
           "key":"ZLFins",
           "value":"涨乐财付通"
        },
        {
           "key":"FinsHall",
           "value":"理财大厅"
        }
      ],
      "serveStatus":[
        {
           "key":"complete",
           "value":"完成"
        },
        {
           "key":"notcomplete",
           "value":"未完成"
        }
      ],    
      "taskSource":[
        {
            "key":"SelfTask",
            "value":"自建任务"
        },
        {
            "key":"MOTTask",
            "value":"MOT任务"
        },
        {
            "key":"OtherTask",
            "value":"其他"
        }
      ],
    }
  }
}
