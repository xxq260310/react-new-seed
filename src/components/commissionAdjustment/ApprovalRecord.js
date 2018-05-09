/**
 * @file components/commissionAdjustment/ApprovalRecord.js
 * @description 存放佣金调整单条审批记录
 * @author sunweibin
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './approvalRecord.less';

export default function ApprovalRecord(props) {
  const { record: { handleName, handleTime, comment, stepName } } = props;
  const header = `审批人:${handleName}于${handleTime}，步骤名称：${stepName}`;

  return (
    <div className={styles.record}>
      <div className={styles.recordHeader}>{header}</div>
      <div className={styles.recordBody}>{comment}</div>
    </div>
  );
}

ApprovalRecord.propTypes = {
  record: PropTypes.object.isRequired,
};
