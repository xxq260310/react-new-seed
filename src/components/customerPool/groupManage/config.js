/*
 * @Description: 客户分组客户添加方式的配置文件
 * @Author: Hongguangqing
 * @Date: 2018-03-28 16:43:38
 * @Last Modified by: Hongguangqing
 * @Last Modified time: 2018-03-28 16:13:20
 */

const config = {
  customerAddType: [
    {
      show: true,
      label: '单客户添加',
      value: 'single',
    },
    {
      show: true,
      label: '批量客户导入',
      value: 'multi',
    },
  ],
};

export default config;
