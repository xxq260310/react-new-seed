/*
 * @Author: LiuJianShu
 * @Date: 2017-10-17 15:41:51
 * @Last Modified by:   LiuJianShu
 * @Last Modified time: 2017-10-17 15:41:51
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