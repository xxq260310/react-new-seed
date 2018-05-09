/**
 * 首页 我的待办事项 总数 
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "todayToDoNumbers": 1,
      "businessNumbers": 2,
      "workFlowNumbers": 3,
      "NitificationNumbers": 4
    }
  }
}
