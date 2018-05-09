/**
 * @Description: PC电话拨号弹框
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-12 14:54:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './index.less';

export default class PhoneDialog extends PureComponent {
  static propTypes = {
    phoneNum: PropTypes.string.isRequired,
    custType: PropTypes.string.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
  }

  // 点击叉号关闭拨打电话的弹框方法来关闭弹框
  @autobind
  closePhoneDialog() {
    this.props.handleCloseDialog();
  }

  render() {
    const { phoneNum, custType } = this.props;
    const srcUrl = `http://168.61.8.82:9086/phone/?phoneNum=${phoneNum}&custType=${custType}`;
    return (
      <div className={styles.phoneDialogBox}>
        <iframe
          src={srcUrl}
          width="300"
          height="400"
          scrolling="no"
          frameBorder="0"
        />
        <div className={styles.closeIcon} onClick={this.closePhoneDialog}>×</div>
      </div>
    );
  }
}
