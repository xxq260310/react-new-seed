/**
 * 绩效指标
*/
exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": {
      "cftCust":"40",  // 涨乐财付通
      "dateType":"518005",
      "finaTranAmt":"25",  // 公募基金
      "fundTranAmt":"18",  // 紫金产品
      "hkCust":"40",      // 沪港通 + 深港通
      "shHkCust":"20",   // 沪港通
      "szHkCust":"20",   // 深港通
      "newProdCust":"2500",  // 新增产品客户
      "optCust":"35",    // 期权
      "otcTranAmt":"18",   // OTC
      "privateTranAmt":"18",  // 证券投资类私募
      "purAddCust":"180",  // 净新增有效户
      "purAddCustaset":"10000033333330",  // 净新增客户资产
      "purAddHighprodcust":"1900",  // 净新增高端产品户
      "purAddNoretailcust":"1800",  // 净新增非零售客户
      "purRakeGjpdt":"10305023333330",  // 股基累计净佣金
      "rzrqCust":"50",    // 融资融券
      "staId":"002332",
      "staType":"1",
      "tranAmtBasicpdt":"1533333000",  // 累计基础交易量
      "tranAmtTotpdt":"13033333300",   // 累计综合交易量
      "ttfCust":"50",   //  天天发
      "motOkMnt":"0.45",  // 必做MOT总数量
      "motTotMnt":"1",    // 必做MOT完成数量
      "taskCust":"0.45",  // 客户服务总数量
      "totCust":"1"      // 客户服务覆盖数
    }
  }
}
/**
 * 客户指标（客户数）：
purAddCust：净新增有效户数
purAddNoretailcust:净新增非零售客户数
purAddHighprodcust:净新增高端产品户数
newProdCust:新增产品客户数
业务办理（累计开通客户数）：
ttfCust：天天发开通客户数
optCust:期权开通客户数
cftCust:涨乐财富通开通客户数
hkCust:港股通开通客户数
rzrqCust:融资融券开通客户数
交易量（资产及交易指标）
purAddCustaset：净新增客户资产
tranAmtBasicpdt：累计基础交易量
tranAmtTotpdt：累计综合交易量
purRakeGjpdt：股基累计净佣金
*/