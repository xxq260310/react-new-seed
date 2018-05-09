/*
 * @Author: sunweibin
 * @Date: 2017-10-25 13:34:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-10-25 16:36:45
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      orderId: '1-ffff',
      flowCode: '12345678909876543223456789',
      operationType: '佣金调整',
      workFlowName: '流程名称',
      workFlowNumber: '56789009876543',
      nextProcessLogin: '流程节点处理人工号',
      prodCode: '产品代码',
      status: '完成',
      divisionId: 'zz007896',
      divisionName: '南京长江路营业部',
      createdBy: '002332',
      lastUpdBy: '002332',
      createdByName: '王华',
      createdByLogin: '002332',
      created: '2017/10/25',
      custNum: '01003066',
      custName: '1-8M-9195',
      serviceDivisionName: '服务营业部',
      serviceManager: '李四',
      serviceManagerLogin: '456789',
      custLevel: '钻石',
      openDivisinoName: '长江路营业部',
      state: '省/（直辖）市',
      city: '城市',
      currentCommission: '0.3',
      newCommission: '0.3',
      zqCommission: '0.3',
      stkCommission: '0.3',
      creditCommission: '0.3',
      ddCommission: '0.3',
      hCommission: '0.3',
      dzCommission: '0.3',
      coCommission: '0.3',
      stbCommission: '0.3',
      oCommission: '0.3',
      doCommission: '0.3',
      hkCommission: '0.3',
      bgCommission: '0.3',
      qCommission: '0.3',
      dqCommission: '0.3',
      opCommission: '0.3',
      dCommission: '0.3',
      comments: '我是备注我是备注我是备注我是备注我是备注我是备注我是备注我是备注',
      attachmentNum: '11111111111111',
      item: [
        {
          prodCode: 'SP0003',
          aliasName: '成交回报（短信）',
          prodCommission: '0.21',
          riskMatch: 'Y',
          prodMatch: 'N',
          termMatch: 'N',
          agrType: '服务计划书',
          subItem: [
            {
              prodCode: 'SP0003-1',
              aliasName: '成交回报子',
              prodCommission: '0.12',
              riskMatch: 'N',
              prodMatch: 'Y',
              termMatch: 'Y',
              agrType: '服务计划书',
            }
          ]
        }
      ]
    }
  };
};
