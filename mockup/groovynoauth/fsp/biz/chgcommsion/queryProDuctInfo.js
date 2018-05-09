/**
 * @description 单佣金调整页面产品查询
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        id: '1-xxx-1',
        prodID: '1-xxx-1',
        prodName: '福享套餐1',
        prodCode: 'TC02',
        prodRate: '0.0001',
        isPackage: 'Y',
        children: [
          {
            id: '1-xsub-1',
            prodCode: 'Wlsub',
            prodName: 'xx子产品',
          },
        ],
      },
      {
        id: '1-xxx-2',
        prodID: '1-xxx-2',
        prodName: '持仓异动提醒2持仓异动提醒2持仓异动提醒2',
        prodCode: 'SP0258',
        prodRate: '0.0006',
        isPackage: 'Y',
        children: [
          {
            id: '1-xsub-2',
            prodCode: 'Wlsub',
            prodName: 'xx子产品',
          },
        ],
      },
      {
        id: '1-xxx-3',
        prodID: '1-xxx-3',
        prodName: '研报掘金3',
        prodCode: 'SP0449',
        prodRate: '0.0005',
        isPackage: 'Y',
        children: [
          {
            id: '1-xsub-3',
            prodCode: 'Wlsub',
            prodName: 'xx子产品',
          },
        ],
      },
      {
        id: '1-xxx-4',
        prodID: '1-xxx-4',
        prodName: '乐享套餐4持仓异动提醒2持仓异动提醒2',
        prodCode: 'TC03',
        prodRate: '0.0003',
      },
      {
        id: '1-xxx-5',
        prodID: '1-xxx-5',
        prodName: '行业投资组合精选5',
        prodCode: 'SP0449',
        prodRate: '0.0004',
      },
      {
        id: '1-xxx-6',
        prodID: '1-xxx-6',
        prodName: '福享套餐6',
        prodCode: 'TC02',
        prodRate: '0.0009',
      },
      {
        id: '1-xxx-7',
        prodID: '1-xxx-7',
        prodName: '持仓异动提醒7',
        prodCode: 'SP0258',
        prodRate: '0.0003',
      },
    ],
  };
};
