/**
 * 通道类型协议的接口
 */

export default function channels(api) {
  return {
    // 获取详情信息
    getProtocolDetail: query => api.post('/groovynoauth/fsp/protocol/queryProtocolDetail', query),
    // 保存详情
    saveProtocolData: query => api.post('/groovynoauth/fsp/protocol/saveProtocol', query),
    // 查询操作类型/子类型
    queryTypeVaules: query => api.post('/groovynoauth/fsp/protocol/queryTypeVaules', query),
    // 根据所选模板id查询协议条款
    queryChannelProtocolItem: query => api.post('/groovynoauth/fsp/channel/queryChannelProtocolItem', query),
    // 查询协议产品列表
    queryChannelProtocolProduct: query => api.post('/groovynoauth/fsp/channel/queryChannelProtocolProduct', query),
    // 查询客户
    queryCust: query => api.post('/groovynoauth/fsp/protocol/queryCust', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList', query),
    // 查询审批人列表
    getFlowStepInfo: query => api.post('/groovynoauth/fsp/protocol/queryFlowStepInfo', query),
    // 审批流程
    postDoApprove: query => api.post('/groovynoauth/fsp/protocol/doApprove', query),
    // 验证客户
    getCustValidate: query => api.post('/groovynoauth/fsp/protocol/custValidate', query),
    // 根据操作类型返回可用的协议列表
    queryProtocolList: query => api.post('/groovynoauth/fsp/protocol/queryProtocolList', query),
  };
}
