/**
 * 联想的推荐热词列表
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "hotPossibleWdsList": [
        {
          "id": 1,
          "tagNumId": "499_1",
          "labelMapping": "shi_fou_cai_zhang_die",
          "labelNameVal": "乐米版猜涨跌1",
          "labelDesc": "乐米版猜涨跌客户"
        },
        {
          "id": 2,
          "tagNumId": "231_1",
          "labelMapping": "shi_fou_cai_zhang_die",
          "labelNameVal": "乐米版猜涨跌2",
          "labelDesc": "近三个月参与乐米版猜涨跌次数超过1次"
        }
      ]
    }
  }
}