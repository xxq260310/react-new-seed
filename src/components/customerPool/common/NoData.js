/**
 * @file components/customerPool/NoData.js
 *  客户池-客户列表无数据
 * @author wangjunjun
 */

import React from 'react';

import styles from './noData.less';

import emptyImg from './empty.png';

const NoData = () => (
  <div className={styles.nodata}>
    <div className="empty-container">
      <img src={emptyImg} alt="" />
      <p>没有找到相关客户</p>
    </div>
  </div>
  );

export default NoData;
