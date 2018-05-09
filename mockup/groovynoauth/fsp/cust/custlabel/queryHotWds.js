/**
 * 默认推荐词及热词推荐列表
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "hotWds": {
        "id": "1359",
        "tagNumId": "462_1",
        "labelMapping": "shi_fou_gu_piao_ke_hu",
        "labelNameVal": "股票客户",
        "labelDesc": "3个月内股票持仓超过1万"
      },
      "hotWdsList": [
        {
          "id": "1353",
          "tagNumId": "219_1",
          "labelMapping": "shi_fou_otc_ke_hu",
          "labelNameVal": "OTC账户",
          "labelDesc": "三个月内OTC产品持仓超过1万"
        },
        {
          "id": "1355",
          "tagNumId": "218_1",
          "labelMapping": "shi_fou_hui_gou_ke_hu",
          "labelNameVal": "回购账户",
          "labelDesc": "三个月内回购持仓超过1万"
        },
        {
          "id": "1356",
          "tagNumId": "216_1",
          "labelMapping": "shi_fou_ji_jin_ke_hu",
          "labelNameVal": "基金账户",
          "labelDesc": "三个月内基金份额持仓超过1万"
        },
        {
          "id": "1358",
          "tagNumId": "232_1",
          "labelMapping": "shi_fou_da_zhuan_pan",
          "labelNameVal": "大转盘客户",
          "labelDesc": "近一个月参与大转盘次数超过１次"
        },
        {
          "id": "1359",
          "tagNumId": "462_1",
          "labelMapping": "shi_fou_gu_piao_ke_hu",
          "labelNameVal": "股票客户",
          "labelDesc": "3个月内股票持仓超过1万"
        }
      ]
    }
  }
}
