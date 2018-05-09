/**
 * 绩效视图模块的接口
 */

export default function report(api) {
  return {
    // 获取绩效视图的组织机构
    getCustRange: query => api.post('/groovynoauth/jxzb/newEmpOrgTree', query),

    // 获取汇报关系的组织机构
    getReportTree: query => api.post('/groovynoauth/jxzb/newReportTree', query),

    // 获取绩效统计接口
    getPerformance: query => api.post('/groovynoauth/jxzb/querySingleRecord', query),

    // 获取所有分类指标
    getChartInfo: query => api.post('/groovynoauth/jxzb/queryMultiCardRecord', query),

    // 获取某一个分类指标
    getOneChartInfo: query => api.post('/groovynoauth/jxzb/queryCategoryCardRecord', query),

    // 获取某一个分类指标下的表格数据
    getChartTableInfo: query => api.post('/groovynoauth/jxzb/queryMultiSummuryRecord', query),

    // 获取报表下所有的分类信息
    getAllClassifyIndex: query => api.get('/groovynoauth/jxzb/queryCategoryRecord', query),

    // 获取用户有权限查看(无编辑权限)的看板基本信息
    getAllVisibleReports: query => api.post('/groovynoauth/jxzb/queryVisibleBoard', query),

    // 获取用户创建报表看板时候需要的可见范围
    getVisibleRange: query => api.post('/groovynoauth/jxzb/queryNextLevelOrg', query),

    // 查询当前用户可以编辑的报表看板
    getAllEditableReports: query => api.post('/groovynoauth/jxzb/queryMultiBoard', query),

    // 保存用户创建的看板
    createBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

    // 删除看板
    deleteBoard: query => api.post('/groovynoauth/jxzb/deleteBoard', query),

    // 更新看板
    updateBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

    // 发布看板
    publishBoard: query => api.post('/groovynoauth/jxzb/updateBoard', query),

    // 查询单个看板的信息
    getOneBoardInfo: query => api.post('/groovynoauth/jxzb/querySingleBoard', query),

    // 查询指标库数据
    getIndicators: query => api.post('/groovynoauth/jxzb/queryCategoryAndIndicators', query),

    // 查询散点图
    queryContrastAnalyze: query => api.post('/groovynoauth/jxzb/queryContrastAnalyze', query),

    // 查询雷达图
    queryCurrentRankingRecord: query => api.post('/groovynoauth/jxzb/queryCurrentRankingRecord', query),
    // 查询历史指标概览数据
    getHistoryCore: query => api.post('/groovynoauth/jxzb/queryHistoryCore', query),

    // 查询强弱指示分析数据接口
    getCurrentRankingRecord: query => api.post('/groovynoauth/jxzb/queryCurrentRankingRecord', query),

    // 查询字典数据
    queryHistoryContrast: query => api.post('/groovynoauth/jxzb/queryHistoryContrast', query),

    // 查询历史对比折线图数据
    getHistoryContrastLineChartData: query => api.post('/groovynoauth/jxzb/queryContrastLineChart', query),

    // 查询历史对比排名数据
    getHistoryRankChartData: query => api.post('/groovynoauth/jxzb/queryHistoryCardRecord', query),

    // 看板名称重复验证
    distinctBoard: query => api.post('/groovynoauth/jxzb/saveBoard', query),

    // 探测接口，暴扣有数据的最大时间点和是否有权限显示切换汇报方式的字段
    getInitialData: query => api.post('/groovynoauth/jxzb/queryMaxDataDt', query),
  };
}
