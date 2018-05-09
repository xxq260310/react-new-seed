/**
 * 创建后保存
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      id: 70,
      name: '看板postman91',
      boardType: 'TYPE_JYYJ',
      boardTypeDesc: '经营业绩',
      boardStatus: 'UNRELEASE',
      boardStatusDesc: '未发布',
      description: null,
      ownerOrgId: 'ZZ001041093',
      createTime: '2017-06-28 15:17:33',
      updateTime: '2017-06-28 15:17:33',
      pubTime: null,
      isEditable: 'N',
      summuryIndicators: null,
      detailIndicators: null,
    },
  };
};
