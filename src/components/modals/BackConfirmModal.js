/**
 * @description 看版编辑页面没有保存数据，就返回提示Modal
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';
import logable from '../../decorators/logable';

const backTips = {
  save: '您编辑的信息尚未保存，确认直接返回？',
  publish: '您编辑的信息尚未发布，确认直接返回？',
};

export default class BackConfirmModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    tip: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    tip: 'save',
  }

  constructor(props) {
    super(props);
    const { visible, tip } = props;
    this.state = {
      modalVisible: visible,
      backTip: backTips[tip],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, tip } = nextProps;
    const { visible: preVisible } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
        backTip: backTips[tip],
      });
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  closeCreateModal() {
    const { modalKey, closeModal } = this.props;
    closeModal(modalKey);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  confirmCreateModal() {
    this.props.confirm();
    // 隐藏Modal
    this.closeCreateModal();
  }

  render() {
    const { modalVisible, backTip } = this.state;
    const { modalCaption } = this.props;
    return (
      <Modal
        title={modalCaption}
        visible={modalVisible}
        closeable
        onCancel={this.closeCreateModal}
        maskClosable={false}
        wrapClassName={styles.boardManageModal}
        footer={[
          <Button key="back" size="large" onClick={this.closeCreateModal}>取消</Button>,
          <Button key="submit" type="primary" size="large" onClick={this.confirmCreateModal}>
            确认
          </Button>,
        ]}
      >
        <div className={styles.modalPureTips}>{backTip}</div>
      </Modal>
    );
  }
}
