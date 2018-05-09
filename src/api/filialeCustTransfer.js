/*
 * @Author: XuWenKang
 * @Description 分公司客户划转相关接口
 * @Date: 2017-12-13 10:16:45
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-02-06 16:58:30
 */

export default function cust(api) {
  return {
    // 获取详情信息
    getDetailInfo: query => api.post('/groovynoauth/fsp/cust/manager/queryApplicationDetail', query),
    // 获取原客户经理
    getOldManager: query => api.post('/groovynoauth/fsp/cust/manager/queryCustServiceInfo', query),
    // 查询客户列表
    getCustList: query => api.post('/groovynoauth/fsp/cust/manager/queryCustListByPostn', query),
    // 获取新服务经理列表
    getNewManagerList: query => api.post('/groovynoauth/fsp/cust/manager/queryEmpPostns', query),
    // 保存，修改接口
    saveChange: query => api.post('/groovynoauth/fsp/cust/manager/changeCustmentAssignment', query),
    // 获取批量划转的数据
    queryCustomerAssignImport: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignImport', query),
    // 提交批量划转请求
    validateData: query => api.post('/groovynoauth/fsp/cust/manager/valiateBatchCustomerAssignImport', query),
    // 下一步按钮和下一步审批人
    getButtonList: query => api.post('/groovynoauth/fsp/cust/manager/queryNextStepInfo', query),
    // 走流程接口
    doApprove: query => api.post('/groovynoauth/fsp/cust/manager/doApprove', query),
    // 客户表格分页信息
    getPageAssignment: query => api.post('/groovynoauth/fsp/cust/manager/queryPageAssignment', query),
    // 批量划转的错误信息提醒
    getNotifiesInfo: query => api.post('/groovynoauth/fsp/cust/manager/queryCustomerAssignValidateResult', query),
  };
}
