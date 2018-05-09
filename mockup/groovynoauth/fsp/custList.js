/**
 * @description 头部根据用户输入的关键字，查询可申请客户信息列表
 * @author hongguangqing
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      page: {
        pageSize: 10,
        curPageNum: 1,
        totalPageNum: 50,
        totalRecordNum: 499,
      },
      custList: [
        {
          cusId: '1-3YOO83T',
          custName: '刘**',
          brokerNumber: '666626443512',
          custLevelCode: '805015',
          custLevelName: '白金',
          custTotalAsset: 2669691.91,
          custType: 'per',
          custOpenDate: '2016-07-22 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3XY7RZB',
          custName: '陈**',
          brokerNumber: '666626312285',
          custLevelCode: '805020',
          custLevelName: '金',
          custTotalAsset: 0.96,
          custType: 'per',
          custOpenDate: '2016-07-01 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3VVP0SR',
          custName: '史**',
          brokerNumber: '666625970268',
          custLevelCode: '805015',
          custLevelName: '白金',
          custTotalAsset: 697.34,
          custType: 'per',
          custOpenDate: '2016-04-25 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3VRN4YA',
          custName: '同度土****资产评估造价咨询南京有限公司',
          brokerNumber: '02045709',
          custLevelCode: '805020',
          custLevelName: '金',
          custTotalAsset: 0,
          custType: 'org',
          custOpenDate: '2016-04-20 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3UVT80Y',
          custName: '南京中****限公司',
          brokerNumber: '02045700',
          custLevelCode: '805020',
          custLevelName: '金',
          custTotalAsset: 0,
          custType: 'org',
          custOpenDate: '2016-03-24 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3UUZ9JF',
          custName: '潘**',
          brokerNumber: '666625822966',
          custLevelCode: '805015',
          custLevelName: '白金',
          custTotalAsset: 1059709.88,
          custType: 'per',
          custOpenDate: '2016-03-23 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3T921SS',
          custName: '吉**',
          brokerNumber: '666625652433',
          custLevelCode: '805010',
          custLevelName: '钻石',
          custTotalAsset: 5924082.6007,
          custType: 'per',
          custOpenDate: '2016-01-27 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
        {
          cusId: '1-3T3Y0B1',
          custName: '王**',
          brokerNumber: '666625633809',
          custLevelCode: '805015',
          custLevelName: '白金',
          custTotalAsset: 2174214.1,
          custType: 'per',
          custOpenDate: '2016-01-21 00:00:00',
          riskLevel: null,  // 风险等级
          openOrgName: null,  // 开户机构名称
          openOrgId: null,  // 机构Id
        },
      ],
    },
  };
};
