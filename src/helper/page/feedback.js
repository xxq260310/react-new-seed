/**
 * @Author: sunweibin
 * @Date: 2017-11-28 09:41:12
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-28 09:46:24
 * @description 此处存放feedback使用的辅助方法
 */
import _ from 'lodash';

import { time, emp } from '../../helper';

const feedback = {
    /**
   * 构造入参
   * @param {*} query 查询
   * @param {*} newPageNum 当前页
   * @param {*} newPageSize 当前分页条目数
   */
  constructPostBody(query, newPageNum, newPageSize) {
    let finalPostData = {
      page: {
        curPageNum: newPageNum,
        pageSize: newPageSize,
      },
    };

    const omitData = _.omit(query, ['currentId', 'feedbackCreateTimeFrom', 'feedbackCreateTimeTo', 'curPageNum', 'curPageSize', 'isResetPageNum']);
    finalPostData = _.merge(finalPostData, omitData);

    const { feedbackCreateTimeTo, feedbackCreateTimeFrom } = query;
    const formatedTime = {
      feedbackCreateTimeFrom: feedbackCreateTimeFrom && time.format(feedbackCreateTimeFrom, 'YYYY/MM/DD'),
      feedbackCreateTimeTo: feedbackCreateTimeTo && time.format(feedbackCreateTimeTo, 'YYYY/MM/DD'),
    };

    if (formatedTime.feedbackCreateTimeFrom &&
      formatedTime.feedbackCreateTimeTo
      && (formatedTime.feedbackCreateTimeFrom === formatedTime.feedbackCreateTimeTo)) {
      delete formatedTime.feedbackCreateTimeTo;
    }

    // 对反馈状态做处理
    if (!('feedbackStatusEnum' in finalPostData)
      || _.isEmpty(finalPostData.feedbackStatusEnum)) {
      finalPostData = _.merge(finalPostData, { feedbackStatusEnum: 'PROCESSING' });
    }

    // 对经办人做过滤处理
    if ('processer' in finalPostData) {
      if (finalPostData.processer === 'ALL') {
        finalPostData.processer = '';
      } else if (finalPostData.processer === 'SELF') {
        finalPostData.processer = emp.getId();
      }
    }

    return _.merge(finalPostData, formatedTime);
  },

};

export default feedback;
