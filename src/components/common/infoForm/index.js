/*
 * @Description: 公用的左 lable，右 form 组建
 * @Author: LiuJianShu
 * @Date: 2017-09-28 17:14:03
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-21 16:29:51
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default function InfoForm(props) {
  const { label, required, children, style } = props;
  return (
    <div className={styles.infoForm}>
      <div style={style} className={styles.infoFormLabel}>
        {
          required ?
            <i>*</i>
            :
            null
        }
        {label}
        <span className={styles.colon}>:</span>
      </div>
      <div className={styles.infoFormContent}>
        {children}
      </div>
    </div>
  );
}

InfoForm.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element,
  ]),
  style: PropTypes.object,
};
InfoForm.defaultProps = {
  label: 'label',
  required: false,
  children: 'form内容区域',
  style: {},
};
