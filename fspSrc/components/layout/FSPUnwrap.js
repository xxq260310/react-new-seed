/**
 * @file components/layout/FspUnwrap.js
 *  对fsp页面进行去loading处理
 * @author zhufeiyang
 */

import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../layouts/Loading';
import styles from './fspUnwrap.less';
// 包装当前路由内容到Loading组件内
// 对fsp页面进行去loading处理
export default function FSPUnwrap({ path, children, loading, loadingForceFull }) {
  if (path.indexOf('/fsp/') === -1) {
    return (
      <div id="tabpanel" className={styles.tabpanel}>
        <Loading loading={loading} forceFull={loadingForceFull} />
        {children}
      </div>
    );
  }
  return (
    <div className={styles.tabpanel}>{children}</div>
  );
}

FSPUnwrap.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingForceFull: PropTypes.bool.isRequired,
};
