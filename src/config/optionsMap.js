/*
* @Author: LiuJianShu
* @Date:   2017-04-26 11:17:08
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2017-12-29 17:41:07
*/

const optionsMap = {
  // 头部查询条件
  headBar: [
    {
      key: 'invest',
      name: '投顾业绩汇总',
      url: '/invest',
    },
    {
      key: 'business',
      name: '经营业绩汇总',
      url: '/business',
    },
  ],
  // 时间选择
  time: [
    {
      key: 'beforeLastMonth',
      name: '上上月',
    },
    {
      key: 'lastMonth',
      name: '上月',
    },
    {
      key: 'month',
      name: '本月',
    },
    {
      key: 'quarter',
      name: '本季',
    },
    {
      key: 'year',
      name: '本年',
    },
  ],
  customerPoolTimeSelect: [
    {
      key: '518003',
      name: '本月',
    },
    {
      key: '518004',
      name: '本季',
    },
    {
      key: '518005',
      name: '本年',
    },
  ],
  historyTime: [
    {
      key: 'month',
      name: '本月',
    },
    {
      key: 'quarter',
      name: '本季',
    },
    {
      key: 'year',
      name: '本年',
    },
    {
      key: 'lastMonth',
      name: '上月',
    },
    {
      key: 'lastQuarter',
      name: '上季',
    },
    {
      key: 'lastYear',
      name: '去年',
    },
  ],
  compare: [
    {
      key: 'MoM',
      name: '环比',
    },
    {
      key: 'YoY',
      name: '同比',
    },
  ],
  visibleBoardType: {
    ordinary: {
      key: 'ordinary',
      name: '普通看板',
    },
    history: {
      key: 'history',
      name: '历史对比看板',
    },
    manage: {
      key: 'manage',
      name: '看板管理',
    },
  },
  // 按类别排序
  sortByType: {
    TYPE_TGJX: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '财富中心',
      },
      {
        scope: '4',
        name: '营业部',
      },
      {
        scope: '5',
        name: '投顾',
      },
    ],
    TYPE_JYYJ: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '财富中心',
      },
      {
        scope: '4',
        name: '营业部',
      },
      {
        scope: '5',
        name: '服务经理',
      },
    ],
    TYPE_LSDB_TGJX: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '财富中心',
      },
      {
        scope: '4',
        name: '营业部',
      },
      {
        scope: '5',
        name: '投顾',
      },
    ],
    TYPE_LSDB_JYYJ: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '财富中心',
      },
      {
        scope: '4',
        name: '营业部',
      },
      {
        scope: '5',
        name: '服务经理',
      },
    ],
    REPORT_RELATION_TYPE: [
      {
        scope: '2',
        name: '分公司',
      },
      {
        scope: '3',
        name: '财富中心',
      },
      {
        scope: '4',
        name: '团队',
      },
      {
        scope: '5',
        name: '成员',
      },
    ],
  },
  // 按顺序排序
  sortByOrder: [
    {
      key: 'desc',
      name: '自高到低',
    },
    {
      key: 'asc',
      name: '自低到高',
    },
  ],
  // 显示类型
  showType: [
    {
      key: '1',
      type: 'tables',
      title: '表格视图',
      active: 'active',
    },
    {
      key: '2',
      type: 'zhuzhuangtu',
      title: '柱状图',
      active: '',
    },
  ],
  // 看板类型
  boardTypeMap: {
    tgjx: 'TYPE_TGJX',
    jyyj: 'TYPE_JYYJ',
    lsdb_jyyj: 'TYPE_LSDB_JYYJ',
    lsdb_tgjx: 'TYPE_LSDB_TGJX',
  },
  // 指标类型
  boardKeyName: {
    summury: {
      key: 'summury',
      name: '总量指标',
      title: '总量指标是该指标针对当前组织在指定时间范围内的汇总值',
    },
    detail: {
      key: 'detail',
      name: '明细指标',
      title: '明细指标展示在选定时间范围内针对该项指标的业绩排序图',
    },
  },
  // 关系树筛选
  summaryTypeSelect: [
    {
      value: 'hbgx',
      name: '汇报关系汇总',
    },
    {
      value: 'jxst',
      name: '组织机构汇总',
    },
  ],
  // 雷达图字典
  charRadarOrgClass: {
    // 雷达图组织机构对应字典
    custRangeOrgClass: {
      level2: '分公司',
      level3: '财富中心',
      level4: '营业部',
    },
    // 雷达图汇报关系对应字典
    reportOrgClass: {
      level2: '分公司',
      level3: '财富中心',
      level4: '团队',
    },
  },
};

export default optionsMap;
