import React from 'react';
import styles from './emptyTargetCust.less';
import nodatapng from './nodata.png';

export default function EmptyTargetCust() {
  return (
    <div className={styles.noData}>
      <div className={styles.nodataBlock}>
        <img src={nodatapng} alt="nodata" />
        <div className={styles.nodataText}>没有符合条件客户</div>
      </div>
    </div>
  );
}
