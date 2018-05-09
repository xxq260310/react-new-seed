exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "appId": "MCRM",
      "createTime": "2017-06-19 17:40:33",
      "description": "这东西不好用4", //描述
      "id": 267,
      "issueType": "DEFECT",
      "mediaUrls": null,
      "pageName": null,
      "title": null,
      "userId": "002332",
      "userType": null,
      "version": null,
      "functionName": "页面模块", // 功能模块
      "goodRate": "GOOD",
      "status": "PROCESSING",
      "processer": "011105", // 处理问题的员工
      "tag": '5',
      "processTime": null,
      "feedId": "10267",
      "jiraId": null,
      "attachmentJson": "[{\"attachName\":\"大图片.jpg\",\"attachUploader\":\"002332\",\"attachUrl\":\"/apigateway/upload/f40a35a5-cdaa-4efe-8748-b7488edb164a.jpg\"}]",
      "attachModelList": [
        {
          "attachName": "大图片.jpg",
          "attachUrl": "/apigateway/upload/f40a35a5-cdaa-4efe-8748-b7488edb164a.jpg",
          "attachUploader": "002332"
        }
      ],
      "feedEmpInfo": {
        "empId": "002332",
        "name": "王华",
        "gender": "女",
        "eMailAddr": "weiwei@htsc.com",
        "cellPhone": "18951810511",
        "rowId": null,
        "l0": null,
        "l1": null,
        "l2": "南京分公司",
        "l3": "南京长江路证券营业部"
      },
      "processerEmpInfo": null
    }
  };
}