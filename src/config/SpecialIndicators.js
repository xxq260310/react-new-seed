export default {};

// 特殊指标key，用来处理不展示散点图
export const EXCEPT_CUST_JYYJ_MAP = [
  {
    key: 'effCustNum',
    value: '有效客户数',
  },
  {
    key: 'totCustNum',
    value: '总客户数',
  },
  {
    key: 'pCustNum',
    value: '个人客户数',
  },

  {
    key: 'oNoPrdtCustNum',
    value: '机构客户数一般',
  },

  {
    key: 'oPrdtCustNum',
    value: '机构客户数产品',
  },
  {
    key: 'minorCustNum',
    value: '零售客户数',
  },
  {
    key: 'InminorCustNum',
    value: '高净值客户数',
  },
  {
    key: 'pNewCustNum',
    value: '新开客户数个人',
  },
  {
    key: 'oNoPrdtCustNum',
    value: '新开客户数一般',
  },
  {
    key: 'oPrdtCustNum',
    value: '新开客户数产品',
  }, {
    key: 'gjzCustNumSingle',
    value: '高净值客户总数个人',
  },
  {
    key: 'gjzCustNumOrgan',
    value: '高净值客户总数机构',
  },
];

export const EXCEPT_CUST_TGJX_MAP = [
  {
    key: 'newCustInAset',
    value: '新开客户资产',
  },
  {
    key: 'custNum',
    value: '服务客户数',
  }, {
    key: 'currSignCustNum',
    value: '签约客户数',
  },
  {
    key: 'effSignCustNum',
    value: '有效签约客户数',
  },
];

export const EXCEPT_CUST_TOUGU_TGJX_MAP = [
  {
    key: 'tgInNum',
    value: '投顾入岗人数',
  },
  {
    key: 'tgNum',
    value: '投顾人数',
  },
];

export const EXCEPT_TOUGU_JYYJ_MAP = [
  {
    key: 'ptyMngNum',
    value: '服务经理数',
  },
];

export const COMMISSION_RATE_MAP = [
  {
    key: 'signPurPercent',
    value: '签约平均佣金率',
  },
  {
    key: 'gjAvgPercent',
    value: '股基平均佣金率',
  },
];
