/**
 * @Author: sunweibin
 * @Date: 2017-11-17 15:38:45
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-01-09 15:11:18
 * @description 列表组件中需要使用到的公共工具方法
 */

const tool = {
  /**
   * 根据总数生成每页条数
   * @param {number} totalCount 总数
   */
  constructPageSizeOptions(totalCount) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalCount / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }
    return pageSizeOption;
  },

  /**
   * 显示总数
   */
  showTotal(total) {
    return `共${total}条`;
  },
};

export default tool;
