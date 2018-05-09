/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-12 16:29:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import PhoneDialog from '../phoneDialog';
import styles from './index.less';

export default class Phone extends PureComponent {
  static propTypes = {
    // 电话号码
    phoneNum: PropTypes.string.isRequired,
    // 客户类型（per代表个人客户，org代表机构客户，prod代表产品客户）
    custType: PropTypes.string.isRequired,
    // 页面自定义样式
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      // 默认状态下打电话弹窗不可见 false 不可见  true 可见
      isShowPhoneDialog: false,
    };
  }

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClickPhoneNum() {
    this.setState({
      isShowPhoneDialog: true,
    });
  }

  // 关闭拨打电话的弹框方法
  @autobind
  handleCloseDialog() {
    this.setState({
      isShowPhoneDialog: false,
    });
  }

  render() {
    const { phoneNum, custType, style } = this.props;
    const { isShowPhoneDialog } = this.state;
    return (
      <div className={styles.wrap}>
        <div
          className={styles.phoneNum}
          onClick={this.handleClickPhoneNum}
          style={style}
        >
          {phoneNum}
        </div>
        {
          isShowPhoneDialog ?
            <PhoneDialog
              phoneNum={phoneNum}
              custType={custType}
              handleCloseDialog={this.handleCloseDialog}
            />
            :
            null
        }
      </div>
    );
  }
}
