import React from 'react';

import styles from './emptyData.less';
import emptyImg from './img/empty.png';

export default function EmptyData() {
  return (
    <div className={styles.emptyBox}>
      <div className={styles.wrapper}>
        <img src={emptyImg} alt="" />
        <p>暂无问题数据</p>
      </div>
    </div>
  );
}
