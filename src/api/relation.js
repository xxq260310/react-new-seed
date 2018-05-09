/**
 * 汇报关系界面的接口
 */

export default function relation(api) {
  return {
    // 获取组织机构树信息
    getTreeInfo: query => api.post('/groovynoauth/jxzb/teamset/queryChildrenPos', query),
    // 获取右侧详情信息
    getDetailInfo: query => api.post('/groovynoauth/jxzb/teamset/queryCfzxAndTeamDetail', query),
    // 设置财富中心总经理
    setManager: query => api.post('/groovynoauth/jxzb/teamset/setCfzxLeader', query),
    // 更新财富中心负责人
    updateManager: query => api.post('/groovynoauth/jxzb/teamset/updateCfzxLeader', query),
    // 查询负责人列表
    searchManager: query => api.post('/groovynoauth/fsp/biz/privateCustApplication/queryEmpList', query),
    // 更新团队 || 更新团队负责人
    updateTeam: query => api.post('/groovynoauth/jxzb/teamset/updateTeam', query),
    // 添加团队
    addTeam: query => api.post('/groovynoauth/jxzb/teamset/addTeamAndSetMan', query),
    // 删除团队
    deleteTeam: query => api.post('/groovynoauth/jxzb/teamset/deleteTeam', query),
    // 添加成员
    addMember: query => api.post('/groovynoauth/jxzb/teamset/addTeamPerson', query),
    // 删除成员
    deleteMember: query => api.post('/groovynoauth/jxzb/teamset/deleteTeamPerson', query),
  };
}
