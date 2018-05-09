/*
* @Author: XuWenKang
* @Date:   2017-10-09 13:23:40
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-30 09:53:36
*/
exports.response = function (req, res) {
    return {
      "code": "0",
      "msg": "OK",
      "resultData": [
          {
              "termName": "T90820",
              "termVal": "续订股基交易量",
              "param": [
                  {
                      "name": "T90830",
                      "val": "续订股基交易量"
                  }
              ]
          },
          {
              "termName": "T90825",
              "termVal": "下挂客户续订股基交易量",
              "param": [
                  {
                      "name": "T90840",
                      "val": "下挂客户续订股基交易量"
                  }
              ]
          },
          {
              "termName": "T21800",
              "termVal": "续订股基净佣金",
              "param": [
                  {
                      "name": "T21701",
                      "val": "续订股基净佣金"
                  }
              ]
          },
          {
              "termName": "T90100",
              "termVal": "产品分仓",
              "param": [
                  {
                      "name": "T90101",
                      "val": "分仓比例"
                  }
              ]
          },
          {
              "termName": "T80100",
              "termVal": "净佣金分成",
              "param": [
                  {
                      "name": "T80101",
                      "val": "净佣金分成比例"
                  }
              ]
          },
          {
              "termName": "T92100",
              "termVal": "OTC产品分成",
              "param": [
                  {
                      "name": "T92101",
                      "val": "OTC产品分成比例"
                  }
              ]
          },
          {
              "termName": "T30200",
              "termVal": "账户服务费模式",
              "param": [
                  {
                      "name": "T30200",
                      "val": "账户服务费模式"
                  }
              ]
          },
          {
              "termName": "T92200",
              "termVal": "基金专户产品分成",
              "param": [
                  {
                      "name": "T92201",
                      "val": "基金专户产品分成比例"
                  }
              ]
          },
          {
              "termName": "T30100",
              "termVal": "佣金模式",
              "param": [
                  {
                      "name": "T30100",
                      "val": "佣金模式"
                  }
              ]
          },
          {
              "termName": "T91900",
              "termVal": "公墓基金产品分成",
              "param": [
                  {
                      "name": "T91901",
                      "val": "公墓基金产品分成比例"
                  }
              ]
          },
          {
              "termName": "T92400",
              "termVal": "私募管理人自行发行产品分成",
              "param": [
                  {
                      "name": "T92401",
                      "val": "私募管理人自行发行产品分成比例"
                  }
              ]
          },
          {
              "termName": "T92300",
              "termVal": "基金子公司产品分成",
              "param": [
                  {
                      "name": "T92301",
                      "val": "基金子公司产品分成比例"
                  }
              ]
          },
          {
              "termName": "T92700",
              "termVal": "去年净佣金",
              "param": [
                  {
                      "name": "T92701",
                      "val": "去年净佣金"
                  }
              ]
          },
          {
              "termName": "T92000",
              "termVal": "非公募产品（其他类型）分成",
              "param": [
                  {
                      "name": "T92001",
                      "val": "非公募产品分成比例"
                  }
              ]
          },
          {
              "termName": "T91800",
              "termVal": "紫金产品分成",
              "param": [
                  {
                      "name": "T91801",
                      "val": "紫金产品分成比例"
                  }
              ]
          },
          {
              "termName": "T19100",
              "termVal": "去年股基交易量",
              "param": [
                  {
                      "name": "T19101",
                      "val": "去年股基交易量"
                  }
              ]
          },
          {
              "termName": "T90500",
              "termVal": "合约期间成交量",
              "param": [
                  {
                      "name": "T90501",
                      "val": "成交量值"
                  }
              ]
          },
          {
              "termName": "T21400",
              "termVal": "现金扣费",
              "param": [
                  {
                      "name": "T21411",
                      "val": "扣费方式"
                  },
                  {
                      "name": "T21401",
                      "val": "扣费金额"
                  },
                  {
                      "name": "T21403",
                      "val": "初始扣费日期"
                  },
                  {
                      "name": "T21402",
                      "val": "扣费频率"
                  }
              ]
          },
          {
              "termName": "T93090",
              "termVal": "日均保证金余额",
              "param": [
                  {
                      "name": "T93091",
                      "val": "日均保证金余额"
                  }
              ]
          },
          {
              "termName": "T90700",
              "termVal": "资产分成",
              "param": [
                  {
                      "name": "T90701",
                      "val": "资产分成比例"
                  }
              ]
          },
          {
              "termName": "T90600",
              "termVal": "交易量分成",
              "param": [
                  {
                      "name": "T90601",
                      "val": "交易量分成比例"
                  }
              ]
          },
          {
              "termName": "T92930",
              "termVal": "佣金上限",
              "param": [
                  {
                      "name": "T92931",
                      "val": "佣金上限"
                  }
              ]
          },
          {
              "termName": "T21500",
              "termVal": "对外推送",
              "param": [
                  {
                      "name": "T21501",
                      "val": "运营商"
                  }
              ]
          },
          {
              "termName": "T92920",
              "termVal": "下调幅度",
              "param": [
                  {
                      "name": "T92921",
                      "val": "下调幅度"
                  }
              ]
          },
          {
              "termName": "T16100",
              "termVal": "交易积分",
              "param": [
                  {
                      "name": "T21601",
                      "val": "交易积分值"
                  }
              ]
          },
          {
              "termName": "T92940",
              "termVal": "佣金下限",
              "param": [
                  {
                      "name": "T92941",
                      "val": "佣金下限"
                  }
              ]
          },
          {
              "termName": "T17100",
              "termVal": "服务费率",
              "param": [
                  {
                      "name": "T17101",
                      "val": "收益率区间%"
                  },
                  {
                      "name": "T17102",
                      "val": "扣除资产比例%"
                  }
              ]
          },
          {
              "termName": "T92910",
              "termVal": "上调幅度",
              "param": [
                  {
                      "name": "T92911",
                      "val": "上调幅度"
                  }
              ]
          },
          {
              "termName": "T92800",
              "termVal": "去年总资产周转率",
              "param": [
                  {
                      "name": "T92801",
                      "val": "去年总资产周转率"
                  }
              ]
          },
          {
              "termName": "T92900",
              "termVal": "月交易量阀值",
              "param": [
                  {
                      "name": "T92901",
                      "val": "月交易量阀值"
                  }
              ]
          },
          {
              "termName": "T90200",
              "termVal": "认、申购手续费分成",
              "param": [
                  {
                      "name": "T90201",
                      "val": "分成比例"
                  }
              ]
          },
          {
              "termName": "T93060",
              "termVal": "限制性股票融资净息费收入",
              "param": [
                  {
                      "name": "T93061",
                      "val": "限制性股票融资净息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T50100",
              "termVal": "不降低佣金",
              "param": [
                  {
                      "name": "T50101",
                      "val": "不降低佣金"
                  }
              ]
          },
          {
              "termName": "T93040",
              "termVal": "股票质押净息费收入",
              "param": [
                  {
                      "name": "T93041",
                      "val": "股票质押净息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T60100",
              "termVal": "如若发生以上情况，愿意补偿赠送费用",
              "param": [
                  {
                      "name": "T60101",
                      "val": "如若发生以上情况，愿意补偿赠送费用"
                  }
              ]
          },
          {
              "termName": "T93050",
              "termVal": "限制性股票融资息费收入",
              "param": [
                  {
                      "name": "T93051",
                      "val": "限制性股票融资息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T93020",
              "termVal": "两融净息费收入",
              "param": [
                  {
                      "name": "T93021",
                      "val": "两融净息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T93030",
              "termVal": "股票质押息费收入",
              "param": [
                  {
                      "name": "T93031",
                      "val": "股票质押息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T21600",
              "termVal": "交易佣金阈值",
              "param": [
                  {
                      "name": "T93001",
                      "val": "交易佣金阈值"
                  }
              ]
          },
          {
              "termName": "T21700",
              "termVal": "佣金回馈数值",
              "param": [
                  {
                      "name": "T93002",
                      "val": "佣金回馈数值"
                  }
              ]
          },
          {
              "termName": "T70100",
              "termVal": "增加资产",
              "param": [
                  {
                      "name": "T70101",
                      "val": "增加资产"
                  }
              ]
          },
          {
              "termName": "T12100",
              "termVal": "协议期间佣金",
              "param": [
                  {
                      "name": "T12101",
                      "val": "赠送期间佣金至少达到赠送金额的倍数"
                  }
              ]
          },
          {
              "termName": "T20100",
              "termVal": "年股基交易量",
              "param": [
                  {
                      "name": "T20101",
                      "val": "年股基交易量"
                  }
              ]
          },
          {
              "termName": "T90800",
              "termVal": "下挂客户资产",
              "param": [
                  {
                      "name": "T90850",
                      "val": "下挂客户资产"
                  }
              ]
          },
          {
              "termName": "T93010",
              "termVal": "两融息费收入",
              "param": [
                  {
                      "name": "T93011",
                      "val": "两融息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T93080",
              "termVal": "行权融资净息费收入",
              "param": [
                  {
                      "name": "T93081",
                      "val": "行权融资净息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T10100",
              "termVal": "协议期间不转销户",
              "param": [
                  {
                      "name": "T10101",
                      "val": "协议期间不转销户"
                  }
              ]
          },
          {
              "termName": "T92600",
              "termVal": "佣金回馈总额",
              "param": [
                  {
                      "name": "T93003",
                      "val": "佣金回馈总额"
                  }
              ]
          },
          {
              "termName": "T11100",
              "termVal": "佣金率上调",
              "param": [
                  {
                      "name": "T11101",
                      "val": "佣金率上调额度"
                  }
              ]
          },
          {
              "termName": "T93070",
              "termVal": "行权融资息费收入",
              "param": [
                  {
                      "name": "T93071",
                      "val": "行权融资息费收入分成比例"
                  }
              ]
          },
          {
              "termName": "T15100",
              "termVal": "最终佣金",
              "param": [
                  {
                      "name": "T15101",
                      "val": "最终佣金值"
                  }
              ]
          },
          {
              "termName": "T21100",
              "termVal": "起始资产",
              "param": [
                  {
                      "name": "T21101",
                      "val": "起始资产值"
                  }
              ]
          },
          {
              "termName": "T13100",
              "termVal": "月均资产",
              "param": [
                  {
                      "name": "T13101",
                      "val": "月均资产数"
                  }
              ]
          },
          {
              "termName": "T14100",
              "termVal": "转介绍承诺",
              "param": [
                  {
                      "name": "T14101",
                      "val": "客户数"
                  },
                  {
                      "name": "T14102",
                      "val": "资产数"
                  }
              ]
          },
          {
              "termName": "T21200",
              "termVal": "冻结资产",
              "param": [
                  {
                      "name": "T21201",
                      "val": "冻结资产值"
                  }
              ]
          },
          {
              "termName": "T21300",
              "termVal": "最低资产",
              "param": [
                  {
                      "name": "T21301",
                      "val": "最低资产值"
                  }
              ]
          },
          {
              "termName": "T30300",
              "termVal": "净资产",
              "param": [
                  {
                      "name": "T30300",
                      "val": "净资产"
                  }
              ]
          },
          {
              "termName": "T30400",
              "termVal": "账户服务费率",
              "param": [
                  {
                      "name": "T30400",
                      "val": "账户服务费率"
                  }
              ]
          }
      ]
  }
}