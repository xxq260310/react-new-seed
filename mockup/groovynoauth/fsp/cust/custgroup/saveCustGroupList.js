exports.response = function (req, res) {
    return {
        "code":"0",
        "msg":"OK",
         "resultData":{
            "result":"success",
            "groupId":'2',
            "message":'分组保存成功',
        }
/*             "resultData": {
                 "result": "fail",
                 "message": '分组名称重复',
             }*/
    }
}