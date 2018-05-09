/*
 * @Author: XuWenKang
 * @Description 客户反馈相关接口
 * @Date: 2017-12-21 10:16:45
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-01-02 15:14:10
 */

export default function cust(api) {
  return {
    // 查询任务列表
    getMissionList: query => api.post('/groovynoauth/fsp/campaign/mot/queryMissionList2', query),
    // 删除任务下所关联客户反馈选项
    delCustomerFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/delCustomerFeedback', query),
    // 删除客户反馈
    delFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/delFeedback', query),
    // 增加客户反馈
    addFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/addFeedback', query),
    // 编辑客户反馈
    modifyFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/modifyFeedback', query),
    // 查询客户反馈列表
    getFeedbackList: query => api.post('/groovynoauth/fsp/campaign/mot/queryFeedbackList', query),
    // 添加任务下所关联客户反馈选项
    addCustomerFeedback: query => api.post('/groovynoauth/fsp/campaign/mot/addCustomerFeedback', query),
  };
}
