/**
 * 报表看板的基础数据
 */

const BoardBasic = {
  regular: [
    {
      id: 1,
      name: '投顾业绩汇总',
      boardType: 'TYPE_TGJX',
    },
    {
      id: 2,
      name: '经营业绩汇总',
      boardType: 'TYPE_JYYJ',
    },
    {
      id: 3,
      name: '投顾业绩历史对比',
      boardType: 'TYPE_LSDB_TGJX',
    },
    {
      id: 4,
      name: '经营业绩历史对比',
      boardType: 'TYPE_LSDB_JYYJ',
    },
  ],
  types: [
    {
      name: '投顾绩效',
      key: 'TYPE_TGJX',
    },
    {
      name: '经营业绩',
      key: 'TYPE_JYYJ',
    },
  ],
};

export default BoardBasic;
