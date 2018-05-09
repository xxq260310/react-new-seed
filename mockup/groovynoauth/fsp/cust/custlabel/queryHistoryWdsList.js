/**
 * 历史搜索记录
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "historyWdsList": [
        "潜在大户",
        "长期闲置",
      ]
    }
  }
}
