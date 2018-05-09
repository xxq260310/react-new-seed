/**
 * @file components/commissionAdjustment/commissionTransferHelper/transferPropsHelper.js
 * @description 单佣金调整、资讯订阅、资讯退订产品穿梭组件的配置项辅助
 * @author sunweibin
 */

const transferPropsHelper = {
  pagination: {
    defaultPageSize: 5,
    pageSize: 5,
    size: 'small',
  },
  singleColumns: [
    {
      title: '产品代码',
      dataIndex: 'prodCode',
      key: 'prodCode',
      width: '25%',
    },
    {
      title: '产品名称',
      dataIndex: 'prodName',
      key: 'prodName',
      width: '40%',
    },
    {
      title: '佣金率(‰)',
      dataIndex: 'prodRate',
      key: 'prodRate',
      width: '15%',
      sorter: (a, b) => Number(a.prodRate) - Number(b.prodRate),
    },
  ],
  subScribeProColumns: [
    {
      title: '产品代码',
      dataIndex: 'prodCode',
      key: 'prodCode',
      width: '25%',
    },
    {
      title: '产品名称',
      dataIndex: 'prodName',
      key: 'prodName',
      width: '40%',
    },
  ],
};

export default transferPropsHelper;
