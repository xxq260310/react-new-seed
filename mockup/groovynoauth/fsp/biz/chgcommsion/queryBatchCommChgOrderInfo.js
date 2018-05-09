/**
 * 批量佣金调整详情
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      batchNum: '1-7814854543',
      flowCode: '',
      businessType: '批量佣金调整',
      workFlowName: '',
      nextProcessLogin: '',
      prodCode: 'PPWT05/通道佣金专用（万分之三）',
      status: '完成',
      divisionId: '1-1BJXX',
      divisionName: '西安丈八东路证券营业部',
      createdBy: '',
      lastUpdBy: '',
      createdByName: '孙伟斌',
      createdByLogin: '006069',
      created: '2017/08/31',
      custNum: null,
      custName: null,
      serviceDivisionName: null,
      custLevel: null,
      openDivisinoName: null,
      state: null,
      city: null,
      currentCommission: '3.0',
      newCommission: '2.5',
      zqCommission: '万3.0',
      stkCommission: '万3.0',
      creditCommission: '万3.0',
      ddCommission: '万3.0',
      hCommission: '万3.0',
      dzCommission: '万3.0',
      coCommission: '万3.0',
      stbCommission: '万3.0',
      oCommission: '万3.0',
      doCommission: '万3.0',
      hkCommission: '万2.5',
      bgCommission: '万3.0',
      qCommission: '万3.0',
      dqCommission: '万3.0',
      opCommission: '万3.0',
      dCommission: '万3.0',
      comments: '这是备注',
    },
  };
};
