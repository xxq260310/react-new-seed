/**
 * @description 分割线
 * @author sunweibin
 */
import React from 'react';
import styles from './HisDivider.less';

function HisDivider() {
  return (
    <div className={styles.dividerOuter}>
      <div className={styles.dividerInner} />
    </div>
  );
}

export default HisDivider;
