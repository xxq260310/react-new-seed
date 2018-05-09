exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "id": 440,
      "flowId": "8C5C9B41EAF3C242A4D2E035C4978317",
      "title": "私密四册四dddd李四册d哈哈哈dd测试",
      "empId": "002332",
      "empName": "王华", // 拟稿
      "orgId": "ZZ001041051",
      "orgName": "南京长江路证券营业部", 
      "type": "01",
      "subType": "0103", // 子类型
      "status": "04", // 状态
      "custNumber": "1-3UUZ9JF", // 客户id
      "custName": "强哥", // 客户
      "createTime": "2017-09-21 13:38:34", // 提请时间
      "modifyTime": null,
      "remark": "备注备注备注备注hahaha备注", // 备注
      "empList": [ // 主服务经理
        {
          "ptyMngId": "22222",
          "ptyMngName": "小强",
          "job": "HTSC002332",
          "businessDepartment": "南京长江路证券营业部",
          "isMain": "Y"
        },
        {
          "ptyMngId": "11111",
          "ptyMngName": "王华",
          "job": "HTSC002332",
          "businessDepartment": "南京长江路证券营业部",
          "isMain": "Y"
        },
        {
          "ptyMngId": "33333",
          "ptyMngName": "小明",
          "job": "HTSC002332",
          "businessDepartment": "南京长江路证券营业部",
          "isMain": "N"
        },
        {
          "ptyMngId": "44444",
          "ptyMngName": "小红",
          "job": "HTSC002332",
          "businessDepartment": "南京长江路证券营业部",
          "isMain": "N"
        },
      ],
      "workflowHistoryBeans": [ //这里是审批历史
      ],
      "attachInfoList":[
        {
          "creator": "002331",
          "attachId": "{C70B06ssa-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "name": "sxx.txt",
          "size": "60",
          "createTime": "2017/09/22 13:14:46",
          "downloadURL": "http://ceflow:8086/unstructured/downloadDocument?sessionId=a15abee5-8a4b-48b5-bc33-def6b0fcecf8&documentId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "realDownloadURL": "/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}"
        }, {
          "creator": "002332",
          "attachId": "{C70B068d-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "name": "sj.txt",
          "size": "58",
          "createTime": "2017/09/18 13:14:46",
          "downloadURL": "http://ceflow:8086/unstructured/downloadDocument?sessionId=a15abee5-8a4b-48b5-bc33-def6b0fcecf8&documentId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "realDownloadURL": "/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}"
        }, {
          "creator": "002333",
          "attachId": "{C70Bssd87-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "name": "mc.txt",
          "size": "50",
          "createTime": "2017/09/05 13:14:46",
          "downloadURL": "http://ceflow:8086/unstructured/downloadDocument?sessionId=a15abee5-8a4b-48b5-bc33-def6b0fcecf8&documentId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "realDownloadURL": "/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}"
        }, {
          "creator": "002334",
          "attachId": "{C70B06ss7-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "name": "jd.txt",
          "size": "100",
          "createTime": "2017/09/20 13:14:46",
          "downloadURL": "http://ceflow:8086/unstructured/downloadDocument?sessionId=a15abee5-8a4b-48b5-bc33-def6b0fcecf8&documentId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}",
          "realDownloadURL": "/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={C70B0687-4435-4F1A-A63B-C6CB1E3BE3EC}"
        }
      ],
    }
  };
}
