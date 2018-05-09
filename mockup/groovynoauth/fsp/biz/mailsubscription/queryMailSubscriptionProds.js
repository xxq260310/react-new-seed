/**
 * @description 资讯订阅产品查询接口
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        prodRowId: '1-4313722',
        prodId: 'SP0539',
        prodName: '涨停板揭秘',
        prodCd: 'Service',
        statusCd: '415010',
        subTypeCd: '501070',
        descText: '',
        region: '',
        city: '',
        commission: '',
        maxCommission: '',
        comments: '',
        prdtInvHorizon: '3',
        prdtRiskLevel: '5',
        prdtInvBreed: '5',
        basicPackageFlg: 'N',
        applyEcRuleFlg: 'N',
        custId: '1-10004NO',
        custType: 'per',
        csn: 'A000000004261653',
        assetNum: 'SP0539A000000004261653',
        subProds: [
          {
            parProdId: '1-4313722',
            parProdCode: 'SP0539',
            prodRowid: '1-431372201',
            prodCode: 'SPD025',
            prodName: '子产品',
            subTypeCd: '',
            invstCatgCd: '',
            statusCd: '',
            xDefaultOpenFlag: 'Y',
          },
        ],
      },
    ],
  };
};
