/**
 * 标签圈人查询
*/
 exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": [
    {
      "id":"000001",
      "tagNumId":"000001",
      "labelName":"标签A",
      "labelMapping":"XXXX",
      "labelDesc":"XXXX",
      "createrName":"张三",
      "createDate":"2014年12月12日",
      "customNum":"123"
    },
    {
        "id":"000002",
        "tagNumId":"000002",
        "labelName":"标签B",
        "labelMapping":"XXXX",
        "labelDesc":"XXXX",
        "createrName":"张三",
        "createDate":"2014年12月12日",
        "customNum":"123"
    }]
  }
}
 