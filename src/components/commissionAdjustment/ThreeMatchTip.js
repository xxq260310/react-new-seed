/**
 * @file src/components/commissionAdjustment/ThreeMatchTip.js
 * @description 三匹配信息提示
 * @author sunweibin
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './threeMatchTip.less';

// 为了给提示文字一个标点符号
function giveTipPause(array) {
  return array.join('、');
}

function everyIsY(array, key) {
  return _.every(array, a => a[key] === 'Y');
}

// 将提示信息放到数组中
function putMsg2Array(info) {
  const msgArray = [];
  if (!everyIsY(info, 'riskMatch')) {
    msgArray.push('该客户风险与所选产品风险不匹配');
  }
  if (!everyIsY(info, 'prodMatch')) {
    msgArray.push('客户投资期限与产品投资期限不匹配');
  }
  if (!everyIsY(info, 'termMatch')) {
    msgArray.push('客户投资品种与产品投资品种不匹配');
  }
  return msgArray;
}

export default function ThreeMatchTip(props) {
  const { info, userList } = props;
  if (_.isEmpty(info) || _.isEmpty(userList)) {
    return null;
  }
  // 需要根据用户选择的产品来显示三匹配信息
  const userProductCode = userList.map(item => item.prodCode);
  // 获取所有Code的三匹配信息
  const matchInfos = _.filter(info, item => _.includes(userProductCode, item.productCode));
  if (
    everyIsY(matchInfos, 'riskMatch')
    && everyIsY(matchInfos, 'prodMatch')
    && everyIsY(matchInfos, 'termMatch')
  ) {
    // 全匹配
    return (
      <div className={styles.tipsColor}>提示：经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书。</div>
    );
  }
  const msgs = putMsg2Array(info);
  return (
    <div className={styles.tipsColor}>
      <span>提示：经对客户与服务产品三匹配结果，</span>
      {giveTipPause(msgs)}
      <span>，请确认客户是否已签署以下文件：服务计划书、不适当警示书、回访问卷。</span>
    </div>
  );
}

ThreeMatchTip.propTypes = {
  info: PropTypes.array,
  userList: PropTypes.array,
};
ThreeMatchTip.defaultProps = {
  info: {},
  userList: [],
};
