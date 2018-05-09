/**
 * 用户反馈模块的接口
 */

export default function contract(api) {
  return {
    // 获取详情信息
    getContractDetail: query => api.post('/groovynoauth/fsp/contract/cooper/queryDetail', query),
    // 获取附件信息
    getAttachList: query => api.post('/groovynoauth/fsp/contract/cooper/queryAttaches', query),
    // 获取附件列表
    getAttachmentList: query => api.post('/file/ceFileList', query),
    // 保存合作合约
    saveContractData: query => api.post('/groovynoauth/fsp/contract/cooper/saveContract', query),
    // 查询合作合约编号
    getContractNumList: query => api.post('/groovynoauth/fsp/contract/cooper/queryNumList', query),
    // 查询合作部门
    getCooperDeparmentList: query => api.post('/groovynoauth/fsp/contract/cooper/queryDeparment', query),
    // 查询合约条款名称列表
    getClauseNameList: query => api.post('/groovynoauth/fsp/contract/cooper/termNameList', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    getFlowHistory: query => api.post('/groovynoauth/fsp/flow/queryFlowHistory', query),
    // 合作合约退订
    contractUnSubscribe: query => api.post('/groovynoauth/fsp/contract/cooper/addFlow', query),
    // 查询审批人列表
    getFlowStepInfo: query => api.post('/groovynoauth/fsp/contract/cooper/queryFlowStepInfo', query),
    // 审批流程
    postDoApprove: query => api.post('/groovynoauth/fsp/contract/cooper/doApprove', query),
  };
}
