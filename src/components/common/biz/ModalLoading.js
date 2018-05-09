/**
 * @Author: sunweibin
 * @Date: 2017-11-09 12:17:10
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-09 12:31:55
 * @description 弹出层需要的Loading
 */

import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

import styles from './modalLoading.less';

export default function ModalLoading({ loading }) {
  if (!loading) return null;
  return (
    <div className={styles.modalLoading}>
      <div className={styles.modalLoadingSpinTable}>
        <div className={styles.modalLoadingSpin}>
          <Spin spinning />
        </div>
      </div>
    </div>
  );
}

ModalLoading.propTypes = {
  loading: PropTypes.bool.isRequired,
};
