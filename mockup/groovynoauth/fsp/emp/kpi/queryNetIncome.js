exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [
      {
        "key": "tranPurRakeCopy",
        "name": "净佣金收入",
        "value": '25',
        "unit": "元",
        "description": "交易净佣金收入=（股基+沪港通+深港通+股票期权+债劵+三板+其他）净佣金之和",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": null,
        "children": null,
        "isAggressive": null
      },
      {
        "key": "totCrdtIntCopy",
        "name": "净利息收入",
        "value": '18',
        "unit": "元",
        "description": "融资净利息+融券净利息+股票质押净利息+融资打新净利息+小额贷净利息+限制性股票融资净利息+股权激励行权融资净利息",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": null,
        "children": null,
        "isAggressive": null
      },
      {
        "key": "totTranInt",
        "name": "产品净手续费收入",
        "value": '18',
        "unit": "元",
        "description": "统计期内【公募+紫金（剔除天天发940018、940028、940038）+OTC+私募】产品（场外认购+场外申购+场内认购）产生手续费净收入",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": null,
        "children": null,
        "isAggressive": null
      },
      {
        "key": "pIncomeAmt",
        "name": "个人",
        "value": '18',
        "unit": "元",
        "description": "统计期内客户性质为个人的，金融产品净手续费+资本中介净利息（融券、资管资金融资）+交易净佣金",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": "净收入",
        "children": null,
        "isAggressive": null
      },
      {
        "key": "prdtOIncomeAmt",
        "name": "产品机构",
        "value": '18',
        "unit": "元",
        "description": "统计期内客户性质为产品机构的，金融产品净手续费+资本中介净利息（融券、资管资金融资）+交易净佣金",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": "净收入",
        "children": null,
        "isAggressive": null
      },
      {
        "key": "oIncomeAmt",
        "name": "机构",
        "value": '18',
        "unit": "元",
        "description": "统计期内客户性质为机构的，金融产品净手续费+资本中介净利息（融券、资管资金融资）+交易净佣金",
        "categoryKey": null,
        "isBelongsSummury": null,
        "hasChildren": null,
        "parentKey": null,
        "parentName": "净收入",
        "children": null,
        "isAggressive": null
      }
    ]
  };
};