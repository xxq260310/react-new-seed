/**
 * @description 查询佣金调整客户申请审批记录
 * @author sunweibin
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: [
      {
        entryTime: '2017-09-18 17:34:20',
        handler: '002332',
        handleName: '鲍佳佳',
        handleTime: '2017-09-18 17:34:19',
        comment: '通过:流程发起',
        stepName: '发起',
      },
      {
        entryTime: '2017-09-18 17:34:19',
        handler: '001477',
        handleName: '孙伟斌',
        handleTime: '2017-09-18 19:44:19',
        comment: '驳回:通过',
        stepName: '营业部负责人审核',
      },
    ],
  };
};
