/*
 * @Description: 客户划转的配置文件
 * @Author: LiuJianShu
 * @Date: 2018-01-17 16:43:38
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-12 16:13:20
 */

const config = {
  transferType: [
    {
      show: true,
      label: '单客户划转',
      value: 'single',
    },
    {
      show: true,
      label: '批量导入',
      value: 'multi',
    },
  ],
  errorArray: ['validateError', 'otherError'],
  tips: {
    validateError: '该申请单数据导入失败，请点击下载报错信息查看报错信息，如有需要，请重新发起流程。',
    otherError: '该申请单流程提交失败，如有需要，请重新发起流程或联系运维人员核查处理。',
  },
};

export default config;
