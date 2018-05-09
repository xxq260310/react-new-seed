/**
 * @description 资讯退订，可退订的服务
 * @author baojiajia
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        custRowId: '1-2LT84UI',
        prodId: 'SP0371',
        prodName: '债券提示',
        prodRowId: '1-19QKVUI',
        subProds: [
          {
            rowId: '1-42BCHTP',
            prodRowid: '1-19QKVUI',
            custRowId: '1-2X8PBLM',
            prodId: 'SP0371',
            prodName: '债券提示',
            pProdId: '1-19QKVUI',
          },
        ],
      },
    ],
  };
};
