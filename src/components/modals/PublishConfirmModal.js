/**
 * @description 看版编辑页面发布
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './modalCommon.less';
import logable from '../../decorators/logable';

export default class PublishConfirmModal extends PureComponent {
  static propTypes = {
    modalCaption: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      modalVisible: visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    const { visible: preVisible } = this.props;
    if (!_.isEqual(visible, preVisible)) {
      this.setState({
        modalVisible: visible,
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
    const { modalVisible } = this.state;
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
        <div className={styles.modalPureTips}>发布成功后，可见范围权限的用户将可查看该报表，确认发布？</div>
      </Modal>
    );
  }
}
