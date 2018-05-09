exports.response = function (req, res) {
  return{
    "code": "0",
    "msg": "OK",
    "resultData": {
      "childList": [
        {
          "ptyMngId":"123456",
          "ptyMngName": "小亿",
          "job": "岗位A",
          "businessDepartment": "南京长江路证券营业部"
        }, {
          "ptyMngId":"987654",
          "ptyMngName": "小二",
          "job": "岗位D",
          "businessDepartment": "北京长江路证券营业部"
        }, {
          "ptyMngId":"123789",
          "ptyMngName": "小三",
          "job": "岗位G",
          "businessDepartment": "上海长江路证券营业部"
        }, {
          "ptyMngId":"741852",
          "ptyMngName": "小气",
          "job": "岗位D",
          "businessDepartment": "天津长江路证券营业部"
        }, {
          "ptyMngId":"963852",
          "ptyMngName": "老刘",
          "job": "岗位B",
          "businessDepartment": "深圳长江路证券营业部"
        } 
      ],
    }
  }
}