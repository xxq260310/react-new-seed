/**
 * @file components/customerPool/home/CheckLayout.js
 *  文字列表，row如下图：-----, | 代表solid线
 *  50   | 50
 *  xxxx | xxxx
 *  --------------
 *  50   | 50
 *  xxxx | xxxx
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popover } from 'antd';

import styles from './checkLayout.less';

function renderItem(data = {}, itemStyle = null) {
  return (
    <div className={classnames(styles.check, itemStyle)}>
      <div className={styles.count}>
        <span title={`${data.item || ''}${data.unit || ''}`}>
          {data.item || ''}
          <span>{data.unit || ''}</span>
        </span>
      </div>
      <Popover content={data.description} placement="bottom" overlayStyle={{ maxWidth: '320px' }}>
        <div className={styles.title}>{data.title || ''}</div>
      </Popover>
    </div>
  );
}

function CheckLayout({ dataSource = [] }) {
  return (
    <div className={styles.container}>
      <div className={classnames(styles.content, styles.left)}>
        {renderItem(dataSource[0], styles.bottomBorder)}
        {renderItem(dataSource[1])}
      </div>
      <div className={classnames(styles.content, styles.right)}>
        {renderItem(dataSource[2], styles.bottomBorder)}
        {renderItem(dataSource[3])}
      </div>
    </div>
  );
}

CheckLayout.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default CheckLayout;
