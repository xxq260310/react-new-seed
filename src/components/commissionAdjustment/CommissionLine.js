/**
 * @file components/commissionAdjustment/CommissionLine.js
 * @description 新建佣金调整每一行组件，组件包括一个label和用户自定义的组件
 * @author sunweibin
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './commissionLine.less';

export default function CommissionLine(props) {
  const { label, required, labelWidth, children, needInputBox, extra } = props;
  const requiredIcon = required ? (<i className={styles.required}>*</i>) : null;
  const componentBox = classnames({
    [styles.componentBox]: true,
    [styles.inputBox]: needInputBox,
  });
  return (
    <div className={styles.commissionLine}>
      <div
        className={styles.label}
        style={{ width: labelWidth, marginRight: `-${labelWidth}` }}
      >
        {requiredIcon}{label}<span className={styles.colon}>:</span>
      </div>
      <div className={componentBox} style={{ marginLeft: labelWidth }}>
        {children}
      </div>
      {extra}
    </div>
  );
}

CommissionLine.propTypes = {
  label: PropTypes.string,
  labelWidth: PropTypes.string,
  inputWidth: PropTypes.string,
  required: PropTypes.bool,
  needInputBox: PropTypes.bool,
  children: PropTypes.element.isRequired,
  extra: PropTypes.element,
};

CommissionLine.defaultProps = {
  label: '',
  labelWidth: '160px',
  inputWidth: '100%',
  required: false,
  needInputBox: true,
  extra: null,
};

