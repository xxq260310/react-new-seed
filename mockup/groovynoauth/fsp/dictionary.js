/**
 * Application 字典
*/
exports.response = function (req, res) {
  return {
    code: "0",
    msg: "OK",
    resultData: {
      custRiskBearing: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "704010",
          value: "激进型"
        },
        {
          key: "704020",
          value: "稳健型"
        },
        {
          key: "704030",
          value: "保守型"
        },
        {
          key: "704040",
          value: "保守型（最低类别）"
        },
        {
          key: "704015",
          value: "积极型"
        },
        {
          key: "704025",
          value: "谨慎型"
        }
      ],
      serveAllSource: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "呼叫中心",
          value: "呼叫中心"
        },
        {
          key: "短信",
          value: "短信"
        },
        {
          key: "理财服务平台",
          value: "理财服务平台"
        }
      ],
      serveType: [
        {
          key: "Complaints Dealing",
          value: "投诉处理"
        },
        {
          key: "New Customer Visit",
          value: "新客户回访"
        },
        {
          key: "BusinessRecomm",
          value: "业务推荐"
        },
        {
          key: "ActiveCare",
          value: "活动关怀"
        },
        {
          key: "Cancellation Tracking",
          value: "销户跟踪"
        },
        {
          key: "Old Customer Visit",
          value: "存量客户回访"
        },
        {
          key: "TG Exists Custotmer Visit",
          value: "投顾存量客户回访"
        },
        {
          key: "TradeService",
          value: "交易服务"
        },
        {
          key: "Resp",
          value: "体征服务回访"
        },
        {
          key: "Fins Su",
          value: "理财建议"
        },
        {
          key: "System Alert",
          value: "通知提醒"
        },
        {
          key: "ProdMarketing",
          value: "产品营销"
        },
        {
          key: "Campaign Action",
          value: "服务营销"
        },
        {
          key: "AccoutService",
          value: "账户服务"
        },
        {
          key: "Investment Bank Account",
          value: "投行活动"
        },
        {
          key: "Margin Trading",
          value: "新开融资融券客户回访"
        },
        {
          key: "Warm Care",
          value: "温馨关怀"
        },
        {
          key: "Trust Products Sale",
          value: "信托产品销售回访"
        },
        {
          key: "Sales Action",
          value: "销售活动"
        },
        {
          key: "Diff Confirm",
          value: "异动确认"
        },
        {
          key: "MOT Action",
          value: "MOT服务记录"
        },
        {
          key: "TG New Customer Visit",
          value: "投顾新客户回访"
        },
        {
          key: "General",
          value: "常规"
        },
        {
          key: "Customer Infor Verify",
          value: "客户信息核实"
        },
        {
          key: "AfterSales",
          value: "产品售后"
        }
      ],
      serviceTypeTree: [
        {
          children: [
            {
              value: "客户满意度调查",
              key: "213309"
            },
            {
              value: "其他C",
              key: "213739"
            },
            {
              value: "事由调查",
              key: "213730"
            },
            {
              value: "进展跟踪",
              key: "213731"
            },
            {
              value: "结果确认",
              key: "213732"
            }
          ],
          value: "投诉处理",
          key: "Complaints Dealing"
        },
        {
          children: [
            {
              value: "财富下午茶活动",
              key: "CF0013"
            },
            {
              value: "股权架构",
              key: "CF0012"
            },
            {
              value: "减持避税",
              key: "CF0011"
            },
            {
              value: "家族信托",
              key: "CF0010"
            },
            {
              value: "首笔交易分析",
              key: "TG1800"
            },
            {
              value: "首月无资金",
              key: "TG1900"
            },
            {
              value: "潜在客户服务",
              key: "TG1700"
            },
            {
              value: "其他Y",
              key: "213414"
            },
            {
              value: "固定收益产品",
              key: "CF0002"
            },
            {
              value: "研究服务",
              key: "CF0001"
            },
            {
              value: "定增产品",
              key: "CF0004"
            },
            {
              value: "问卷调查",
              key: "213310"
            },
            {
              value: "权益类产品",
              key: "CF0003"
            },
            {
              value: "留学移民",
              key: "CF0009"
            },
            {
              value: "股权项目",
              key: "CF0006"
            },
            {
              value: "股权产品",
              key: "CF0005"
            },
            {
              value: "网下打新",
              key: "CF0008"
            },
            {
              value: "海外投资",
              key: "CF0007"
            },
            {
              value: "其他服务产品推荐",
              key: "213404"
            },
            {
              value: "客户信息更新",
              key: "213305"
            },
            {
              value: "紫金大讲堂",
              key: "213405"
            },
            {
              value: "存量客户盘活",
              key: "213406"
            },
            {
              value: "转介绍",
              key: "213407"
            },
            {
              value: "客户挽留",
              key: "213103"
            },
            {
              value: "紫金系列理财产品推荐",
              key: "213401"
            },
            {
              value: "其他理财产品推荐",
              key: "213402"
            },
            {
              value: "投资建议",
              key: "213105"
            },
            {
              value: "积分服务产品推荐",
              key: "213403"
            },
            {
              value: "新业务介绍",
              key: "213304"
            },
            {
              value: "佣金洽谈",
              key: "213106"
            }
          ],
          value: "服务营销",
          key: "Campaign Action"
        },
        {
          children: [
            {
              value: "再次回访",
              key: "213717"
            },
            {
              value: "新开信用账户回访",
              key: "213718"
            },
            {
              value: "其他N",
              key: "213719"
            },
            {
              value: "回访问卷N",
              key: "213885"
            }
          ],
          value: "新客户回访",
          key: "New Customer Visit"
        },
        {
          children: [
            {
              value: "销户行为确认",
              key: "213770"
            },
            {
              value: "近期情况问询",
              key: "213771"
            },
            {
              value: "新产品介绍",
              key: "213772"
            },
            {
              value: "回访问卷L",
              key: "213773"
            },
            {
              value: "其他L",
              key: "213779"
            }
          ],
          value: "销户跟踪",
          key: "Cancellation Tracking"
        },
        {
          children: [
            {
              value: "再次回访M",
              key: "213758"
            },
            {
              value: "移动端开户回访",
              key: "213766"
            }
          ],
          value: "新开融资融券客户回访",
          key: "Margin Trading"
        },
        {
          children: [
            {
              value: "其他J",
              key: "213799"
            }
          ],
          value: "投顾存量客户回访",
          key: "TG Exists Custotmer Visit"
        },
        {
          children: [
            {
              value: "再次回访X",
              key: "213763"
            },
            {
              value: "信托回访",
              key: "213764"
            }
          ],
          value: "信托产品销售回访",
          key: "Trust Products Sale"
        },
        {
          children: [
            {
              value: "节日问候",
              key: "213740"
            },
            {
              value: "其他W",
              key: "213749"
            },
            {
              value: "联谊活动",
              key: "213408"
            },
            {
              value: "生日祝贺",
              key: "213888"
            },
            {
              value: "情感交流",
              key: "213741"
            },
            {
              value: "司庆答谢",
              key: "213742"
            }
          ],
          value: "温馨关怀",
          key: "Warm Care"
        },
        {
          children: [
            {
              value: "风险、投资需求更新",
              key: "TG0100"
            },
            {
              value: "风险排查",
              key: "213728"
            },
            {
              value: "退出回访",
              key: "TG0110"
            },
            {
              value: "其他O",
              key: "213729"
            },
            {
              value: "回访问卷O",
              key: "213720"
            },
            {
              value: "账户诊断回访",
              key: "213721"
            }
          ],
          value: "存量客户回访",
          key: "Old Customer Visit"
        },
        {
          children: [
            {
              value: "其它活动",
              key: "10008"
            },
            {
              value: "路演活动",
              key: "10007"
            },
            {
              value: "领导拜访",
              key: "10002"
            },
            {
              value: "一般活动",
              key: "10001"
            },
            {
              value: "会议管理",
              key: "10004"
            },
            {
              value: "会议申请",
              key: "10003"
            },
            {
              value: "专家路演",
              key: "10006"
            },
            {
              value: "电话会议",
              key: "10005"
            }
          ],
          value: "销售活动",
          key: "Sales Action"
        },
        {
          children: [
            {
              value: "体征服务",
              key: "Resp Massage"
            }
          ],
          value: "体征服务回访",
          key: "Resp"
        },
        {
          children: [
            {
              value: "操作异动",
              key: "TG2137"
            },
            {
              value: "股票异常交易",
              key: "213760"
            },
            {
              value: "资金往来异动",
              key: "617010"
            },
            {
              value: "基金交易异动",
              key: "213761"
            },
            {
              value: "账户信息变更",
              key: "213762"
            },
            {
              value: "客户流失预警",
              key: "213020"
            },
            {
              value: "其他A",
              key: "213769"
            },
            {
              value: "受限流通股异动",
              key: "617080"
            }
          ],
          value: "异动确认",
          key: "Diff Confirm"
        },
        {
          children: [
            {
              value: "MOT服务记录",
              key: "MOT Action"
            }
          ],
          value: "MOT服务记录",
          key: "MOT Action"
        },
        {
          children: [
            {
              value: "其他I",
              key: "213789"
            }
          ],
          value: "投顾新客户回访",
          key: "TG New Customer Visit"
        },
        {
          children: [
            {
              value: "资讯异动",
              key: "TG1400"
            },
            {
              value: "产品调整",
              key: "TG1500"
            },
            {
              value: "重仓点评",
              key: "TG1300"
            },
            {
              value: "投资建议书",
              key: "TG1100"
            },
            {
              value: "首份投资建议书推送",
              key: "TG1600"
            }
          ],
          value: "理财建议",
          key: "Fins Su"
        },
        {
          children: [
            {
              value: "评级短信提醒",
              key: "213101"
            },
            {
              value: "产品订购",
              key: "213040"
            },
            {
              value: "OTC开户回访问卷",
              key: "OTCOpen"
            },
            {
              value: "泰融e风险评估",
              key: "TREAssess"
            },
            {
              value: "理财评估",
              key: "213756"
            },
            {
              value: "银行理财产品风险评估",
              key: "213757"
            },
            {
              value: "证件到期",
              key: "213752"
            },
            {
              value: "股票适当性电子问卷",
              key: "213895"
            },
            {
              value: "风险评估",
              key: "213753"
            },
            {
              value: "产品购买适当性电子问卷",
              key: "213896"
            },
            {
              value: "市场活动协议预警",
              key: "213754"
            },
            {
              value: "损益告警",
              key: "213997"
            },
            {
              value: "信用账户评级",
              key: "213755"
            },
            {
              value: "洗钱风险按周日常监控",
              key: "213891"
            },
            {
              value: "服务关系确认",
              key: "TG0300"
            },
            {
              value: "洗钱风险年度审核",
              key: "213892"
            },
            {
              value: "资产未达标",
              key: "TG0400"
            },
            {
              value: "短信服务",
              key: "213893"
            },
            {
              value: "重大事项公告",
              key: "213750"
            },
            {
              value: "重要活动",
              key: "213751"
            },
            {
              value: "软件产品到期提醒",
              key: "213894"
            },
            {
              value: "客户升降级告知",
              key: "213030"
            },
            {
              value: "洗钱风险按日日常监控",
              key: "213890"
            },
            {
              value: "配置异常",
              key: "TG0500"
            },
            {
              value: "贵金属延期交收业务风险评估",
              key: "213767"
            },
            {
              value: "洗钱风险审核",
              key: "213889"
            },
            {
              value: "其他S",
              key: "213427"
            },
            {
              value: "中签、配股、增发提醒",
              key: "213307"
            },
            {
              value: "权证行权",
              key: "213886"
            },
            {
              value: "信用风险处置",
              key: "213765"
            },
            {
              value: "权证到期",
              key: "213887"
            }
          ],
          value: "通知提醒",
          key: "System Alert"
        },
        {
          children: [
            {
              value: "电话信息核实",
              key: "Phone Infor Verify"
            }
          ],
          value: "客户信息核实",
          key: "Customer Infor Verify"
        }
      ],
      typeTree: [
        {
          key: "01",
          value: "私密客户管理",
          parentKey: null,
          parentName: null,
          childrenType: [
            {
              key: "0101",
              value: "私密客户权限分配",
              parentKey: "01",
              parentName: "私密客户管理",
              childrenType: null
            },
            {
              key: "0102",
              value: "私密客户取消",
              parentKey: "01",
              parentName: "私密客户管理",
              childrenType: null
            },
            {
              key: "0103",
              value: "私密客户申请",
              parentKey: "01",
              parentName: "私密客户管理",
              childrenType: null
            }
          ]
        },
        {
          key: "02",
          value: "佣金调整",
          parentKey: null,
          parentName: null,
          childrenType: [
            {
              key: "0201",
              value: "佣金调整",
              parentKey: "02",
              parentName: "佣金调整",
              childrenType: null
            },
            {
              key: "0202",
              value: "批量佣金调整",
              parentKey: "02",
              parentName: "佣金调整",
              childrenType: null
            },
            {
              key: "0203",
              value: "咨询订阅",
              parentKey: "02",
              parentName: "佣金调整",
              childrenType: null
            },
            {
              key: "0204",
              value: "咨询退订",
              parentKey: "02",
              parentName: "佣金调整",
              childrenType: null
            }
          ]
        },
        {
          key: "03",
          value: "合作合约",
          parentKey: null,
          parentName: null,
          childrenType: [
            {
              key: "0301",
              value: "限售股解禁",
              parentKey: "03",
              parentName: "合作合约",
              childrenType: null
            }
          ]
        },
        {
          key: "04",
          value: null,
          parentKey: null,
          parentName: null,
          childrenType: [
            {
              key: "0401",
              value: null,
              parentKey: "04",
              parentName: null,
              childrenType: null
            }
          ]
        }
      ],
      executeTypes: [
        {
          key: "Mission",
          value: "必做"
        },
        {
          key: "Chance",
          value: "选做"
        }
      ],
      workResult: [
        {
          key: "HTSC Account",
          value: "机构客户"
        },
        {
          key: "HTSC Partly Completed",
          value: "部分完成"
        },
        {
          key: "HTSC Invalid Phone",
          value: "无效电话（停机、空号等）"
        },
        {
          key: "Illegal Visit",
          value: "不合规回访"
        },
        {
          key: "YYJYBGT",
          value: "愿意进一步沟通"
        },
        {
          key: "HTSC Booking",
          value: "预约下次"
        },
        {
          key: "HTSC Cancellation",
          value: "已销户"
        },
        {
          key: "TDBMQ",
          value: "态度不明确"
        },
        {
          key: "HTSC Other Speaking",
          value: "非本人接听"
        },
        {
          key: "HTSC Power Off",
          value: "已关机"
        },
        {
          key: "HTSC No Answer",
          value: "无人接听（或无法接通）"
        },
        {
          key: "HTSC Complete",
          value: "完整完成"
        },
        {
          key: "QRCJ",
          value: "确认参加"
        },
        {
          key: "Customer Decline",
          value: "客户拒绝"
        },
        {
          key: "HTSC Non-Resident Account",
          value: "境外户"
        },
        {
          key: "HTSC No One Risk Tip",
          value: "没有专人讲解合同内容和揭示风险"
        },
        {
          key: "BJFG",
          value: "比较反感"
        },
        {
          key: "HTSC Abnormal Desc",
          value: "异常情况说明"
        },
        {
          key: "HGXQ",
          value: "很感兴趣"
        },
        {
          key: "HTSC Comments",
          value: "备注"
        },
        {
          key: "Phone Error",
          value: "电话有误"
        },
        {
          key: "Address Error",
          value: "地址错误"
        }
      ],
      custBusinessType: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "817030",
          value: "融资融券"
        },
        {
          key: "817470",
          value: "开通深市分级基金"
        },
        {
          key: "817260",
          value: "新三板"
        },
        {
          key: "817270",
          value: "个股期权"
        },
        {
          key: "817060",
          value: "天天发"
        },
        {
          key: "817170",
          value: "涨乐财富通"
        },
        {
          key: "817440",
          value: "深港通"
        },
        {
          key: "817010",
          value: "创业板"
        },
        {
          key: "817450",
          value: "IPO网下配售"
        },
        {
          key: "817240",
          value: "OTC柜台业务"
        },
        {
          key: "817460",
          value: "开通沪市分级基金"
        },
        {
          key: "817200",
          value: "沪港通"
        }
      ],
      kPIDateScopeType: [
        {
          key: "518003",
          value: "本月"
        },
        {
          key: "518004",
          value: "本季"
        },
        {
          key: "518005",
          value: "本年"
        }
      ],
      serveWay: [
        {
          key: "HTSC Phone",
          value: "电话"
        },
        {
          key: "HTSC Email",
          value: "邮件"
        },
        {
          key: "HTSC SMS",
          value: "短信"
        },
        {
          key: "wx",
          value: "微信"
        },
        {
          key: "Interview",
          value: "面谈"
        },
        {
          key: "HTSC Other",
          value: "其他"
        }
      ],
      applicationStatus: [
        {
          key: "01",
          value: "处理中"
        },
        {
          key: "02",
          value: "完成"
        },
        {
          key: "03",
          value: "终止"
        },
        {
          key: "04",
          value: "驳回"
        }
      ],
      custNature: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "P",
          value: "个人"
        },
        {
          key: "F",
          value: "产品"
        },
        {
          key: "O",
          value: "机构"
        }
      ],
      serveAllType: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "通知提醒",
          value: "通知提醒"
        },
        {
          key: "体征服务回访",
          value: "体征服务回访"
        },
        {
          key: "MOT服务记录",
          value: "MOT服务记录"
        },
        {
          key: "异动确认",
          value: "异动确认"
        },
        {
          key: "新开融资融券客户回访",
          value: "新开融资融券客户回访"
        },
        {
          key: "投顾存量客户回访",
          value: "投顾存量客户回访"
        },
        {
          key: "信托产品销售回访",
          value: "信托产品销售回访"
        },
        {
          key: "理财建议",
          value: "理财建议"
        },
        {
          key: "存量客户回访",
          value: "存量客户回访"
        },
        {
          key: "服务营销",
          value: "服务营销"
        },
        {
          key: "温馨关怀",
          value: "温馨关怀"
        },
        {
          key: "销售活动",
          value: "销售活动"
        },
        {
          key: "投顾新客户回访",
          value: "投顾新客户回访"
        },
        {
          key: "客户信息核实",
          value: "客户信息核实"
        },
        {
          key: "投诉处理",
          value: "投诉处理"
        },
        {
          key: "新客户回访",
          value: "新客户回访"
        },
        {
          key: "销户跟踪",
          value: "销户跟踪"
        }
      ],
      custType: [
        {
          key: "",
          value: "不限"
        },
        {
          key: "Y",
          value: "高净值"
        },
        {
          key: "N",
          value: "零售客户"
        }
      ],
      taskDescs: [
        {
          userType: "businessCustPool",
          defaultTaskType: "businessRecommend",
          taskName: null,
          taskDesc: "用户已达到办理#{可开通业务列表}业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。",
          defaultExecuteType: "Mission"
        },
        {
          userType: "performanceBusinessOpenCustPool",
          defaultTaskType: "stockCustVisit",
          taskName: null,
          taskDesc: "用户在#{开户日}开户，建议跟踪服务了解客户是否有问题需要解决。注：如果客户状态为流失，则：用户在#{流失日}流失，建议跟踪服务了解客户是否有问题需要解决。",
          defaultExecuteType: "Chance"
        },
        {
          userType: "performanceIncrementCustPool",
          defaultTaskType: "newCustVisit",
          taskName: null,
          taskDesc: "用户在2周内办理了#{14日内开通的业务}业务，建议跟踪服务了解客户是否有问题需要解决。",
          defaultExecuteType: "Chance"
        },
        {
          userType: "searchCustPool",
          defaultTaskType: null,
          taskName: null,
          taskDesc: "",
          defaultExecuteType: "Chance"
        }
      ],
      otherRatio: [
        {
          code: "HTSC_ZFARE_RATIO",
          codeType: "华泰债券费用类型",
          options: [
            {
              codeDesc: "万1.1",
              id: "1-2VATTMG",
              codeValue: "8111"
            },
            {
              codeDesc: "万0.5",
              id: "1-2VATTMM",
              codeValue: "8105"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTM6",
              codeValue: "9999"
            },
            {
              codeDesc: "万0.3",
              id: "1-2VATTMO",
              codeValue: "8103"
            },
            {
              codeDesc: "万0.4",
              id: "1-2VATTMN",
              codeValue: "8104"
            },
            {
              codeDesc: "万0.9",
              id: "1-2VATTMI",
              codeValue: "8109"
            },
            {
              codeDesc: "万0.2",
              id: "1-2VATTMP",
              codeValue: "8102"
            },
            {
              codeDesc: "万2",
              id: "1-2VATTM7",
              codeValue: "8120"
            },
            {
              codeDesc: "万1.6",
              id: "1-2VATTMB",
              codeValue: "8116"
            },
            {
              codeDesc: "万1.2",
              id: "1-2VATTMF",
              codeValue: "8112"
            },
            {
              codeDesc: "万1.5",
              id: "1-2VATTMC",
              codeValue: "8115"
            },
            {
              codeDesc: "万1.3",
              id: "1-2VATTME",
              codeValue: "8113"
            },
            {
              codeDesc: "万1.9",
              id: "1-2VATTM8",
              codeValue: "8119"
            },
            {
              codeDesc: "万0.1",
              id: "1-2VATTMQ",
              codeValue: "8101"
            },
            {
              codeDesc: "万1",
              id: "1-2VATTMH",
              codeValue: "8110"
            },
            {
              codeDesc: "万1.8",
              id: "1-2VATTM9",
              codeValue: "8118"
            },
            {
              codeDesc: "万0.8",
              id: "1-2VATTMJ",
              codeValue: "8108"
            },
            {
              codeDesc: "万1.4",
              id: "1-2VATTMD",
              codeValue: "8114"
            },
            {
              codeDesc: "万1.7",
              id: "1-2VATTMA",
              codeValue: "8117"
            },
            {
              codeDesc: "万0.7",
              id: "1-2VATTMK",
              codeValue: "8107"
            },
            {
              codeDesc: "万0.6",
              id: "1-2VATTML",
              codeValue: "8106"
            }
          ]
        },
        {
          code: "HTSC_DDFARE_RATIO",
          codeType: "华泰担保品大宗交易费用类型",
          options: [
            {
              codeDesc: "股万9_基万5_债万0.5",
              id: "1-42AQXBM",
              codeValue: "6567"
            },
            {
              codeDesc: "股万8_基万5_债万0.5",
              id: "1-42AQXBN",
              codeValue: "6566"
            },
            {
              codeDesc: "股万2.5_基万2_债万0.3",
              id: "1-42AQXBU",
              codeValue: "6559"
            },
            {
              codeDesc: "股基千1_债十万0.8",
              id: "1-42AQXBL",
              codeValue: "6568"
            },
            {
              codeDesc: "股万3.5_基万3_债万0.4",
              id: "1-42AQXBS",
              codeValue: "6561"
            },
            {
              codeDesc: "股万7_基万5_债万0.5",
              id: "1-42AQXBO",
              codeValue: "6565"
            },
            {
              codeDesc: "股万3_基万2_债万0.3",
              id: "1-42AQXBT",
              codeValue: "6560"
            },
            {
              codeDesc: "股基千2_债万1",
              id: "1-42AQXBF",
              codeValue: "6574"
            },
            {
              codeDesc: "标准(股基千3_债万2)",
              id: "1-3N2GQ10",
              codeValue: "9999"
            },
            {
              codeDesc: "股基千2_债万2",
              id: "1-42AQXBE",
              codeValue: "6575"
            },
            {
              codeDesc: "股万2.3_基万2_债万0.3",
              id: "1-42AQXBV",
              codeValue: "6558"
            },
            {
              codeDesc: "股千1.5_基千1_债万0.8",
              id: "1-42AQXBG",
              codeValue: "6573"
            },
            {
              codeDesc: "股万1.3_基万1_债万0.1",
              id: "1-42AQXC2",
              codeValue: "6551"
            },
            {
              codeDesc: "股千1.4_基千1_债万0.8",
              id: "1-42AQXBH",
              codeValue: "6572"
            },
            {
              codeDesc: "股万1.5_基万1_债万0.1",
              id: "1-42AQXC0",
              codeValue: "6553"
            },
            {
              codeDesc: "股万2_基万1_债万0.2",
              id: "1-42AQXBX",
              codeValue: "6556"
            },
            {
              codeDesc: "股万6_基万5_债万0.5",
              id: "1-42AQXBP",
              codeValue: "6564"
            },
            {
              codeDesc: "股千1.3_基千1_债万0.8",
              id: "1-42AQXBI",
              codeValue: "6571"
            },
            {
              codeDesc: "股万5_基万3_债万0.4",
              id: "1-42AQXBQ",
              codeValue: "6563"
            },
            {
              codeDesc: "股万2.1_基万2_债万0.3",
              id: "1-42AQXBW",
              codeValue: "6557"
            },
            {
              codeDesc: "股万1.8_基万1_债万0.1",
              id: "1-42AQXBY",
              codeValue: "6555"
            },
            {
              codeDesc: "股万4_基万3_债万0.4",
              id: "1-42AQXBR",
              codeValue: "6562"
            },
            {
              codeDesc: "股千1.1_基千1_债万0.8",
              id: "1-42AQXBK",
              codeValue: "6569"
            },
            {
              codeDesc: "股千1.2_基千1_债万0.8",
              id: "1-42AQXBJ",
              codeValue: "6570"
            }
          ]
        },
        {
          code: "HTSC_HFARE_RATIO",
          codeType: "华泰回购费用类型",
          options: [
            {
              codeDesc: "十万分之0.6",
              id: "1-2VATTQG",
              codeValue: "8006"
            },
            {
              codeDesc: "十万分之0.5",
              id: "1-2VATTQH",
              codeValue: "8005"
            },
            {
              codeDesc: "6折",
              id: "1-2VATTQ6",
              codeValue: "8016"
            },
            {
              codeDesc: "十万分之0.2",
              id: "1-2VATTQK",
              codeValue: "8002"
            },
            {
              codeDesc: "7折",
              id: "1-2VATTQ5",
              codeValue: "8017"
            },
            {
              codeDesc: "十万分之0.4",
              id: "1-2VATTQI",
              codeValue: "8004"
            },
            {
              codeDesc: "5折",
              id: "1-2VATTQ7",
              codeValue: "8015"
            },
            {
              codeDesc: "9折",
              id: "1-2VATTQ3",
              codeValue: "8019"
            },
            {
              codeDesc: "8折",
              id: "1-2VATTQ4",
              codeValue: "8018"
            },
            {
              codeDesc: "2折",
              id: "1-2VATTQA",
              codeValue: "8012"
            },
            {
              codeDesc: "1折",
              id: "1-2VATTQB",
              codeValue: "8011"
            },
            {
              codeDesc: "十万分之0.3",
              id: "1-2VATTQJ",
              codeValue: "8003"
            },
            {
              codeDesc: "十万分之0.1",
              id: "1-2VATTQL",
              codeValue: "8001"
            },
            {
              codeDesc: "十万分之0.9",
              id: "1-2VATTQD",
              codeValue: "8009"
            },
            {
              codeDesc: "3折",
              id: "1-2VATTQ9",
              codeValue: "8013"
            },
            {
              codeDesc: "十万分之0.8",
              id: "1-2VATTQE",
              codeValue: "8008"
            },
            {
              codeDesc: "十万分之1",
              id: "1-2VATTQC",
              codeValue: "8010"
            },
            {
              codeDesc: "十万分之0.7",
              id: "1-2VATTQF",
              codeValue: "8007"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTQ2",
              codeValue: "9999"
            }
          ]
        },
        {
          code: "HTSC_DZFARE_RATIO",
          codeType: "华泰担保债券费用类型",
          options: [
            {
              codeDesc: "万2",
              id: "1-2VATTLL",
              codeValue: "8120"
            }
          ]
        },
        {
          code: "HTSC_COFARE_RATIO",
          codeType: "华泰信用场内基金费用类型",
          options: [
            {
              codeDesc: "万5.2",
              id: "1-2VATTYU",
              codeValue: "8752"
            },
            {
              codeDesc: "千1.9",
              id: "1-2VATTX9",
              codeValue: "8890"
            },
            {
              codeDesc: "万7.2",
              id: "1-2VATTYA",
              codeValue: "8772"
            },
            {
              codeDesc: "万9.4",
              id: "1-2VATTXO",
              codeValue: "8794"
            },
            {
              codeDesc: "万2.7",
              id: "1-2VATTZJ",
              codeValue: "8727"
            },
            {
              codeDesc: "万4.0",
              id: "1-2VATTZ6",
              codeValue: "8740"
            },
            {
              codeDesc: "千2.5",
              id: "1-2VATTX3",
              codeValue: "8950"
            },
            {
              codeDesc: "万6.2",
              id: "1-2VATTYK",
              codeValue: "8762"
            },
            {
              codeDesc: "万8.9",
              id: "1-2VATTXT",
              codeValue: "8789"
            },
            {
              codeDesc: "千1.3",
              id: "1-2VATTXF",
              codeValue: "8830"
            },
            {
              codeDesc: "千2.0",
              id: "1-2VATTX8",
              codeValue: "8900"
            },
            {
              codeDesc: "万5.5",
              id: "1-2VATTYR",
              codeValue: "8755"
            },
            {
              codeDesc: "万1.3",
              id: "1-2VATTZX",
              codeValue: "8713"
            },
            {
              codeDesc: "千2.8",
              id: "1-2VATTX0",
              codeValue: "8980"
            },
            {
              codeDesc: "万2.1",
              id: "1-2VATTZP",
              codeValue: "8721"
            },
            {
              codeDesc: "万3.8",
              id: "1-2VATTZ8",
              codeValue: "8738"
            },
            {
              codeDesc: "千1.5",
              id: "1-2VATTXD",
              codeValue: "8850"
            },
            {
              codeDesc: "千1.7",
              id: "1-2VATTXB",
              codeValue: "8870"
            },
            {
              codeDesc: "万7.0",
              id: "1-2VATTYC",
              codeValue: "8770"
            },
            {
              codeDesc: "万6.7",
              id: "1-2VATTYF",
              codeValue: "8767"
            },
            {
              codeDesc: "万7.5",
              id: "1-2VATTY7",
              codeValue: "8775"
            },
            {
              codeDesc: "万6.8",
              id: "1-2VATTYE",
              codeValue: "8768"
            },
            {
              codeDesc: "万3.5",
              id: "1-2VATTZB",
              codeValue: "8735"
            },
            {
              codeDesc: "万5.8",
              id: "1-2VATTYO",
              codeValue: "8758"
            },
            {
              codeDesc: "万8.7",
              id: "1-2VATTXV",
              codeValue: "8787"
            },
            {
              codeDesc: "万5.7",
              id: "1-2VATTYP",
              codeValue: "8757"
            },
            {
              codeDesc: "万1.6",
              id: "1-2VATTZU",
              codeValue: "8716"
            },
            {
              codeDesc: "万3.0",
              id: "1-2VATTZG",
              codeValue: "8730"
            },
            {
              codeDesc: "万6.0",
              id: "1-2VATTYM",
              codeValue: "8760"
            },
            {
              codeDesc: "千1.2",
              id: "1-2VATTXG",
              codeValue: "8820"
            },
            {
              codeDesc: "千2.6",
              id: "1-2VATTX2",
              codeValue: "8960"
            },
            {
              codeDesc: "万6.1",
              id: "1-2VATTYL",
              codeValue: "8761"
            },
            {
              codeDesc: "万2.2",
              id: "1-2VATTZO",
              codeValue: "8722"
            },
            {
              codeDesc: "万3.4",
              id: "1-2VATTZC",
              codeValue: "8734"
            },
            {
              codeDesc: "万6.4",
              id: "1-2VATTYI",
              codeValue: "8764"
            },
            {
              codeDesc: "万2.5",
              id: "1-2VATTZL",
              codeValue: "8725"
            },
            {
              codeDesc: "千2.1",
              id: "1-2VATTX7",
              codeValue: "8910"
            },
            {
              codeDesc: "万4.1",
              id: "1-2VATTZ5",
              codeValue: "8741"
            },
            {
              codeDesc: "万4.8",
              id: "1-2VATTYY",
              codeValue: "8748"
            },
            {
              codeDesc: "万2.0",
              id: "1-2VATTZQ",
              codeValue: "8720"
            },
            {
              codeDesc: "千2.3",
              id: "1-2VATTX5",
              codeValue: "8930"
            },
            {
              codeDesc: "万7.9",
              id: "1-2VATTY3",
              codeValue: "8779"
            },
            {
              codeDesc: "万1.5",
              id: "1-2VATTZV",
              codeValue: "8715"
            },
            {
              codeDesc: "万1.8",
              id: "1-2VATTZS",
              codeValue: "8718"
            },
            {
              codeDesc: "万8.5",
              id: "1-2VATTXX",
              codeValue: "8785"
            },
            {
              codeDesc: "万2.9",
              id: "1-2VATTZH",
              codeValue: "8729"
            },
            {
              codeDesc: "千1.1",
              id: "1-2VATTXH",
              codeValue: "8810"
            },
            {
              codeDesc: "万6.3",
              id: "1-2VATTYJ",
              codeValue: "8763"
            },
            {
              codeDesc: "万1.1",
              id: "1-2VATTZZ",
              codeValue: "8711"
            },
            {
              codeDesc: "万6.9",
              id: "1-2VATTYD",
              codeValue: "8769"
            },
            {
              codeDesc: "万8.4",
              id: "1-2VATTXY",
              codeValue: "8784"
            },
            {
              codeDesc: "千2.9",
              id: "1-2VATTWZ",
              codeValue: "8990"
            },
            {
              codeDesc: "万4.4",
              id: "1-2VATTZ2",
              codeValue: "8744"
            },
            {
              codeDesc: "万8.2",
              id: "1-2VATTY0",
              codeValue: "8782"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTWY",
              codeValue: "9999"
            },
            {
              codeDesc: "万2.6",
              id: "1-2VATTZK",
              codeValue: "8726"
            },
            {
              codeDesc: "万6.6",
              id: "1-2VATTYG",
              codeValue: "8766"
            },
            {
              codeDesc: "万9.7",
              id: "1-2VATTXL",
              codeValue: "8797"
            },
            {
              codeDesc: "万1.4",
              id: "1-2VATTZW",
              codeValue: "8714"
            },
            {
              codeDesc: "千1.4",
              id: "1-2VATTXE",
              codeValue: "8840"
            },
            {
              codeDesc: "万4.5",
              id: "1-2VATTZ1",
              codeValue: "8745"
            },
            {
              codeDesc: "万4.7",
              id: "1-2VATTYZ",
              codeValue: "8747"
            },
            {
              codeDesc: "千1.8",
              id: "1-2VATTXA",
              codeValue: "8880"
            },
            {
              codeDesc: "万5.6",
              id: "1-2VATTYQ",
              codeValue: "8756"
            },
            {
              codeDesc: "万3.3",
              id: "1-2VATTZD",
              codeValue: "8733"
            },
            {
              codeDesc: "万8.6",
              id: "1-2VATTXW",
              codeValue: "8786"
            },
            {
              codeDesc: "万9.3",
              id: "1-2VATTXP",
              codeValue: "8793"
            },
            {
              codeDesc: "万4.9",
              id: "1-2VATTYX",
              codeValue: "8749"
            },
            {
              codeDesc: "万9.6",
              id: "1-2VATTXM",
              codeValue: "8796"
            },
            {
              codeDesc: "万5.9",
              id: "1-2VATTYN",
              codeValue: "8759"
            },
            {
              codeDesc: "万7.4",
              id: "1-2VATTY8",
              codeValue: "8774"
            },
            {
              codeDesc: "万9.9",
              id: "1-2VATTXJ",
              codeValue: "8799"
            },
            {
              codeDesc: "万7.7",
              id: "1-2VATTY5",
              codeValue: "8777"
            },
            {
              codeDesc: "万3.7",
              id: "1-2VATTZ9",
              codeValue: "8737"
            },
            {
              codeDesc: "万9.2",
              id: "1-2VATTXQ",
              codeValue: "8792"
            },
            {
              codeDesc: "万1.7",
              id: "1-2VATTZT",
              codeValue: "8717"
            },
            {
              codeDesc: "千2.7",
              id: "1-2VATTX1",
              codeValue: "8970"
            },
            {
              codeDesc: "千2.2",
              id: "1-2VATTX6",
              codeValue: "8920"
            },
            {
              codeDesc: "万3.1",
              id: "1-2VATTZF",
              codeValue: "8731"
            },
            {
              codeDesc: "万5.0",
              id: "1-2VATTYW",
              codeValue: "8750"
            },
            {
              codeDesc: "万6.5",
              id: "1-2VATTYH",
              codeValue: "8765"
            },
            {
              codeDesc: "万9.1",
              id: "1-2VATTXR",
              codeValue: "8791"
            },
            {
              codeDesc: "万3.9",
              id: "1-2VATTZ7",
              codeValue: "8739"
            },
            {
              codeDesc: "万1.9",
              id: "1-2VATTZR",
              codeValue: "8719"
            },
            {
              codeDesc: "万1.0",
              id: "1-2VATU00",
              codeValue: "8710"
            },
            {
              codeDesc: "万3.6",
              id: "1-2VATTZA",
              codeValue: "8736"
            },
            {
              codeDesc: "万4.2",
              id: "1-2VATTZ4",
              codeValue: "8742"
            },
            {
              codeDesc: "千2.4",
              id: "1-2VATTX4",
              codeValue: "8940"
            },
            {
              codeDesc: "万5.1",
              id: "1-2VATTYV",
              codeValue: "8751"
            },
            {
              codeDesc: "万7.8",
              id: "1-2VATTY4",
              codeValue: "8778"
            },
            {
              codeDesc: "万8.0",
              id: "1-2VATTY2",
              codeValue: "8780"
            },
            {
              codeDesc: "万9.5",
              id: "1-2VATTXN",
              codeValue: "8795"
            },
            {
              codeDesc: "千1.0",
              id: "1-2VATTXI",
              codeValue: "8800"
            },
            {
              codeDesc: "万8.3",
              id: "1-2VATTXZ",
              codeValue: "8783"
            },
            {
              codeDesc: "万9.0",
              id: "1-2VATTXS",
              codeValue: "8790"
            },
            {
              codeDesc: "万8.8",
              id: "1-2VATTXU",
              codeValue: "8788"
            },
            {
              codeDesc: "万2.3",
              id: "1-2VATTZN",
              codeValue: "8723"
            },
            {
              codeDesc: "万7.1",
              id: "1-2VATTYB",
              codeValue: "8771"
            },
            {
              codeDesc: "千1.6",
              id: "1-2VATTXC",
              codeValue: "8860"
            },
            {
              codeDesc: "万4.6",
              id: "1-2VATTZ0",
              codeValue: "8746"
            },
            {
              codeDesc: "万5.3",
              id: "1-2VATTYT",
              codeValue: "8753"
            },
            {
              codeDesc: "万2.4",
              id: "1-2VATTZM",
              codeValue: "8724"
            },
            {
              codeDesc: "万2.8",
              id: "1-2VATTZI",
              codeValue: "8728"
            },
            {
              codeDesc: "万1.2",
              id: "1-2VATTZY",
              codeValue: "8712"
            },
            {
              codeDesc: "万8.1",
              id: "1-2VATTY1",
              codeValue: "8781"
            },
            {
              codeDesc: "万7.3",
              id: "1-2VATTY9",
              codeValue: "8773"
            },
            {
              codeDesc: "万4.3",
              id: "1-2VATTZ3",
              codeValue: "8743"
            },
            {
              codeDesc: "万9.8",
              id: "1-2VATTXK",
              codeValue: "8798"
            },
            {
              codeDesc: "万5.4",
              id: "1-2VATTYS",
              codeValue: "8754"
            },
            {
              codeDesc: "万7.6",
              id: "1-2VATTY6",
              codeValue: "8776"
            },
            {
              codeDesc: "万3.2",
              id: "1-2VATTZE",
              codeValue: "8732"
            }
          ]
        },
        {
          code: "HTSC_STBFARE_RATIO",
          codeType: "华泰股转费用类型",
          options: [
            {
              codeDesc: "转万6.2_A万6.2_B千1.3",
              id: "1-3N2GPXO",
              codeValue: "3162"
            },
            {
              codeDesc: "转万8.5_A万8.5_B千1.3",
              id: "1-3N2GPYB",
              codeValue: "3185"
            },
            {
              codeDesc: "转万7.1_A万7.1_B千1.3",
              id: "1-3N2GPXX",
              codeValue: "3171"
            },
            {
              codeDesc: "转千1.5_股千1.5",
              id: "1-3N2GPYV",
              codeValue: "3205"
            },
            {
              codeDesc: "转万9.8_A万9.8_B千1.3",
              id: "1-3N2GPYO",
              codeValue: "3198"
            },
            {
              codeDesc: "转万7.2_A万7.2_B千1.3",
              id: "1-3N2GPXY",
              codeValue: "3172"
            },
            {
              codeDesc: "转千1.5_股千2.6",
              id: "1-3N2GPZ6",
              codeValue: "3216"
            },
            {
              codeDesc: "转万9.3_A万9.3_B千1.3",
              id: "1-3N2GPYJ",
              codeValue: "3193"
            },
            {
              codeDesc: "转千1.5_股千2.3",
              id: "1-3N2GPZ3",
              codeValue: "3213"
            },
            {
              codeDesc: "转万8.6_A万8.6_B千1.3",
              id: "1-3N2GPYC",
              codeValue: "3186"
            },
            {
              codeDesc: "转万9.4_A万9.4_B千1.3",
              id: "1-3N2GPYK",
              codeValue: "3194"
            },
            {
              codeDesc: "转万8.8_A万8.8_B千1.3",
              id: "1-3N2GPYE",
              codeValue: "3188"
            },
            {
              codeDesc: "转万6.7_A万6.7_B千1.3",
              id: "1-3N2GPXT",
              codeValue: "3167"
            },
            {
              codeDesc: "转千1.5_股千2.8",
              id: "1-3N2GPZ8",
              codeValue: "3218"
            },
            {
              codeDesc: "转万8.3_A万8.3_B千1.3",
              id: "1-3N2GPY9",
              codeValue: "3183"
            },
            {
              codeDesc: "标准(转千1.5_A千3_B千4)",
              id: "1-3N2GPZB",
              codeValue: "9999"
            },
            {
              codeDesc: "转万6.8_A万6.8_B千1.3",
              id: "1-3N2GPXU",
              codeValue: "3168"
            },
            {
              codeDesc: "转万6.6_A万6.6_B千1.3",
              id: "1-3N2GPXS",
              codeValue: "3166"
            },
            {
              codeDesc: "转万7.4_A万7.4_B千1.3",
              id: "1-3N2GPY0",
              codeValue: "3174"
            },
            {
              codeDesc: "转万7.6_A万7.6_B千1.3",
              id: "1-3N2GPY2",
              codeValue: "3176"
            },
            {
              codeDesc: "转万8.4_A万8.4_B千1.3",
              id: "1-3N2GPYA",
              codeValue: "3184"
            },
            {
              codeDesc: "转千1.4_A千1.4_B千1.4",
              id: "1-3N2GPYU",
              codeValue: "3204"
            },
            {
              codeDesc: "转千1.5_股千2.4",
              id: "1-3N2GPZ4",
              codeValue: "3214"
            },
            {
              codeDesc: "转万8.2_A万8.2_B千1.3",
              id: "1-3N2GPY8",
              codeValue: "3182"
            },
            {
              codeDesc: "转千1.5_股千2.2",
              id: "1-3N2GPZ2",
              codeValue: "3212"
            },
            {
              codeDesc: "转万9.1_A万9.1_B千1.3",
              id: "1-3N2GPYH",
              codeValue: "3191"
            },
            {
              codeDesc: "转千1.5_股千2",
              id: "1-3N2GPZ0",
              codeValue: "3210"
            },
            {
              codeDesc: "转万6.9_A万6.9_B千1.3",
              id: "1-3N2GPXV",
              codeValue: "3169"
            },
            {
              codeDesc: "转万6.1_A万6.1_B千1.3",
              id: "1-3N2GPXN",
              codeValue: "3161"
            },
            {
              codeDesc: "转万8_A万8_B千1.3",
              id: "1-3N2GPY6",
              codeValue: "3180"
            },
            {
              codeDesc: "转万6_A万6_B千1.3",
              id: "1-3N2GPXM",
              codeValue: "3160"
            },
            {
              codeDesc: "转万6.3_A万6.3_B千1.3",
              id: "1-3N2GPXP",
              codeValue: "3163"
            },
            {
              codeDesc: "转千1.5_股千1.9",
              id: "1-3N2GPYZ",
              codeValue: "3209"
            },
            {
              codeDesc: "转千1.5_股千3",
              id: "1-3N2GPZA",
              codeValue: "3220"
            },
            {
              codeDesc: "转万8.7_A万8.7_B千1.3",
              id: "1-3N2GPYD",
              codeValue: "3187"
            },
            {
              codeDesc: "转万9.6_A万9.6_B千1.3",
              id: "1-3N2GPYM",
              codeValue: "3196"
            },
            {
              codeDesc: "转千1.1_A千1.1_B千1.3",
              id: "1-3N2GPYR",
              codeValue: "3201"
            },
            {
              codeDesc: "转千1.5_股千2.9",
              id: "1-3N2GPZ9",
              codeValue: "3219"
            },
            {
              codeDesc: "转千1.5_股千2.7",
              id: "1-3N2GPZ7",
              codeValue: "3217"
            },
            {
              codeDesc: "转千1.5_股千1.8",
              id: "1-3N2GPYY",
              codeValue: "3208"
            },
            {
              codeDesc: "转万7.5_A万7.5_B千1.3",
              id: "1-3N2GPY1",
              codeValue: "3175"
            },
            {
              codeDesc: "转万9.5_A万9.5_B千1.3",
              id: "1-3N2GPYL",
              codeValue: "3195"
            },
            {
              codeDesc: "转万6.5_A万6.5_B千1.3",
              id: "1-3N2GPXR",
              codeValue: "3165"
            },
            {
              codeDesc: "转千1.5_股千1.6",
              id: "1-3N2GPYW",
              codeValue: "3206"
            },
            {
              codeDesc: "转万7.8_A万7.8_B千1.3",
              id: "1-3N2GPY4",
              codeValue: "3178"
            },
            {
              codeDesc: "转万9.7_A万9.7_B千1.3",
              id: "1-3N2GPYN",
              codeValue: "3197"
            },
            {
              codeDesc: "转万7.9_A万7.9_B千1.3",
              id: "1-3N2GPY5",
              codeValue: "3179"
            },
            {
              codeDesc: "转万9.2_A万9.2_B千1.3",
              id: "1-3N2GPYI",
              codeValue: "3192"
            },
            {
              codeDesc: "转千1.5_股千1.7",
              id: "1-3N2GPYX",
              codeValue: "3207"
            },
            {
              codeDesc: "转千1.3_A千1.3_B千1.3",
              id: "1-3N2GPYT",
              codeValue: "3203"
            },
            {
              codeDesc: "转万7.3_A万7.3_B千1.3",
              id: "1-3N2GPXZ",
              codeValue: "3173"
            },
            {
              codeDesc: "转千1.5_股千2.1",
              id: "1-3N2GPZ1",
              codeValue: "3211"
            },
            {
              codeDesc: "转万6.4_A万6.4_B千1.3",
              id: "1-3N2GPXQ",
              codeValue: "3164"
            },
            {
              codeDesc: "转万8.1_A万8.1_B千1.3",
              id: "1-3N2GPY7",
              codeValue: "3181"
            },
            {
              codeDesc: "转万8.9_A万8.9_B千1.3",
              id: "1-3N2GPYF",
              codeValue: "3189"
            },
            {
              codeDesc: "转万9.9_A万9.9_B千1.3",
              id: "1-3N2GPYP",
              codeValue: "3199"
            },
            {
              codeDesc: "转万9_A万9_B千1.3",
              id: "1-3N2GPYG",
              codeValue: "3190"
            },
            {
              codeDesc: "转千1.5_股千2.5",
              id: "1-3N2GPZ5",
              codeValue: "3215"
            },
            {
              codeDesc: "转千1.2_A千1.2_B千1.3",
              id: "1-3N2GPYS",
              codeValue: "3202"
            },
            {
              codeDesc: "转万7.7_A万7.7_B千1.3",
              id: "1-3N2GPY3",
              codeValue: "3177"
            },
            {
              codeDesc: "转万7_A万7_B千1.3",
              id: "1-3N2GPXW",
              codeValue: "3170"
            },
            {
              codeDesc: "转千1_A千1_B千1.3",
              id: "1-3N2GPYQ",
              codeValue: "3200"
            }
          ]
        },
        {
          code: "HTSC_OFARE_RATIO",
          codeType: "华泰场内基金费用类型",
          options: [
            {
              codeDesc: "万1.3",
              id: "1-2VATTTM",
              codeValue: "8713"
            },
            {
              codeDesc: "千2.9",
              id: "1-2VATTQO",
              codeValue: "8990"
            },
            {
              codeDesc: "万4.5",
              id: "1-2VATTSQ",
              codeValue: "8745"
            },
            {
              codeDesc: "千2.6",
              id: "1-2VATTQR",
              codeValue: "8960"
            },
            {
              codeDesc: "万4.3",
              id: "1-2VATTSS",
              codeValue: "8743"
            },
            {
              codeDesc: "万6.8",
              id: "1-2VATTS3",
              codeValue: "8768"
            },
            {
              codeDesc: "万1.4",
              id: "1-2VATTTL",
              codeValue: "8714"
            },
            {
              codeDesc: "千1.8",
              id: "1-2VATTQZ",
              codeValue: "8880"
            },
            {
              codeDesc: "万3.7",
              id: "1-2VATTSY",
              codeValue: "8737"
            },
            {
              codeDesc: "千2.0",
              id: "1-2VATTQX",
              codeValue: "8900"
            },
            {
              codeDesc: "万3.2",
              id: "1-2VATTT3",
              codeValue: "8732"
            },
            {
              codeDesc: "万4.4",
              id: "1-2VATTSR",
              codeValue: "8744"
            },
            {
              codeDesc: "万4.7",
              id: "1-2VATTSO",
              codeValue: "8747"
            },
            {
              codeDesc: "万4.8",
              id: "1-2VATTSN",
              codeValue: "8748"
            },
            {
              codeDesc: "千1.4",
              id: "1-2VATTR3",
              codeValue: "8840"
            },
            {
              codeDesc: "万2.4",
              id: "1-2VATTTB",
              codeValue: "8724"
            },
            {
              codeDesc: "万2.9",
              id: "1-2VATTT6",
              codeValue: "8729"
            },
            {
              codeDesc: "万6.3",
              id: "1-2VATTS8",
              codeValue: "8763"
            },
            {
              codeDesc: "千1.1",
              id: "1-2VATTR6",
              codeValue: "8810"
            },
            {
              codeDesc: "万8.6",
              id: "1-2VATTRL",
              codeValue: "8786"
            },
            {
              codeDesc: "万6.2",
              id: "1-2VATTS9",
              codeValue: "8762"
            },
            {
              codeDesc: "万1.9",
              id: "1-2VATTTG",
              codeValue: "8719"
            },
            {
              codeDesc: "千1.7",
              id: "1-2VATTR0",
              codeValue: "8870"
            },
            {
              codeDesc: "万4.6",
              id: "1-2VATTSP",
              codeValue: "8746"
            },
            {
              codeDesc: "万7.1",
              id: "1-2VATTS0",
              codeValue: "8771"
            },
            {
              codeDesc: "万3.3",
              id: "1-2VATTT2",
              codeValue: "8733"
            },
            {
              codeDesc: "万8.8",
              id: "1-2VATTRJ",
              codeValue: "8788"
            },
            {
              codeDesc: "千2.3",
              id: "1-2VATTQU",
              codeValue: "8930"
            },
            {
              codeDesc: "万9.1",
              id: "1-2VATTRG",
              codeValue: "8791"
            },
            {
              codeDesc: "万6.0",
              id: "1-2VATTSB",
              codeValue: "8760"
            },
            {
              codeDesc: "万6.4",
              id: "1-2VATTS7",
              codeValue: "8764"
            },
            {
              codeDesc: "万7.0",
              id: "1-2VATTS1",
              codeValue: "8770"
            },
            {
              codeDesc: "万4.1",
              id: "1-2VATTSU",
              codeValue: "8741"
            },
            {
              codeDesc: "万5.4",
              id: "1-2VATTSH",
              codeValue: "8754"
            },
            {
              codeDesc: "千1.2",
              id: "1-2VATTR5",
              codeValue: "8820"
            },
            {
              codeDesc: "万1.1",
              id: "1-2VATTTO",
              codeValue: "8711"
            },
            {
              codeDesc: "万8.9",
              id: "1-2VATTRI",
              codeValue: "8789"
            },
            {
              codeDesc: "万8.2",
              id: "1-2VATTRP",
              codeValue: "8782"
            },
            {
              codeDesc: "千1.0",
              id: "1-2VATTR7",
              codeValue: "8800"
            },
            {
              codeDesc: "万4.2",
              id: "1-2VATTST",
              codeValue: "8742"
            },
            {
              codeDesc: "万7.3",
              id: "1-2VATTRY",
              codeValue: "8773"
            },
            {
              codeDesc: "千2.4",
              id: "1-2VATTQT",
              codeValue: "8940"
            },
            {
              codeDesc: "万6.6",
              id: "1-2VATTS5",
              codeValue: "8766"
            },
            {
              codeDesc: "万4.0",
              id: "1-2VATTSV",
              codeValue: "8740"
            },
            {
              codeDesc: "万5.6",
              id: "1-2VATTSF",
              codeValue: "8756"
            },
            {
              codeDesc: "万1.2",
              id: "1-2VATTTN",
              codeValue: "8712"
            },
            {
              codeDesc: "万2.3",
              id: "1-2VATTTC",
              codeValue: "8723"
            },
            {
              codeDesc: "万3.5",
              id: "1-2VATTT0",
              codeValue: "8735"
            },
            {
              codeDesc: "万6.1",
              id: "1-2VATTSA",
              codeValue: "8761"
            },
            {
              codeDesc: "千2.5",
              id: "1-2VATTQS",
              codeValue: "8950"
            },
            {
              codeDesc: "万8.4",
              id: "1-2VATTRN",
              codeValue: "8784"
            },
            {
              codeDesc: "万5.2",
              id: "1-2VATTSJ",
              codeValue: "8752"
            },
            {
              codeDesc: "万9.3",
              id: "1-2VATTRE",
              codeValue: "8793"
            },
            {
              codeDesc: "万9.0",
              id: "1-2VATTRH",
              codeValue: "8790"
            },
            {
              codeDesc: "万1.7",
              id: "1-2VATTTI",
              codeValue: "8717"
            },
            {
              codeDesc: "万5.1",
              id: "1-2VATTSK",
              codeValue: "8751"
            },
            {
              codeDesc: "万3.6",
              id: "1-2VATTSZ",
              codeValue: "8736"
            },
            {
              codeDesc: "万5.9",
              id: "1-2VATTSC",
              codeValue: "8759"
            },
            {
              codeDesc: "万5.5",
              id: "1-2VATTSG",
              codeValue: "8755"
            },
            {
              codeDesc: "万1.6",
              id: "1-2VATTTJ",
              codeValue: "8716"
            },
            {
              codeDesc: "万9.8",
              id: "1-2VATTR9",
              codeValue: "8798"
            },
            {
              codeDesc: "万3.9",
              id: "1-2VATTSW",
              codeValue: "8739"
            },
            {
              codeDesc: "万2.2",
              id: "1-2VATTTD",
              codeValue: "8722"
            },
            {
              codeDesc: "万5.3",
              id: "1-2VATTSI",
              codeValue: "8753"
            },
            {
              codeDesc: "千1.5",
              id: "1-2VATTR2",
              codeValue: "8850"
            },
            {
              codeDesc: "万3.0",
              id: "1-2VATTT5",
              codeValue: "8730"
            },
            {
              codeDesc: "万8.3",
              id: "1-2VATTRO",
              codeValue: "8783"
            },
            {
              codeDesc: "万9.2",
              id: "1-2VATTRF",
              codeValue: "8792"
            },
            {
              codeDesc: "万5.0",
              id: "1-2VATTSL",
              codeValue: "8750"
            },
            {
              codeDesc: "万2.6",
              id: "1-2VATTT9",
              codeValue: "8726"
            },
            {
              codeDesc: "万7.2",
              id: "1-2VATTRZ",
              codeValue: "8772"
            },
            {
              codeDesc: "万2.5",
              id: "1-2VATTTA",
              codeValue: "8725"
            },
            {
              codeDesc: "万7.7",
              id: "1-2VATTRU",
              codeValue: "8777"
            },
            {
              codeDesc: "万9.4",
              id: "1-2VATTRD",
              codeValue: "8794"
            },
            {
              codeDesc: "万9.6",
              id: "1-2VATTRB",
              codeValue: "8796"
            },
            {
              codeDesc: "万1.5",
              id: "1-2VATTTK",
              codeValue: "8715"
            },
            {
              codeDesc: "万6.9",
              id: "1-2VATTS2",
              codeValue: "8769"
            },
            {
              codeDesc: "万7.9",
              id: "1-2VATTRS",
              codeValue: "8779"
            },
            {
              codeDesc: "万9.9",
              id: "1-2VATTR8",
              codeValue: "8799"
            },
            {
              codeDesc: "万7.4",
              id: "1-2VATTRX",
              codeValue: "8774"
            },
            {
              codeDesc: "万3.1",
              id: "1-2VATTT4",
              codeValue: "8731"
            },
            {
              codeDesc: "千2.1",
              id: "1-2VATTQW",
              codeValue: "8910"
            },
            {
              codeDesc: "万9.7",
              id: "1-2VATTRA",
              codeValue: "8797"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTQN",
              codeValue: "9999"
            },
            {
              codeDesc: "万8.7",
              id: "1-2VATTRK",
              codeValue: "8787"
            },
            {
              codeDesc: "万6.7",
              id: "1-2VATTS4",
              codeValue: "8767"
            },
            {
              codeDesc: "万6.5",
              id: "1-2VATTS6",
              codeValue: "8765"
            },
            {
              codeDesc: "万8.0",
              id: "1-2VATTRR",
              codeValue: "8780"
            },
            {
              codeDesc: "千1.3",
              id: "1-2VATTR4",
              codeValue: "8830"
            },
            {
              codeDesc: "万1.8",
              id: "1-2VATTTH",
              codeValue: "8718"
            },
            {
              codeDesc: "万2.0",
              id: "1-2VATTTF",
              codeValue: "8720"
            },
            {
              codeDesc: "万4.9",
              id: "1-2VATTSM",
              codeValue: "8749"
            },
            {
              codeDesc: "万7.8",
              id: "1-2VATTRT",
              codeValue: "8778"
            },
            {
              codeDesc: "万3.4",
              id: "1-2VATTT1",
              codeValue: "8734"
            },
            {
              codeDesc: "万3.8",
              id: "1-2VATTSX",
              codeValue: "8738"
            },
            {
              codeDesc: "万2.7",
              id: "1-2VATTT8",
              codeValue: "8727"
            },
            {
              codeDesc: "万2.8",
              id: "1-2VATTT7",
              codeValue: "8728"
            },
            {
              codeDesc: "万7.6",
              id: "1-2VATTRV",
              codeValue: "8776"
            },
            {
              codeDesc: "万2.1",
              id: "1-2VATTTE",
              codeValue: "8721"
            },
            {
              codeDesc: "万5.7",
              id: "1-2VATTSE",
              codeValue: "8757"
            },
            {
              codeDesc: "千2.2",
              id: "1-2VATTQV",
              codeValue: "8920"
            },
            {
              codeDesc: "万8.1",
              id: "1-2VATTRQ",
              codeValue: "8781"
            },
            {
              codeDesc: "千1.6",
              id: "1-2VATTR1",
              codeValue: "8860"
            },
            {
              codeDesc: "万7.5",
              id: "1-2VATTRW",
              codeValue: "8775"
            },
            {
              codeDesc: "千1.9",
              id: "1-2VATTQY",
              codeValue: "8890"
            },
            {
              codeDesc: "万1.0",
              id: "1-2VATTTP",
              codeValue: "8710"
            },
            {
              codeDesc: "万5.8",
              id: "1-2VATTSD",
              codeValue: "8758"
            },
            {
              codeDesc: "千2.8",
              id: "1-2VATTQP",
              codeValue: "8980"
            },
            {
              codeDesc: "万9.5",
              id: "1-2VATTRC",
              codeValue: "8795"
            },
            {
              codeDesc: "万8.5",
              id: "1-2VATTRM",
              codeValue: "8785"
            },
            {
              codeDesc: "千2.7",
              id: "1-2VATTQQ",
              codeValue: "8970"
            }
          ]
        },
        {
          code: "HTSC_DOFARE_RATIO",
          codeType: "华泰担保场内基金费用类型",
          options: [
            {
              codeDesc: "千2.7",
              id: "1-2VATTI8",
              codeValue: "8970"
            },
            {
              codeDesc: "万7.4",
              id: "1-2VATTJF",
              codeValue: "8774"
            },
            {
              codeDesc: "万4.2",
              id: "1-2VATTKB",
              codeValue: "8742"
            },
            {
              codeDesc: "万2.2",
              id: "1-2VATTKV",
              codeValue: "8722"
            },
            {
              codeDesc: "万6.2",
              id: "1-2VATTJR",
              codeValue: "8762"
            },
            {
              codeDesc: "千1.6",
              id: "1-2VATTIJ",
              codeValue: "8860"
            },
            {
              codeDesc: "千2.2",
              id: "1-2VATTID",
              codeValue: "8920"
            },
            {
              codeDesc: "万5.0",
              id: "1-2VATTK3",
              codeValue: "8750"
            },
            {
              codeDesc: "万5.6",
              id: "1-2VATTJX",
              codeValue: "8756"
            },
            {
              codeDesc: "万4.8",
              id: "1-2VATTK5",
              codeValue: "8748"
            },
            {
              codeDesc: "万5.2",
              id: "1-2VATTK1",
              codeValue: "8752"
            },
            {
              codeDesc: "万7.9",
              id: "1-2VATTJA",
              codeValue: "8779"
            },
            {
              codeDesc: "万6.9",
              id: "1-2VATTJK",
              codeValue: "8769"
            },
            {
              codeDesc: "千1.5",
              id: "1-2VATTIK",
              codeValue: "8850"
            },
            {
              codeDesc: "万1.1",
              id: "1-2VATTL6",
              codeValue: "8711"
            },
            {
              codeDesc: "万2.5",
              id: "1-2VATTKS",
              codeValue: "8725"
            },
            {
              codeDesc: "千2.4",
              id: "1-2VATTIB",
              codeValue: "8940"
            },
            {
              codeDesc: "万9.7",
              id: "1-2VATTIS",
              codeValue: "8797"
            },
            {
              codeDesc: "万5.3",
              id: "1-2VATTK0",
              codeValue: "8753"
            },
            {
              codeDesc: "万4.9",
              id: "1-2VATTK4",
              codeValue: "8749"
            },
            {
              codeDesc: "千1.4",
              id: "1-2VATTIL",
              codeValue: "8840"
            },
            {
              codeDesc: "万3.0",
              id: "1-2VATTKN",
              codeValue: "8730"
            },
            {
              codeDesc: "万1.6",
              id: "1-2VATTL1",
              codeValue: "8716"
            },
            {
              codeDesc: "万5.7",
              id: "1-2VATTJW",
              codeValue: "8757"
            },
            {
              codeDesc: "万3.1",
              id: "1-2VATTKM",
              codeValue: "8731"
            },
            {
              codeDesc: "万3.7",
              id: "1-2VATTKG",
              codeValue: "8737"
            },
            {
              codeDesc: "万2.0",
              id: "1-2VATTKX",
              codeValue: "8720"
            },
            {
              codeDesc: "万2.3",
              id: "1-2VATTKU",
              codeValue: "8723"
            },
            {
              codeDesc: "万8.1",
              id: "1-2VATTJ8",
              codeValue: "8781"
            },
            {
              codeDesc: "万9.1",
              id: "1-2VATTIY",
              codeValue: "8791"
            },
            {
              codeDesc: "万6.0",
              id: "1-2VATTJT",
              codeValue: "8760"
            },
            {
              codeDesc: "千2.6",
              id: "1-2VATTI9",
              codeValue: "8960"
            },
            {
              codeDesc: "千2.1",
              id: "1-2VATTIE",
              codeValue: "8910"
            },
            {
              codeDesc: "万6.5",
              id: "1-2VATTJO",
              codeValue: "8765"
            },
            {
              codeDesc: "万7.6",
              id: "1-2VATTJD",
              codeValue: "8776"
            },
            {
              codeDesc: "万8.5",
              id: "1-2VATTJ4",
              codeValue: "8785"
            },
            {
              codeDesc: "万2.9",
              id: "1-2VATTKO",
              codeValue: "8729"
            },
            {
              codeDesc: "万1.2",
              id: "1-2VATTL5",
              codeValue: "8712"
            },
            {
              codeDesc: "万9.2",
              id: "1-2VATTIX",
              codeValue: "8792"
            },
            {
              codeDesc: "万9.0",
              id: "1-2VATTIZ",
              codeValue: "8790"
            },
            {
              codeDesc: "万8.4",
              id: "1-2VATTJ5",
              codeValue: "8784"
            },
            {
              codeDesc: "千1.9",
              id: "1-2VATTIG",
              codeValue: "8890"
            },
            {
              codeDesc: "万2.6",
              id: "1-2VATTKR",
              codeValue: "8726"
            },
            {
              codeDesc: "万3.3",
              id: "1-2VATTKK",
              codeValue: "8733"
            },
            {
              codeDesc: "万2.4",
              id: "1-2VATTKT",
              codeValue: "8724"
            },
            {
              codeDesc: "万6.7",
              id: "1-2VATTJM",
              codeValue: "8767"
            },
            {
              codeDesc: "万2.1",
              id: "1-2VATTKW",
              codeValue: "8721"
            },
            {
              codeDesc: "万5.9",
              id: "1-2VATTJU",
              codeValue: "8759"
            },
            {
              codeDesc: "万6.6",
              id: "1-2VATTJN",
              codeValue: "8766"
            },
            {
              codeDesc: "千1.0",
              id: "1-2VATTIP",
              codeValue: "8800"
            },
            {
              codeDesc: "万4.6",
              id: "1-2VATTK7",
              codeValue: "8746"
            },
            {
              codeDesc: "万5.5",
              id: "1-2VATTJY",
              codeValue: "8755"
            },
            {
              codeDesc: "万1.7",
              id: "1-2VATTL0",
              codeValue: "8717"
            },
            {
              codeDesc: "万2.8",
              id: "1-2VATTKP",
              codeValue: "8728"
            },
            {
              codeDesc: "千2.8",
              id: "1-2VATTI7",
              codeValue: "8980"
            },
            {
              codeDesc: "万4.3",
              id: "1-2VATTKA",
              codeValue: "8743"
            },
            {
              codeDesc: "万2.7",
              id: "1-2VATTKQ",
              codeValue: "8727"
            },
            {
              codeDesc: "万7.8",
              id: "1-2VATTJB",
              codeValue: "8778"
            },
            {
              codeDesc: "万8.7",
              id: "1-2VATTJ2",
              codeValue: "8787"
            },
            {
              codeDesc: "万1.0",
              id: "1-2VATTL7",
              codeValue: "8710"
            },
            {
              codeDesc: "万1.3",
              id: "1-2VATTL4",
              codeValue: "8713"
            },
            {
              codeDesc: "万3.2",
              id: "1-2VATTKL",
              codeValue: "8732"
            },
            {
              codeDesc: "万8.0",
              id: "1-2VATTJ9",
              codeValue: "8780"
            },
            {
              codeDesc: "万1.9",
              id: "1-2VATTKY",
              codeValue: "8719"
            },
            {
              codeDesc: "千2.0",
              id: "1-2VATTIF",
              codeValue: "8900"
            },
            {
              codeDesc: "万7.2",
              id: "1-2VATTJH",
              codeValue: "8772"
            },
            {
              codeDesc: "万7.7",
              id: "1-2VATTJC",
              codeValue: "8777"
            },
            {
              codeDesc: "万5.8",
              id: "1-2VATTJV",
              codeValue: "8758"
            },
            {
              codeDesc: "万4.4",
              id: "1-2VATTK9",
              codeValue: "8744"
            },
            {
              codeDesc: "万5.1",
              id: "1-2VATTK2",
              codeValue: "8751"
            },
            {
              codeDesc: "万3.4",
              id: "1-2VATTKJ",
              codeValue: "8734"
            },
            {
              codeDesc: "千1.2",
              id: "1-2VATTIN",
              codeValue: "8820"
            },
            {
              codeDesc: "万3.9",
              id: "1-2VATTKE",
              codeValue: "8739"
            },
            {
              codeDesc: "万4.1",
              id: "1-2VATTKC",
              codeValue: "8741"
            },
            {
              codeDesc: "千1.3",
              id: "1-2VATTIM",
              codeValue: "8830"
            },
            {
              codeDesc: "万3.5",
              id: "1-2VATTKI",
              codeValue: "8735"
            },
            {
              codeDesc: "万7.5",
              id: "1-2VATTJE",
              codeValue: "8775"
            },
            {
              codeDesc: "万9.4",
              id: "1-2VATTIV",
              codeValue: "8794"
            },
            {
              codeDesc: "千1.8",
              id: "1-2VATTIH",
              codeValue: "8880"
            },
            {
              codeDesc: "千2.5",
              id: "1-2VATTIA",
              codeValue: "8950"
            },
            {
              codeDesc: "万9.5",
              id: "1-2VATTIU",
              codeValue: "8795"
            },
            {
              codeDesc: "万9.3",
              id: "1-2VATTIW",
              codeValue: "8793"
            },
            {
              codeDesc: "千2.9",
              id: "1-2VATTI6",
              codeValue: "8990"
            },
            {
              codeDesc: "万3.6",
              id: "1-2VATTKH",
              codeValue: "8736"
            },
            {
              codeDesc: "万6.3",
              id: "1-2VATTJQ",
              codeValue: "8763"
            },
            {
              codeDesc: "万7.0",
              id: "1-2VATTJJ",
              codeValue: "8770"
            },
            {
              codeDesc: "万6.1",
              id: "1-2VATTJS",
              codeValue: "8761"
            },
            {
              codeDesc: "万5.4",
              id: "1-2VATTJZ",
              codeValue: "8754"
            },
            {
              codeDesc: "万9.8",
              id: "1-2VATTIR",
              codeValue: "8798"
            },
            {
              codeDesc: "万3.8",
              id: "1-2VATTKF",
              codeValue: "8738"
            },
            {
              codeDesc: "万6.8",
              id: "1-2VATTJL",
              codeValue: "8768"
            },
            {
              codeDesc: "万9.9",
              id: "1-2VATTIQ",
              codeValue: "8799"
            },
            {
              codeDesc: "万4.7",
              id: "1-2VATTK6",
              codeValue: "8747"
            },
            {
              codeDesc: "万4.5",
              id: "1-2VATTK8",
              codeValue: "8745"
            },
            {
              codeDesc: "万1.5",
              id: "1-2VATTL2",
              codeValue: "8715"
            },
            {
              codeDesc: "万1.4",
              id: "1-2VATTL3",
              codeValue: "8714"
            },
            {
              codeDesc: "万4.0",
              id: "1-2VATTKD",
              codeValue: "8740"
            },
            {
              codeDesc: "万7.1",
              id: "1-2VATTJI",
              codeValue: "8771"
            },
            {
              codeDesc: "千1.1",
              id: "1-2VATTIO",
              codeValue: "8810"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTI5",
              codeValue: "9999"
            },
            {
              codeDesc: "万7.3",
              id: "1-2VATTJG",
              codeValue: "8773"
            },
            {
              codeDesc: "万1.8",
              id: "1-2VATTKZ",
              codeValue: "8718"
            },
            {
              codeDesc: "万8.9",
              id: "1-2VATTJ0",
              codeValue: "8789"
            },
            {
              codeDesc: "万8.2",
              id: "1-2VATTJ7",
              codeValue: "8782"
            },
            {
              codeDesc: "万8.8",
              id: "1-2VATTJ1",
              codeValue: "8788"
            },
            {
              codeDesc: "千1.7",
              id: "1-2VATTII",
              codeValue: "8870"
            },
            {
              codeDesc: "千2.3",
              id: "1-2VATTIC",
              codeValue: "8930"
            },
            {
              codeDesc: "万8.3",
              id: "1-2VATTJ6",
              codeValue: "8783"
            },
            {
              codeDesc: "万9.6",
              id: "1-2VATTIT",
              codeValue: "8796"
            },
            {
              codeDesc: "万8.6",
              id: "1-2VATTJ3",
              codeValue: "8786"
            },
            {
              codeDesc: "万6.4",
              id: "1-2VATTJP",
              codeValue: "8764"
            }
          ]
        },
        {
          code: "HTSC_HKFARE_RATIO",
          codeType: "华泰港股通费用类型（净佣金）",
          options: [
            {
              codeDesc: "万3.3",
              id: "HKFARE_RATIO40",
              codeValue: "8643"
            },
            {
              codeDesc: "万2.8",
              id: "HKFARE_RATIO45",
              codeValue: "8638"
            },
            {
              codeDesc: "千2.2",
              id: "HKFARE_RATIO9",
              codeValue: "8674"
            },
            {
              codeDesc: "万2",
              id: "HKFARE_RATIO53",
              codeValue: "8630"
            },
            {
              codeDesc: "万4.5",
              id: "HKFARE_RATIO32",
              codeValue: "8651"
            },
            {
              codeDesc: "千1",
              id: "HKFARE_RATIO21",
              codeValue: "8662"
            },
            {
              codeDesc: "万7",
              id: "HKFARE_RATIO27",
              codeValue: "8656"
            },
            {
              codeDesc: "千1.9",
              id: "HKFARE_RATIO12",
              codeValue: "8671"
            },
            {
              codeDesc: "万1.8",
              id: "HKFARE_RATIO55",
              codeValue: "8628"
            },
            {
              codeDesc: "万5.5",
              id: "HKFARE_RATIO30",
              codeValue: "8653"
            },
            {
              codeDesc: "万2.4",
              id: "HKFARE_RATIO49",
              codeValue: "8634"
            },
            {
              codeDesc: "千2.1",
              id: "HKFARE_RATIO10",
              codeValue: "8673"
            },
            {
              codeDesc: "千2.6",
              id: "HKFARE_RATIO5",
              codeValue: "8678"
            },
            {
              codeDesc: "万2.9",
              id: "HKFARE_RATIO44",
              codeValue: "8639"
            },
            {
              codeDesc: "万3.6",
              id: "HKFARE_RATIO37",
              codeValue: "8646"
            },
            {
              codeDesc: "万1.9",
              id: "HKFARE_RATIO54",
              codeValue: "8629"
            },
            {
              codeDesc: "万2.7",
              id: "HKFARE_RATIO46",
              codeValue: "8637"
            },
            {
              codeDesc: "万3.5",
              id: "HKFARE_RATIO38",
              codeValue: "8645"
            },
            {
              codeDesc: "万2.2",
              id: "HKFARE_RATIO51",
              codeValue: "8632"
            },
            {
              codeDesc: "千1.1",
              id: "HKFARE_RATIO20",
              codeValue: "8663"
            },
            {
              codeDesc: "千1.6",
              id: "HKFARE_RATIO15",
              codeValue: "8668"
            },
            {
              codeDesc: "千1.3",
              id: "HKFARE_RATIO18",
              codeValue: "8665"
            },
            {
              codeDesc: "万8.5",
              id: "HKFARE_RATIO24",
              codeValue: "8659"
            },
            {
              codeDesc: "万7.5",
              id: "HKFARE_RATIO26",
              codeValue: "8657"
            },
            {
              codeDesc: "万9",
              id: "HKFARE_RATIO23",
              codeValue: "8660"
            },
            {
              codeDesc: "千2",
              id: "HKFARE_RATIO11",
              codeValue: "8672"
            },
            {
              codeDesc: "千2.5",
              id: "HKFARE_RATIO6",
              codeValue: "8677"
            },
            {
              codeDesc: "万1.7",
              id: "HKFARE_RATIO56",
              codeValue: "8627"
            },
            {
              codeDesc: "万5",
              id: "HKFARE_RATIO31",
              codeValue: "8652"
            },
            {
              codeDesc: "万3.9",
              id: "HKFARE_RATIO34",
              codeValue: "8649"
            },
            {
              codeDesc: "万3.4",
              id: "HKFARE_RATIO39",
              codeValue: "8644"
            },
            {
              codeDesc: "万2.1",
              id: "HKFARE_RATIO52",
              codeValue: "8631"
            },
            {
              codeDesc: "万2.3",
              id: "HKFARE_RATIO50",
              codeValue: "8633"
            },
            {
              codeDesc: "标准千3",
              id: "HKFARE_RATIO1",
              codeValue: "9999"
            },
            {
              codeDesc: "千1.2",
              id: "HKFARE_RATIO19",
              codeValue: "8664"
            },
            {
              codeDesc: "万8",
              id: "HKFARE_RATIO25",
              codeValue: "8658"
            },
            {
              codeDesc: "千1.7",
              id: "HKFARE_RATIO14",
              codeValue: "8669"
            },
            {
              codeDesc: "千1.8",
              id: "HKFARE_RATIO13",
              codeValue: "8670"
            },
            {
              codeDesc: "万6.5",
              id: "HKFARE_RATIO28",
              codeValue: "8655"
            },
            {
              codeDesc: "万3.2",
              id: "HKFARE_RATIO41",
              codeValue: "8642"
            },
            {
              codeDesc: "万1.5",
              id: "HKFARE_RATIO58",
              codeValue: "8625"
            },
            {
              codeDesc: "万2.6",
              id: "HKFARE_RATIO47",
              codeValue: "8636"
            },
            {
              codeDesc: "千2.3",
              id: "HKFARE_RATIO8",
              codeValue: "8675"
            },
            {
              codeDesc: "万3.7",
              id: "HKFARE_RATIO36",
              codeValue: "8647"
            },
            {
              codeDesc: "千2.4",
              id: "HKFARE_RATIO7",
              codeValue: "8676"
            },
            {
              codeDesc: "万3.1",
              id: "HKFARE_RATIO42",
              codeValue: "8641"
            },
            {
              codeDesc: "万4",
              id: "HKFARE_RATIO33",
              codeValue: "8650"
            },
            {
              codeDesc: "千2.9",
              id: "HKFARE_RATIO2",
              codeValue: "8681"
            },
            {
              codeDesc: "千2.7",
              id: "HKFARE_RATIO4",
              codeValue: "8679"
            },
            {
              codeDesc: "千1.5",
              id: "HKFARE_RATIO16",
              codeValue: "8667"
            },
            {
              codeDesc: "万3",
              id: "HKFARE_RATIO43",
              codeValue: "8640"
            },
            {
              codeDesc: "万2.5",
              id: "HKFARE_RATIO48",
              codeValue: "8635"
            },
            {
              codeDesc: "千2.8",
              id: "HKFARE_RATIO3",
              codeValue: "8680"
            },
            {
              codeDesc: "万6",
              id: "HKFARE_RATIO29",
              codeValue: "8654"
            },
            {
              codeDesc: "万9.5",
              id: "HKFARE_RATIO22",
              codeValue: "8661"
            },
            {
              codeDesc: "千1.4",
              id: "HKFARE_RATIO17",
              codeValue: "8666"
            },
            {
              codeDesc: "万1.3",
              id: "HKFARE_RATIO60",
              codeValue: "8623"
            },
            {
              codeDesc: "万3.8",
              id: "HKFARE_RATIO35",
              codeValue: "8648"
            }
          ]
        },
        {
          code: "HTSC_BGFARE_RATIO",
          codeType: "华泰B股费用类型",
          options: [
            {
              codeDesc: "B股折扣2折",
              id: "1-3N2GPZN",
              codeValue: "2"
            },
            {
              codeDesc: "B股折扣3.6折",
              id: "1-3N2GQ03",
              codeValue: "3.6"
            },
            {
              codeDesc: "B股折扣2.4折",
              id: "1-3N2GPZR",
              codeValue: "2.4"
            },
            {
              codeDesc: "B股折扣1.7折",
              id: "1-3N2GPZK",
              codeValue: "1.7"
            },
            {
              codeDesc: "B股折扣4.1折",
              id: "1-3N2GQ08",
              codeValue: "4.1"
            },
            {
              codeDesc: "B股折扣4.5折",
              id: "1-3N2GQ0C",
              codeValue: "4.5"
            },
            {
              codeDesc: "B股折扣2.1折",
              id: "1-3N2GPZO",
              codeValue: "2.1"
            },
            {
              codeDesc: "B股折扣3.1折",
              id: "1-3N2GPZY",
              codeValue: "3.1"
            },
            {
              codeDesc: "B股折扣4.4折",
              id: "1-3N2GQ0B",
              codeValue: "4.4"
            },
            {
              codeDesc: "B股折扣1.1折",
              id: "1-3N2GPZE",
              codeValue: "1.1"
            },
            {
              codeDesc: "B股折扣8.5折",
              id: "1-3N2GQ0W",
              codeValue: "8.5"
            },
            {
              codeDesc: "B股折扣5.8折",
              id: "1-3N2GQ0P",
              codeValue: "5.8"
            },
            {
              codeDesc: "B股折扣4.6折",
              id: "1-3N2GQ0D",
              codeValue: "4.6"
            },
            {
              codeDesc: "B股折扣2.9折",
              id: "1-3N2GPZW",
              codeValue: "2.9"
            },
            {
              codeDesc: "B股折扣5.4折",
              id: "1-3N2GQ0L",
              codeValue: "5.4"
            },
            {
              codeDesc: "B股折扣4折",
              id: "1-3N2GQ07",
              codeValue: "4"
            },
            {
              codeDesc: "B股折扣3.3折",
              id: "1-3N2GQ00",
              codeValue: "3.3"
            },
            {
              codeDesc: "标准费用(无折扣)",
              id: "1-3N2GQ0Z",
              codeValue: "10"
            },
            {
              codeDesc: "B股折扣5.5折",
              id: "1-3N2GQ0M",
              codeValue: "5.5"
            },
            {
              codeDesc: "B股折扣2.2折",
              id: "1-3N2GPZP",
              codeValue: "2.2"
            },
            {
              codeDesc: "B股折扣1.8折",
              id: "1-3N2GPZL",
              codeValue: "1.8"
            },
            {
              codeDesc: "B股折扣1.9折",
              id: "1-3N2GPZM",
              codeValue: "1.9"
            },
            {
              codeDesc: "B股折扣4.9折",
              id: "1-3N2GQ0G",
              codeValue: "4.9"
            },
            {
              codeDesc: "B股折扣9折",
              id: "1-3N2GQ0X",
              codeValue: "9"
            },
            {
              codeDesc: "B股折扣5.1折",
              id: "1-3N2GQ0I",
              codeValue: "5.1"
            },
            {
              codeDesc: "B股折扣3.9折",
              id: "1-3N2GQ06",
              codeValue: "3.9"
            },
            {
              codeDesc: "B股折扣2.6折",
              id: "1-3N2GPZT",
              codeValue: "2.6"
            },
            {
              codeDesc: "B股折扣7折",
              id: "1-3N2GQ0T",
              codeValue: "7"
            },
            {
              codeDesc: "B股折扣9.5折",
              id: "1-3N2GQ0Y",
              codeValue: "9.5"
            },
            {
              codeDesc: "B股折扣2.8折",
              id: "1-3N2GPZV",
              codeValue: "2.8"
            },
            {
              codeDesc: "B股折扣3.4折",
              id: "1-3N2GQ01",
              codeValue: "3.4"
            },
            {
              codeDesc: "B股折扣4.2折",
              id: "1-3N2GQ09",
              codeValue: "4.2"
            },
            {
              codeDesc: "B股折扣5折",
              id: "1-3N2GQ0H",
              codeValue: "5"
            },
            {
              codeDesc: "B股折扣5.7折",
              id: "1-3N2GQ0O",
              codeValue: "5.7"
            },
            {
              codeDesc: "B股折扣0.95折",
              id: "1-3N2GPZC",
              codeValue: "0.95"
            },
            {
              codeDesc: "B股折扣1.3折",
              id: "1-3N2GPZG",
              codeValue: "1.3"
            },
            {
              codeDesc: "B股折扣3.5折",
              id: "1-3N2GQ02",
              codeValue: "3.5"
            },
            {
              codeDesc: "B股折扣3.7折",
              id: "1-3N2GQ04",
              codeValue: "3.7"
            },
            {
              codeDesc: "B股折扣8折",
              id: "1-3N2GQ0V",
              codeValue: "8"
            },
            {
              codeDesc: "B股折扣4.8折",
              id: "1-3N2GQ0F",
              codeValue: "4.8"
            },
            {
              codeDesc: "B股折扣5.3折",
              id: "1-3N2GQ0K",
              codeValue: "5.3"
            },
            {
              codeDesc: "B股折扣1.2折",
              id: "1-3N2GPZF",
              codeValue: "1.2"
            },
            {
              codeDesc: "B股折扣1.6折",
              id: "1-3N2GPZJ",
              codeValue: "1.6"
            },
            {
              codeDesc: "B股折扣4.3折",
              id: "1-3N2GQ0A",
              codeValue: "4.3"
            },
            {
              codeDesc: "B股折扣3.8折",
              id: "1-3N2GQ05",
              codeValue: "3.8"
            },
            {
              codeDesc: "B股折扣2.5折",
              id: "1-3N2GPZS",
              codeValue: "2.5"
            },
            {
              codeDesc: "B股折扣1.4折",
              id: "1-3N2GPZH",
              codeValue: "1.4"
            },
            {
              codeDesc: "B股折扣3.2折",
              id: "1-3N2GPZZ",
              codeValue: "3.2"
            },
            {
              codeDesc: "B股折扣1.5折",
              id: "1-3N2GPZI",
              codeValue: "1.5"
            },
            {
              codeDesc: "B股折扣2.7折",
              id: "1-3N2GPZU",
              codeValue: "2.7"
            },
            {
              codeDesc: "B股折扣6.5折",
              id: "1-3N2GQ0S",
              codeValue: "6.5"
            },
            {
              codeDesc: "B股折扣4.7折",
              id: "1-3N2GQ0E",
              codeValue: "4.7"
            },
            {
              codeDesc: "B股折扣2.3折",
              id: "1-3N2GPZQ",
              codeValue: "2.3"
            },
            {
              codeDesc: "B股折扣6折",
              id: "1-3N2GQ0R",
              codeValue: "6"
            },
            {
              codeDesc: "B股折扣7.5折",
              id: "1-3N2GQ0U",
              codeValue: "7.5"
            },
            {
              codeDesc: "B股折扣5.6折",
              id: "1-3N2GQ0N",
              codeValue: "5.6"
            },
            {
              codeDesc: "B股折扣5.2折",
              id: "1-3N2GQ0J",
              codeValue: "5.2"
            },
            {
              codeDesc: "B股折扣5.9折",
              id: "1-3N2GQ0Q",
              codeValue: "5.9"
            },
            {
              codeDesc: "B股折扣3折",
              id: "1-3N2GPZX",
              codeValue: "3"
            }
          ]
        },
        {
          code: "HTSC_QFARE_RATIO",
          codeType: "华泰权证费用类型",
          options: [
            {
              codeDesc: "万7.2",
              id: "1-2VATTO4",
              codeValue: "8772"
            },
            {
              codeDesc: "千1.3",
              id: "1-2VATTN9",
              codeValue: "8830"
            },
            {
              codeDesc: "万4.7",
              id: "1-2VATTOT",
              codeValue: "8747"
            },
            {
              codeDesc: "万3.4",
              id: "1-2VATTP6",
              codeValue: "8734"
            },
            {
              codeDesc: "千2.0",
              id: "1-2VATTN2",
              codeValue: "8900"
            },
            {
              codeDesc: "万8.9",
              id: "1-2VATTNN",
              codeValue: "8789"
            },
            {
              codeDesc: "万3.7",
              id: "1-2VATTP3",
              codeValue: "8737"
            },
            {
              codeDesc: "万3.1",
              id: "1-2VATTP9",
              codeValue: "8731"
            },
            {
              codeDesc: "万6.9",
              id: "1-2VATTO7",
              codeValue: "8769"
            },
            {
              codeDesc: "万8.2",
              id: "1-2VATTNU",
              codeValue: "8782"
            },
            {
              codeDesc: "万9.3",
              id: "1-2VATTNJ",
              codeValue: "8793"
            },
            {
              codeDesc: "万2.7",
              id: "1-2VATTPD",
              codeValue: "8727"
            },
            {
              codeDesc: "千1.1",
              id: "1-2VATTNB",
              codeValue: "8810"
            },
            {
              codeDesc: "万2.9",
              id: "1-2VATTPB",
              codeValue: "8729"
            },
            {
              codeDesc: "万3.3",
              id: "1-2VATTP7",
              codeValue: "8733"
            },
            {
              codeDesc: "千1.8",
              id: "1-2VATTN4",
              codeValue: "8880"
            },
            {
              codeDesc: "万7.0",
              id: "1-2VATTO6",
              codeValue: "8770"
            },
            {
              codeDesc: "千2.4",
              id: "1-2VATTMY",
              codeValue: "8940"
            },
            {
              codeDesc: "万9.6",
              id: "1-2VATTNG",
              codeValue: "8796"
            },
            {
              codeDesc: "万7.8",
              id: "1-2VATTNY",
              codeValue: "8778"
            },
            {
              codeDesc: "万4.8",
              id: "1-2VATTOS",
              codeValue: "8748"
            },
            {
              codeDesc: "万5.5",
              id: "1-2VATTOL",
              codeValue: "8755"
            },
            {
              codeDesc: "万7.7",
              id: "1-2VATTNZ",
              codeValue: "8777"
            },
            {
              codeDesc: "万9.8",
              id: "1-2VATTNE",
              codeValue: "8798"
            },
            {
              codeDesc: "万8.0",
              id: "1-2VATTNW",
              codeValue: "8780"
            },
            {
              codeDesc: "万0.45",
              id: "1-2VATTQ0",
              codeValue: "8704"
            },
            {
              codeDesc: "万1.4",
              id: "1-2VATTPQ",
              codeValue: "8714"
            },
            {
              codeDesc: "千1.0",
              id: "1-2VATTNC",
              codeValue: "8800"
            },
            {
              codeDesc: "万3.9",
              id: "1-2VATTP1",
              codeValue: "8739"
            },
            {
              codeDesc: "万3.6",
              id: "1-2VATTP4",
              codeValue: "8736"
            },
            {
              codeDesc: "万7.6",
              id: "1-2VATTO0",
              codeValue: "8776"
            },
            {
              codeDesc: "千2.8",
              id: "1-2VATTMU",
              codeValue: "8980"
            },
            {
              codeDesc: "万7.3",
              id: "1-2VATTO3",
              codeValue: "8773"
            },
            {
              codeDesc: "万5.8",
              id: "1-2VATTOI",
              codeValue: "8758"
            },
            {
              codeDesc: "万4.1",
              id: "1-2VATTOZ",
              codeValue: "8741"
            },
            {
              codeDesc: "千1.6",
              id: "1-2VATTN6",
              codeValue: "8860"
            },
            {
              codeDesc: "万5.3",
              id: "1-2VATTON",
              codeValue: "8753"
            },
            {
              codeDesc: "万2.2",
              id: "1-2VATTPI",
              codeValue: "8722"
            },
            {
              codeDesc: "万9.1",
              id: "1-2VATTNL",
              codeValue: "8791"
            },
            {
              codeDesc: "万5.9",
              id: "1-2VATTOH",
              codeValue: "8759"
            },
            {
              codeDesc: "万0.9",
              id: "1-2VATTPV",
              codeValue: "8709"
            },
            {
              codeDesc: "万2.5",
              id: "1-2VATTPF",
              codeValue: "8725"
            },
            {
              codeDesc: "万9.4",
              id: "1-2VATTNI",
              codeValue: "8794"
            },
            {
              codeDesc: "标准",
              id: "1-2VATTMS",
              codeValue: "9999"
            },
            {
              codeDesc: "万8.4",
              id: "1-2VATTNS",
              codeValue: "8784"
            },
            {
              codeDesc: "万5.0",
              id: "1-2VATTOQ",
              codeValue: "8750"
            },
            {
              codeDesc: "万5.7",
              id: "1-2VATTOJ",
              codeValue: "8757"
            },
            {
              codeDesc: "万6.8",
              id: "1-2VATTO8",
              codeValue: "8768"
            },
            {
              codeDesc: "万1.6",
              id: "1-2VATTPO",
              codeValue: "8716"
            },
            {
              codeDesc: "万3.0",
              id: "1-2VATTPA",
              codeValue: "8730"
            },
            {
              codeDesc: "万2.1",
              id: "1-2VATTPJ",
              codeValue: "8721"
            },
            {
              codeDesc: "万4.9",
              id: "1-2VATTOR",
              codeValue: "8749"
            },
            {
              codeDesc: "千1.7",
              id: "1-2VATTN5",
              codeValue: "8870"
            },
            {
              codeDesc: "万4.5",
              id: "1-2VATTOV",
              codeValue: "8745"
            },
            {
              codeDesc: "万6.2",
              id: "1-2VATTOE",
              codeValue: "8762"
            },
            {
              codeDesc: "万8.6",
              id: "1-2VATTNQ",
              codeValue: "8786"
            },
            {
              codeDesc: "万9.9",
              id: "1-2VATTND",
              codeValue: "8799"
            },
            {
              codeDesc: "千2.1",
              id: "1-2VATTN1",
              codeValue: "8910"
            },
            {
              codeDesc: "万7.1",
              id: "1-2VATTO5",
              codeValue: "8771"
            },
            {
              codeDesc: "万6.3",
              id: "1-2VATTOD",
              codeValue: "8763"
            },
            {
              codeDesc: "万5.6",
              id: "1-2VATTOK",
              codeValue: "8756"
            },
            {
              codeDesc: "千2.6",
              id: "1-2VATTMW",
              codeValue: "8960"
            },
            {
              codeDesc: "千2.5",
              id: "1-2VATTMX",
              codeValue: "8950"
            },
            {
              codeDesc: "万1.5",
              id: "1-2VATTPP",
              codeValue: "8715"
            },
            {
              codeDesc: "万3.2",
              id: "1-2VATTP8",
              codeValue: "8732"
            },
            {
              codeDesc: "万6.4",
              id: "1-2VATTOC",
              codeValue: "8764"
            },
            {
              codeDesc: "万6.0",
              id: "1-2VATTOG",
              codeValue: "8760"
            },
            {
              codeDesc: "千1.5",
              id: "1-2VATTN7",
              codeValue: "8850"
            },
            {
              codeDesc: "万9.0",
              id: "1-2VATTNM",
              codeValue: "8790"
            },
            {
              codeDesc: "万9.7",
              id: "1-2VATTNF",
              codeValue: "8797"
            },
            {
              codeDesc: "万5.4",
              id: "1-2VATTOM",
              codeValue: "8754"
            },
            {
              codeDesc: "万4.6",
              id: "1-2VATTOU",
              codeValue: "8746"
            },
            {
              codeDesc: "万3.8",
              id: "1-2VATTP2",
              codeValue: "8738"
            },
            {
              codeDesc: "万4.4",
              id: "1-2VATTOW",
              codeValue: "8744"
            },
            {
              codeDesc: "万0.5",
              id: "1-2VATTPZ",
              codeValue: "8705"
            },
            {
              codeDesc: "万5.2",
              id: "1-2VATTOO",
              codeValue: "8752"
            },
            {
              codeDesc: "万1.2",
              id: "1-2VATTPS",
              codeValue: "8712"
            },
            {
              codeDesc: "万2.0",
              id: "1-2VATTPK",
              codeValue: "8720"
            },
            {
              codeDesc: "万6.6",
              id: "1-2VATTOA",
              codeValue: "8766"
            },
            {
              codeDesc: "万4.0",
              id: "1-2VATTP0",
              codeValue: "8740"
            },
            {
              codeDesc: "万0.7",
              id: "1-2VATTPX",
              codeValue: "8707"
            },
            {
              codeDesc: "万6.7",
              id: "1-2VATTO9",
              codeValue: "8767"
            },
            {
              codeDesc: "千2.7",
              id: "1-2VATTMV",
              codeValue: "8970"
            },
            {
              codeDesc: "万7.5",
              id: "1-2VATTO1",
              codeValue: "8775"
            },
            {
              codeDesc: "万1.7",
              id: "1-2VATTPN",
              codeValue: "8717"
            },
            {
              codeDesc: "千2.9",
              id: "1-2VATTMT",
              codeValue: "8990"
            },
            {
              codeDesc: "万9.2",
              id: "1-2VATTNK",
              codeValue: "8792"
            },
            {
              codeDesc: "万1.8",
              id: "1-2VATTPM",
              codeValue: "8718"
            },
            {
              codeDesc: "万4.2",
              id: "1-2VATTOY",
              codeValue: "8742"
            },
            {
              codeDesc: "万8.3",
              id: "1-2VATTNT",
              codeValue: "8783"
            },
            {
              codeDesc: "千1.2",
              id: "1-2VATTNA",
              codeValue: "8820"
            },
            {
              codeDesc: "千2.2",
              id: "1-2VATTN0",
              codeValue: "8920"
            },
            {
              codeDesc: "万6.1",
              id: "1-2VATTOF",
              codeValue: "8761"
            },
            {
              codeDesc: "千1.9",
              id: "1-2VATTN3",
              codeValue: "8890"
            },
            {
              codeDesc: "万0.6",
              id: "1-2VATTPY",
              codeValue: "8706"
            },
            {
              codeDesc: "万8.1",
              id: "1-2VATTNV",
              codeValue: "8781"
            },
            {
              codeDesc: "万7.4",
              id: "1-2VATTO2",
              codeValue: "8774"
            },
            {
              codeDesc: "万2.6",
              id: "1-2VATTPE",
              codeValue: "8726"
            },
            {
              codeDesc: "万1.3",
              id: "1-2VATTPR",
              codeValue: "8713"
            },
            {
              codeDesc: "万2.4",
              id: "1-2VATTPG",
              codeValue: "8724"
            },
            {
              codeDesc: "万2.8",
              id: "1-2VATTPC",
              codeValue: "8728"
            },
            {
              codeDesc: "千1.4",
              id: "1-2VATTN8",
              codeValue: "8840"
            },
            {
              codeDesc: "万0.8",
              id: "1-2VATTPW",
              codeValue: "8708"
            },
            {
              codeDesc: "千2.3",
              id: "1-2VATTMZ",
              codeValue: "8930"
            },
            {
              codeDesc: "万2.3",
              id: "1-2VATTPH",
              codeValue: "8723"
            },
            {
              codeDesc: "万8.8",
              id: "1-2VATTNO",
              codeValue: "8788"
            },
            {
              codeDesc: "万4.3",
              id: "1-2VATTOX",
              codeValue: "8743"
            },
            {
              codeDesc: "万9.5",
              id: "1-2VATTNH",
              codeValue: "8795"
            },
            {
              codeDesc: "万3.5",
              id: "1-2VATTP5",
              codeValue: "8735"
            },
            {
              codeDesc: "万5.1",
              id: "1-2VATTOP",
              codeValue: "8751"
            },
            {
              codeDesc: "万6.5",
              id: "1-2VATTOB",
              codeValue: "8765"
            },
            {
              codeDesc: "万8.5",
              id: "1-2VATTNR",
              codeValue: "8785"
            },
            {
              codeDesc: "万8.7",
              id: "1-2VATTNP",
              codeValue: "8787"
            },
            {
              codeDesc: "万1.0",
              id: "1-2VATTPU",
              codeValue: "8710"
            },
            {
              codeDesc: "万7.9",
              id: "1-2VATTNX",
              codeValue: "8779"
            },
            {
              codeDesc: "万1.1",
              id: "1-2VATTPT",
              codeValue: "8711"
            },
            {
              codeDesc: "万1.9",
              id: "1-2VATTPL",
              codeValue: "8719"
            }
          ]
        },
        {
          code: "HTSC_DFARE_RATIO",
          codeType: "华泰大宗交易费用类型",
          options: [
            {
              codeDesc: "股万5_基万3_债万0.4",
              id: "1-42AQX4W",
              codeValue: "6563"
            },
            {
              codeDesc: "股万3.5_基万3_债万0.4",
              id: "1-42AQX4Y",
              codeValue: "6561"
            },
            {
              codeDesc: "股万2.3_基万2_债万0.3",
              id: "1-42AQX51",
              codeValue: "6558"
            },
            {
              codeDesc: "股千1.4_基千1_债万0.8",
              id: "1-42AQX4N",
              codeValue: "6572"
            },
            {
              codeDesc: "股万7_基万5_债万0.5",
              id: "1-42AQX4U",
              codeValue: "6565"
            },
            {
              codeDesc: "股万4_基万3_债万0.4",
              id: "1-42AQX4X",
              codeValue: "6562"
            },
            {
              codeDesc: "股千1.3_基千1_债万0.8",
              id: "1-42AQX4O",
              codeValue: "6571"
            },
            {
              codeDesc: "股万1.2_基万1_债万0.1",
              id: "1-42AQX59",
              codeValue: "6550"
            },
            {
              codeDesc: "股万9_基万5_债万0.5",
              id: "1-42AQX4S",
              codeValue: "6567"
            },
            {
              codeDesc: "股基千2_债万1",
              id: "1-42AQX4L",
              codeValue: "6574"
            },
            {
              codeDesc: "股万3_基万2_债万0.3",
              id: "1-42AQX4Z",
              codeValue: "6560"
            },
            {
              codeDesc: "股万2.1_基万2_债万0.3",
              id: "1-42AQX52",
              codeValue: "6557"
            },
            {
              codeDesc: "股千1.1_基千1_债万0.8",
              id: "1-42AQX4Q",
              codeValue: "6569"
            },
            {
              codeDesc: "股千1.5_基千1_债万0.8",
              id: "1-42AQX4M",
              codeValue: "6573"
            },
            {
              codeDesc: "股基千2_债万2",
              id: "1-42AQX4K",
              codeValue: "6575"
            },
            {
              codeDesc: "股万2_基万1_债万0.2",
              id: "1-42AQX53",
              codeValue: "6556"
            },
            {
              codeDesc: "股万1.3_基万1_债万0.1",
              id: "1-42AQX58",
              codeValue: "6551"
            },
            {
              codeDesc: "股万1.6_基万1_债万0.1",
              id: "1-42AQX55",
              codeValue: "6554"
            },
            {
              codeDesc: "标准(股基千3_债万2)",
              id: "1-3UQTBHH",
              codeValue: "9999"
            },
            {
              codeDesc: "股万1.5_基万1_债万0.1",
              id: "1-42AQX56",
              codeValue: "6553"
            },
            {
              codeDesc: "股千1.2_基千1_债万0.8",
              id: "1-42AQX4P",
              codeValue: "6570"
            },
            {
              codeDesc: "股万1.8_基万1_债万0.1",
              id: "1-42AQX54",
              codeValue: "6555"
            },
            {
              codeDesc: "股基千1_债十万0.8",
              id: "1-42AQX4R",
              codeValue: "6568"
            },
            {
              codeDesc: "股万8_基万5_债万0.5",
              id: "1-42AQX4T",
              codeValue: "6566"
            },
            {
              codeDesc: "股万6_基万5_债万0.5",
              id: "1-42AQX4V",
              codeValue: "6564"
            },
            {
              codeDesc: "股万2.5_基万2_债万0.3",
              id: "1-42AQX50",
              codeValue: "6559"
            },
            {
              codeDesc: "股万1.4_基万1_债万0.1",
              id: "1-42AQX57",
              codeValue: "6552"
            }
          ]
        }
      ],
      custIdexPlaceHolders: [
        "${可开通业务}",
        "${开户日期}",
        "${已开通业务}"
      ],
      taskTypes: [
        {
          key: "other",
          value: "其他",
          defaultExecuteType: "Chance"
        },
        {
          key: "businessRecommend",
          value: "业务推荐",
          defaultExecuteType: "Mission"
        },
        {
          key: "newCustVisit",
          value: "新客户回访",
          defaultExecuteType: "Chance"
        },
        {
          key: "stockCustVisit",
          value: "存量客户回访",
          defaultExecuteType: "Chance"
        }
      ],
      custFeedBackDict: [
        {
          children: [
            {
              value: "态度不明确",
              key: "920001"
            }
          ],
          value: "客户评价",
          key: "920000"
        },
        {
          children: [
            {
              value: "比较反感",
              key: "930001"
            },
            {
              value: "其它",
              key: "930003"
            },
            {
              value: "拒绝",
              key: "930002"
            }
          ],
          value: "响应结果",
          key: "930000"
        },
        {
          children: [
            {
              value: "确认参加",
              key: "910001"
            },
            {
              value: "愿意进一步沟通",
              key: "910003"
            },
            {
              value: "很感兴趣",
              key: "910002"
            }
          ],
          value: "反馈结果",
          key: "910000"
        }
      ]
    }
  };
};
