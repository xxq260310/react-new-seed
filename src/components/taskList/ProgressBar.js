/**
 * @file ProgressBar.js
 * 创建者视图、执行者视图进度条
 * @author wangjunjun
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import classnames from 'classnames';

import styles from './progressBar.less';

export default function ProgressBar({
  servicedCustomer,
  totalCustomer,
  active,
  ...restProps
}) {
  const servicedCustomerNum = Number(servicedCustomer);
  const totalCustomerNum = Number(totalCustomer);
  if (totalCustomerNum === 0 || isNaN(totalCustomerNum) || isNaN(servicedCustomerNum)) {
    return null;
  }
  const percent = 100 * (servicedCustomerNum / totalCustomerNum);
  const overlayWidth = (percent / 100) * 120;

  return (
    <div className={styles.progress}>
      <div className={`${styles.progressText} progressText`}>
        进度:&nbsp;<span className={`${styles.mark} ${active ? 'activeMark' : ''}`}>{servicedCustomer}</span>/{totalCustomer}
      </div>
      <div
        className={classnames({
          [styles.overlayActive]: true,
          [styles.block]: active,
          [styles.hidden]: !active,
        })}
        style={{
          width: overlayWidth,
        }}
      />
      <div
        className={classnames({
          [styles.overlayDefault]: true,
          [styles.block]: !active,
          [styles.hidden]: active,
        })}
        style={{
          width: overlayWidth,
        }}
      />
      <Progress
        percent={percent}
        strokeWidth={3}
        {...restProps}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  servicedCustomer: PropTypes.number,
  totalCustomer: PropTypes.number,
  active: PropTypes.bool.isRequired,
};

ProgressBar.defaultProps = {
  totalCustomer: 0,
  servicedCustomer: 0,
};
