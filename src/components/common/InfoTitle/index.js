/**
 * @file InfoTitle.js
 * author shenxuxiang
 */
import React from 'react';
import PropTypes from 'prop-types';
import style from './infotitle.less';

export default function InfoTitle(props) {
  const { isRequired } = props;
  return (
    <div className={style.mlcHead}>
      <span className={style.mlcHeadIcon} />
      <span className={style.mlcHeadTitle}>{ props.head }</span>
      {
        isRequired ?
          <i className={style.required}>*</i> :
        null
      }
    </div>
  );
}

InfoTitle.propTypes = {
  head: PropTypes.string,
  isRequired: PropTypes.bool,
};
InfoTitle.defaultProps = {
  head: '信息标题',
  isRequired: false,
};
