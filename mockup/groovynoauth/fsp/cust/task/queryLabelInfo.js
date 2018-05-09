/**
 * 标签圈人查询
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [
      {
        "id": "2098",
        "tagNumId": "208_1",
        "labelName": "新三板客户",
        "labelMapping": "shi_fou_xin_san_ban",
        "labelDesc": "已开通新三板权限",
        "createrName": null,
        "createDate": null,
        "customNum": "0"
      }, {
        "id": "2103",
        "tagNumId": "223_1",
        "labelName": "融资打新客户",
        "labelMapping": "shi_fou_rong_zi_da_xin",
        "labelDesc": "已开通融资打新权限",
        "createrName": null,
        "createDate": null,
        "customNum": "0"
      }, {
        "id": "2146",
        "tagNumId": "625_1",
        "labelName": "潜在高净值客户",
        "labelMapping": "qian_zai_gao_jing_zhi",
        "labelDesc": "近三个月内新开户且账户资产较低的客群中的潜在高净值客户（可用资产大于100w）",
        "createrName": null,
        "createDate": null,
        "customNum": "0"
      }
    ]
  }
}
