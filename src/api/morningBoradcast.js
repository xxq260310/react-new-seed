/**
 * Created By K0170179 on 2018/1/17
 * 每日晨报相关接口
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

export default function morningBoradcast(api) {
  return {
    // 查询晨报列表相关接口
    searchBoradcastList: query => api.post('/groovynoauth/fsp/info/multimedia/queryNewsList', query),
    // 查询晨报详情
    searchBoradcastDetail: query => api.post('/groovynoauth/fsp/info/multimedia/queryNewsDetail', query),
    // 新增和修改晨报接口
    saveBoradcast: query => api.post('/groovynoauth/fsp/info/multimedia/saveNews', query),
    // 删除晨报接口
    delBoradcastItem: query => api.post('/groovynoauth/fsp/info/multimedia/deleteNews', query),
    // 获取uuid
    getNewItemUuid: query => api.post('/groovynoauth/fsp/common/queryUuids', query),
    // 文件删除
    delCeFile: query => api.post('/file/ceFileDelete', query),
    // 文件列表
    ceFileList: query => api.post('/file/ceFileList', query),
  };
}
