// 风险等级配置
const riskLevelConfig = {
  704010: {
    name: '激',
    title: '激进型',
    colorCls: 'jijin',
  },
  704040: {
    name: '低',
    title: '保守型（最低类别）',
    colorCls: 'zuidi',
  },
  704030: {
    name: '保',
    title: '保守型',
    colorCls: 'baoshou',
  },
  704020: {
    name: '稳',
    title: '稳健型',
    colorCls: 'wenjian',
  },
  704025: {
    name: '谨',
    title: '谨慎型',
    colorCls: 'jinshen',
  },
  704015: {
    name: '积',
    title: '积极型',
    colorCls: 'jiji',
  },
};

const rankClsConfig = {
  // 钻石
  805010: 'zuanshi',
  // 白金
  805015: 'baijin',
  // 金卡
  805020: 'jinka',
  // 银卡
  805025: 'yinka',
  // 理财
  805030: 'licai',
  // 无
  805040: 'wu',
  // 其他
  805999: '',
};

export default {
  riskLevelConfig,
  rankClsConfig,
};
