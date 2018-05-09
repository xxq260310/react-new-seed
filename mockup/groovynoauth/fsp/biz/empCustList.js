/**
 * @description 头部根据用户输入的关键字，查询已经申请客户信息列表
 * @author hongguangqing
 */
exports.response = function (req, res) {
  return{
    code: '0',
    msg: 'OK',
    resultData: {
      custList: [
        {
          custNumber: '1-3UUZ9JF',
          custName: '潘**',
        },
        {
          custNumber: '1-3VRN4YA',
          custName: '金**',
        },
        {
          custNumber: '1-3UUZ9JF',
          custName: '潘**',
        },
        {
          custNumber: '1-3VRN4YA',
          custName: '金**',
        },
        {
          custNumber: '1-3UUZ9JF',
          custName: '潘**',
        },
        {
          custNumber: '1-3VRN4YA',
          custName: '金**',
        },
      ],
    },
  };
};
