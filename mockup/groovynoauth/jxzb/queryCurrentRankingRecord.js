exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "scopeNum": "21",
      "data": [
        {
            "rank_current": "1",
            "rank_contrast": "21",
            "indicator_id": "effCustNum",
            "indicator_name":"有效客户数"
        },
        {
            "rank_current": "1",
            "rank_contrast": "21",
            "indicator_id": "InminorCustNum",
            "indicator_name":"高净值客户数"
        },
        {
            "rank_current": "8",
            "rank_contrast": "5",
            "indicator_id": "totCustNum",
            "indicator_name":"总客户数"
        },
        {
            "rank_current": "7",
            "rank_contrast": "3",
            "indicator_id": "pCustNum",
            "indicator_name":"个人客户数"
        },
        {
            "rank_current": "6",
            "rank_contrast": "2",
            "indicator_id": "minorCustNum",
            "indicator_name":"零售客户数"
        }
      ]
    }
  }
}