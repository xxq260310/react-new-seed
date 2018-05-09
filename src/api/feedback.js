/**
 * 用户反馈模块的接口
 */

export default function feebback(api) {
  return {
    getFeedbackList: query => api.post('/groovynoauth/feedback/queryFeedbackList', query),

    getFeedbackDetail: query => api.post('/groovynoauth/feedback/feedbackDetail', query),

    getFeedbackRecordList: query => api.post('/groovynoauth/feedback/feedbackRecordList', query),

    // 处理或更新反馈问题
    updateFeedback: query => api.post('/groovynoauth/feedback/updateFeedback', query),
  };
}
