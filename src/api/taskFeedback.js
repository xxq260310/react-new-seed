/**
 * 任务反馈模块的接口
 */

export default function taskFeedback(api) {
  return {
    // 获取问题列表
    queryQuestions: query => api.post('/groovynoauth/fsp/assess/common/queryQues', query),
    // 删除单条问题
    deleteQuestion: query => api.post('/groovynoauth/fsp/assess/common/deleteQuesFromPoolByType', query),
    // 新增单条问题
    addOneQuestion: query => api.post('/groovynoauth/fsp/assess/common/saveQuesToPoolByType', query),
  };
}
