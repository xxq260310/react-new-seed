/**
 * @Author: sunweibin
 * @Date: 2017-11-28 09:49:09
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 09:52:13
 * @description 此处存放有关seibel迁移相关页面的辅助方法
 */
import _ from 'lodash';

const seibel = {
   /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  constructSeibelPostBody(query, newPageNum, newPageSize) {
    let finalPostData = {
      pageNum: _.parseInt(newPageNum, 10),
      pageSize: _.parseInt(newPageSize, 10),
    };
    const omitData = _.omit(query, ['currentId', 'pageNum', 'pageSize', 'isResetPageNum']);
    finalPostData = _.merge(finalPostData, omitData);
    return finalPostData;
  },
};

export default seibel;
