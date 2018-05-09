/**
 * @description 查询审批人员列表
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      employList: [
        {
          empId: '1',
          empNo: '002332',
          empName: '魏魏',
          belowDept: '南京长江路营业部',
        },
        {
          empId: '2',
          empNo: '001477',
          empName: '001477',
          belowDept: '南京长江路营业部',
        },
        {
          empId: '3',
          empNo: '007862',
          empName: '007862',
          belowDept: '南京长江路营业部',
        },
        {
          empId: '4',
          empNo: '005947',
          empName: '005947',
          belowDept: '南京长江路营业部',
        },
      ],
    },
  };
};
