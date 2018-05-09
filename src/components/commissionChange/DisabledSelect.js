/**
 * @Author: sunweibin
 * @Date: 2017-11-03 20:55:19
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-03-06 14:46:45
 * @description 不能使用的下拉框样式
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from './disabledSelect.less';

export default function DisabledSelect(props) {
  return (
    <div className={styles.disabledSelectWrap} title={props.text}>
      {props.text}
      <div className={styles.disabledSelectIcon}>
        <Icon type="caret-down" />
      </div>
    </div>
  );
}

DisabledSelect.propTypes = {
  text: PropTypes.string.isRequired,
};
