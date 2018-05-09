/**
 * 权限申请模块的接口
 */

export default function permission(api) {
  return {
    // 获取详情信息
    getMessage: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryApplicationDetail', query),
    // 获取服务人员列表
    getServerPersonelList: query =>
    api.post('/groovynoauth/fsp/biz/privateCustApplication/queryApplicationEmpList', query),
    // 获取子类型
    getSubTypeList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/querySubType', query),
    // 新建状态下 获取已经有得服务人员列表
    getHasServerPersonList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryCustEmpList', query),
    // 查询某客户的服务人员待选择列表
    getSearchServerPersonelList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),
    // 按照提交 查询下一审批人列表
    getNextApproverList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryNextApproval', query),
    // 获取那些按钮
    getButtonList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryButtonList', query),
    // 提交 修改私密客户申请
    getModifyCustApplication: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/updateApplication', query),
    // 提交 创建私密客户申请
    getCreateCustApplication: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/createApplication', query),
  };
}
