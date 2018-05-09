/**
 * @Author: sunweibin
 * @Date: 2017-11-03 19:11:31
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-03 19:13:45
 * @description 获取驳回修改的按钮
 */

exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      btnList: [
        {
          flowBtnId: 119001,
          groupId: 'yjfhg_group',
          nextGroupId: 'FINSH',
          flowName: '佣金调整批量处理流程',
          nodeType: 'normal',
          currentNodeName: '营业部佣金复核岗审核',
          nextNodeName: '终止办结',
          routeId: 'falseOver',
          routeType: 'common',
          handlerPreffered: null,
          approverQueryExpress: '119000',
          approverNum: 'none',
          btnName: '提交',
          extraParam: null,
          valiAuditorNum: null,
          valiDivisionNum: null,
          valiDivisionNames: null
        },
        {
          flowBtnId: 119002,
          groupId: 'yjfhg_group',
          nextGroupId: 'FINSH',
          flowName: '佣金调整批量处理流程',
          nodeType: 'normal',
          currentNodeName: '营业部佣金复核岗审核',
          nextNodeName: '正常办结',
          routeId: 'trueOver',
          routeType: 'common',
          handlerPreffered: null,
          approverQueryExpress: '119000',
          approverNum: 'none',
          btnName: '终止',
          extraParam: null,
          valiAuditorNum: null,
          valiDivisionNum: null,
          valiDivisionNames: null
        }
      ]
    }
  };
};
