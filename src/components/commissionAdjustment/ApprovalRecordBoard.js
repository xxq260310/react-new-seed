/**
 * @file components/commissionAdjustment/ApprovalRecordBoard.js
 * @description 佣金调整详情页面审批记录弹出层
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import ApprovalRecord from './ApprovalRecord';
import styles from './approvalRecordBoard.less';

export default class ApprovalRecordBoard extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    record: PropTypes.object,
    onClose: PropTypes.func,
    modalKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    visible: false,
    record: {},
    onClose: () => {},
  }

  @autobind
  handleModalOK() {
    // 必须要的空方法
  }

  @autobind
  closeModal(key) {
    this.props.onClose(key);
  }

  render() {
    const { modalKey, visible, record: { cust, approval } } = this.props;
    if (_.isEmpty(cust) || _.isEmpty(approval)) {
      return null;
    }
    const newApproval = approval.map(item => ({ key: item.handleTime, ...item }));
    const basicInfo = `${cust.custName}(${cust.econNum})-${cust.custLevel}`;
    const orgInfo = cust.openAccDept;
    const statusInfo = cust.status;
    const infoCls = classnames({
      [styles.text]: true,
      [styles.textbox]: true,
    });
    return (
      <CommonModal
        title="审批记录"
        modalKey={modalKey}
        needBtn={false}
        maskClosable={false}
        size="normal"
        visible={visible}
        closeModal={this.closeModal}
        onOk={this.handleModalOK}
      >
        <div className={styles.approvalBox}>
          <div className={styles.custInfo}>
            <span className={infoCls}>{basicInfo}</span>
            <span className={infoCls}>{orgInfo}</span>
            <span className={infoCls}>
              <span className={styles.statusLabel}>状态: </span>{statusInfo}
            </span>
          </div>
          <InfoTitle head="审批记录" />
          <div className={styles.recordBox}>
            {
              newApproval.map(item => (<ApprovalRecord key={item.entryTime} record={item} />))
            }
          </div>
        </div>
      </CommonModal>
    );
  }
}
