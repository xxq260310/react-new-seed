/**
 * 批量佣金接口
 */

export default function commission(api) {
  return {
    // 跳转到360视图界面必须的参数（场景：单佣金调整，新建，选择客户时，若改客户有未完成订单，会弹框提醒，点击确定会跳转到360视图界面）
    queryCustDetailInfo: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCustBrifeInfo', query),
    // 批量佣金调整Home右侧详情
    getCommissionDetail: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryBatchCommChgOrderInfo', query),
    // 批量佣金调整Home右侧详情内容中的客户列表
    getCommissionDetailCustList: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCommChgOrderCusts', query),
    // 查询批量佣金调整详情页面中查看单个用户的审批记录
    querySingleCustApprovalRecord: query => api.post('/groovynoauth/fsp/flow/queryFlowHistory', query),
    // 根据目标股基佣金率查询目标产品列表
    queryProductList: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryProduct', query),
    // 查询审批人员
    queryAprovalUserList: query => api.post('/groovynoauth/fsp/flow/queryAprovalUser', query),
    // 检验客户是否可以调整
    validateCustInfo: query => api.post('/groovynoauth/fsp/biz/chgcommsion/validateBatCommChgCust', query),
    // 提交批量佣金调整
    submitBatchCommission: query => api.post('/groovynoauth/fsp/biz/chgcommsion/saveBatchJustCommionInfo', query),
    // 提交单佣金调整申请
    submitSingleCommission: query => api.post('/groovynoauth/fsp/biz/chgcommsion/saveSingleJustCommionInfo', query),
    // 查询咨询订阅/退订详情接口
    queryConsultDetail: query => api.post('/groovynoauth/fsp/biz/mailsubscription/querySubscriptionOrderInfo', query),
    // 获取附件信息
    getAttachment: query => api.post('/file/ceFileList', query),
    // 根据用户输入的数值查询目标股基佣金率的码值
    queryGJCommissionRate: query => api.post('/groovynoauth/fsp/biz/chgcommsion/querySingelCommionJustRate', query),
    // 查询客户可以订阅的资讯产品
    queryConsultSubscribeProductList: query => api.post('/groovynoauth/fsp/biz/mailsubscription/queryMailSubscriptionProds', query),
    // 查询客户可以退订的资讯服务
    queryConsultUnSubProductList: query => api.post('/groovynoauth/fsp/biz/mailunsubscription/queryMailUnsubscriptionProds', query),
    // 新增资讯订阅申请或者资讯退订
    newConsultApply: query => api.post('/groovynoauth/fsp/biz/mailsubscription/saveMailSubscriptionInfo', query),
    // 查询单佣金调整中的产品列表信息
    querySingleCommissionProductList: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryProDuctInfo', query),
    // 查询用户选择的产品三匹配信息
    queryThreeMatchInfo: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryThreeMatchInfo', query),
    // 单佣金调整中的其他佣金费率选项
    queryOtherCommissionOptions: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryOtherCommissionRate', query),
    // 单佣金调整页面 客户查询
    querySingleCustomer: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCustInfo', query),
    // 资讯订阅与退订客户列表查询接口
    querySubscriptionCustomer: query => api.post('/groovynoauth/fsp/biz/mailsubscription/queryMailSubscriptionCusts', query),
    // 单佣金调整详情页面 当前审批步骤接口
    queryCurrentStep: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryFlowCurrentStepInfo', query),
    // 咨讯订阅和退订详情页面 当前审批步骤接口
    querySubscriStep: query => api.post('/groovynoauth/fsp/biz/mailsubscription/queryMailFlowCurrentStepInfo', query),
    // 单佣金调整详情页面 基础数据接口
    querySingleDetail: query => api.post('/groovynoauth/fsp/biz/chgcommsion/querySingleCommChgOrderInfo', query),
    // 单佣金调整新建页面中的目标股基佣金率
    querySingleGJCommissionRate: query => api.post('/groovynoauth/fsp/biz/chgcommsion/querySingleCommision', query),
    // 单佣金调整新建页面客户检验
    validateCustomer: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCustRiskInfo', query),
    // 单佣金调整的驳回修改,提交后，结转下个流程
    updateFlowStatus: query => api.post('/groovynoauth/fsp/biz/chgcommsion/updateFlowStatus', query),
    // 查询驳回后修改的页面按钮列表
    queryAprovalBtns: query => api.post('/groovynoauth/fsp/flow/queryAprovalBtns', query),
    // 咨讯订阅客户风险测评、偏好品种、投资期限校验接口
    checkCustomer: query => api.post('/groovynoauth/fsp/biz/mailsubscription/queryMailCustRiskInfo', query),
    // 查询驳回后修改的详情页面
    querySingleDetail4Update: query => api.post('/groovynoauth/fsp/biz/chgcommsion/querySingleCommChgOrderInfoForUpdate', query),
    // 查询单佣金调整客户的当前股基佣金率
    queryCustCommission: query => api.post('/groovynoauth/fsp/biz/chgcommsion/queryCustCommission', query),
  };
}
