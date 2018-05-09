/**
 * @fileOverview layouts/Loading.js
 * @author sunweibin
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { dom } from '../helper';

import styles from './Loading.less';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

function Loading({ loading, forceFull }) {
  if (!loading) {
    return null;
  }
  let top = contentWrapper ? '55px' : '0';
  let left = contentWrapper ? dom.getCssStyle(contentWrapper, 'left') : '0';
  // 新增判断如果forceFull有值，则需要判断是Y或者N，
  // 无值则按默认的方式处理
  if (forceFull) {
    // 强制全屏
    top = '0';
    left = '0';
  }
  return (
    <div
      className={styles.popmask}
      style={{ top, left }}
    >
      <Spin tip="Loading" spinning={loading} />
    </div>
  );
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  forceFull: PropTypes.bool,
};
Loading.defaultProps = {
  forceFull: false,
};

export default Loading;
