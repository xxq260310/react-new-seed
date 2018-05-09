/*
 * @Description: 设置主职位的接口
 * @Author: LiuJianShu
 * @Date: 2017-12-21 15:08:01
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-03-01 16:42:27
 */

export default function mainPosition(api) {
  return {
    // 获取详情信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/emp/org/queryApplicationDetail', query),
    // 查询分公司范围内的员工
    searchEmployee: query => api.post('/groovynoauth/fsp/emp/emplist/queryEmps', query),
    // 根据员工 ID 查询员工职位
    searchPosition: query => api.post('/groovynoauth/fsp/emp/org/queryEmpPostnInfos', query),
    // 设置主职位
    updatePosition: query => api.post('/groovynoauth/fsp/emp/org/chgMainPostn', query),
    // 保存，修改接口
    updateApplication: query => api.post('/groovynoauth/fsp/emp/org/updateApplication', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/emp/org/queryNextStepInfo', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/emp/org/doApprove', query),
    // 消息通知页面接口
    getNotifies: query => api.post('/groovynoauth/fsp/emp/org/queryNotifies', query),
  };
}
