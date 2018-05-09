/**
 * 目标客户池模块的接口
 */

export default function customerPool(api) {
  return {
    // 经营指标新增客户指标区域接口
    getCustCount: query => api.post('/groovynoauth/fsp/emp/kpi/queryNewCustCount2', query),
    // 获取资讯中心统一接口
    getInformation: query => api.post('/groovynoauth/fsp/info/infoCenter/queryInfo', query),
    // 获取客户池沪深归集率 和 业务开通指标（经营指标）
    getManagerIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryManageKPIs', query),
    // 获取客户池投顾绩效
    getPerformanceIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryPerformanceKPIs', query),
    // 获取组织机构树完整版
    getCustRangeAll: query => api.post('/groovynoauth/fsp/emp/org/queryEmpOrgTree', query),

    // 按权限获取组织机构树
    getCustRangeByAuthority: query => api.post('/groovynoauth/fsp/emp/org/queryEmpPostnsOrgTree2', query),

    // 查询待办流程记录列表
    getToDoList: query => api.post('/groovynoauth/fsp/emp/workflow/queryWorkFlowTaskList', query),

    // 获取客户池经营指标
    // getManageIndicators: query => api.post('/groovynoauth/fsp/emp/kpi/queryEmpKPIs', query),

    // 统计周期
    getStatisticalPeriod: query => api.post('/groovynoauth/fsp/dictionary', query),

    // (首页总数)
    getQueryNumbers: query => api.post('/groovynoauth/fsp/emp/todealwith/queryNumbers', query),

    // 今日可做任务总数
    getMotTaskCount: query => api.post('/groovynoauth/fsp/emp/notification/queryMotTaskCount', query),

    // 客户列表
    getCustomerList: query => api.post('/groovynoauth/fsp/cust/custlist/queryCustList2', query),

    // 客户列表中的6个月的收益数据
    getCustIncome: query => api.post('/groovynoauth/fsp/cust/custlist/queryCustIncome', query),

    // 默认推荐词及热词推荐列表
    getHotWds: query => api.post('/groovynoauth/fsp/cust/custlabel/queryHotWds2', query),

    // 联想的推荐热词列表
    getHotPossibleWds: query => api.post('/groovynoauth/fsp/cust/custlabel/queryPossibleHotWds2', query),

    // 客户分组列表信息
    customerGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustGroupList', query),

    // 添加客户到现有分组
    saveCustGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/saveCustGroupList2', query),

    // 添加客户到新建分组
    createCustGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/createCustGroup2', query),

    // 客户分组批量导入客户解析客户列表
    queryBatchCustList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryBatchCust', query),

    // 自建任务提交
    createTask: query => api.post('/groovynoauth/fsp/cust/task/createTask', query),

    // 自建任务编辑后，重新提交
    updateTask: query => api.post('/groovynoauth/fsp/cust/task/updateTask', query),

    // 客户列表页添加服务记录
    addCommonServeRecord: query => api.post('/groovynoauth/fsp/cust/service/addCommonServeRecord', query),

    // 净创收数据
    queryKpiIncome: query => api.post('/groovynoauth/fsp/emp/kpi/queryNetIncome', query),

    // 查询机构与个人联系方式
    queryCustContact: query => api.post('/groovynoauth/fsp/cust/custlist/fspQueryCustContact', query),

    // 查询最近五次服务记录
    queryRecentServiceRecord: query => api.post('/groovynoauth/fsp/cust/service/queryRecentServiceRecord', query),

    // 关注与取消关注
    followCust: query => api.post('/groovynoauth/fsp/cust/custgroup/followCust', query),

    // 分组维度，客户分组列表
    queryCustomerGroupList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryCustGroupList', query),

    // 某一个分组下面的客户列表
    queryGroupCustomerList: query => api.post('/groovynoauth/fsp/cust/custgroup/queryGroupCustList', query),

    // 查询客户列表，用于分组详情里面的客户搜索，联想
    queryPossibleCustList: query => api.post('/groovynoauth/fsp/biz/custList', query),

    // 操作分组（编辑、新增客户分组）
    operateGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/operateGroup2', query),

    // 删除分组
    deleteGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/deleteGroup', query),

    // 删除分组下的客户
    deleteCustomerFromGroup: query => api.post('/groovynoauth/fsp/cust/custgroup/operateCust', query),

    // 360服务记录查询
    queryServeRecords: query => api.post('/groovynoauth/fsp/cust/task/queryServeRecords', query),

    // 查询某客户的服务人员待选择列表
    getSearchServerPersonelList: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),

    queryAllServiceRecord: query => api.post('/groovynoauth/fsp/cust/service/queryAllChannelServiceRecord', query),

    // 预览客户细分数据
    previewCustFile: query => api.post('/groovynoauth/fsp/cust/custlist/previewCustFile', query),

    // 查询审批人列表
    queryFlowStepInfo: query => api.post('/groovynoauth/fsp/cust/task/queryFlowStepInfo', query),

    queryLabelPeople: query => api.post('/groovynoauth/fsp/cust/task/queryLabelPeople', query),

    queryLabelInfo: query => api.post('/groovynoauth/fsp/cust/task/queryLabelInfo2', query),

    // 提交任务流程
    submitTaskFlow: query => api.post('/groovynoauth/fsp/cust/task/createTask', query),

    // 任务列表-任务详情基本信息
    queryBasicInfo: query => api.post('/groovynoauth/fsp/flow/queryBasicInfo', query),

    // 文件下载文件列表数据
    ceFileList: query => api.post('/file/ceFileList', query),

    // 生成问卷模板id
    generateTemplateId: query => api.post('/groovynoauth/fsp/assess/common/saveTemplate', query),

    // 查询一级指标数据
    queryIndicatorData: query => api.post('/groovynoauth/fsp/campaign/mot/queryTraceIndexDic', query),

    // 查询产品接口
    queryProduct: query => api.post('/groovynoauth/fsp/product/finprod/queryFinProductList', query),

    // 查询导入的客户、标签圈人下的客户、客户列表选择的客户、客户分组下的客户是否超过了1000个或者是否是我名下的客户
    isSendCustsServedByPostn: query => api.post('/groovynoauth/fsp/cust/task/isSendCustsServedByEmp', query),

    // 查询客户是否是我名下的客户
    isCustServedByPostn: query => api.post('/groovynoauth/fsp/cust/task/isCustServedByPostn', query),

    // 上传文件需要先上传uuid
    // queryCustUuid: query => api.post('/groovynoauth/fsp/campaign/mot/queryCustUuid', query),

    // 删除文件
    // ceFileDelete: query => api.post('/file/ceFileDelete', query),

    // 审批流程获取按钮
    queryApprovalBtn: query => api.post('/groovynoauth/fsp/flow/queryApprovalBtn', query),

    // 提交审批流程
    submitApproval: query => api.post('/groovynoauth/fsp/flow/submitApproval', query),
  };
}
