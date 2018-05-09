/**
 * @description 头部根据用户输入的关键字，查询拟稿人信息列表
 * @author hongguangqing
 */
exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      page: {
        pageNum: 1,
        pageSize: 10,
        totalCount: 1,
        totalPage: 1,
      },
      empList: [
        {
          empId: '012345',
          empName: '孙伟斌',
        },
        {
          empId: '456789',
          empName: '鲍佳佳',
        },
        {
          empId: '345678',
          empName: '洪光情',
        },
        {
          empId: '234567',
          empName: '刘建树',
        },
        {
          empId: '123456',
          empName: '毛权',
        },
      ],
    },
  };
};
