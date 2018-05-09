/**
 * @file customerPool/taskFlow/step1/Entry.js
 *  客户池-自建任务表单-入口
 * @author wangjunjun
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Row, Col } from 'antd';
import Icon from '../../../common/Icon';
import styles from './entry.less';

function Entry({
  visible,
  importCustomers,
  findPeople,
}) {
  const cls = classnames({
    [styles.container]: true,
    [styles.hide]: !visible,
  });
  return (
    <div className={cls}>
      <Row
        className={`${styles.item} ${styles.fl}`}
        type="flex"
        justify="center"
        align="middle"
        onClick={importCustomers}
      >
        <Col>
          <Icon type="touxiang" className={styles.icon} />
          <p className={styles.iconTxt}>导入客户</p>
        </Col>
      </Row>
      <Row
        className={`${styles.item} ${styles.fr}`}
        type="flex"
        justify="center"
        align="middle"
        onClick={findPeople}
      >
        <Col>
          <Icon type="miaozhunjing" className={styles.icon} />
          <p className={styles.iconTxt}>瞄准镜圈人</p>
        </Col>
      </Row>
    </div>
  );
}

Entry.propTypes = {
  visible: PropTypes.bool,
  importCustomers: PropTypes.func.isRequired,
  findPeople: PropTypes.func.isRequired,
};

Entry.defaultProps = {
  visible: true,
};

export default Entry;
