/*
* @Author: XuWenKang
* @Date:   2017-09-26 17:27:17
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-26 17:30:46
*/
exports.response = function (req, res) {
    return {
        'code': '0',
        'msg': 'OK',
        'resultData': [
          {
            'id': '1',
            'contractName': '合约1', 
          },
          {
            'id': '2',
            'contractName': '合约2', 
          },
          {
            'id': '3',
            'contractName': '合约3', 
          }
        ],
    }
}