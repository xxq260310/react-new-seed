/**
 * @description 过程确认框，统一样式
 * @author zhangjunli
 * Usage:
 * <ProcessConfirm
 *  visible={bool}
 *  onOk={func}
 *  modalKey={string}
 * content={array}
 * />
 * visible：必需的，用于控制弹框是否显示
 * onOk：必须，按钮的回调事件
 * modalKey： 必须，容器组件用来控制modal出现和隐藏的key
 * content：必须，弹框的内容,是二维数组
 * okText：有默认值（确认），按钮的title
 * contentTitle： 有默认值（流程发送成功），弹框内容的title
 * title： 有默认值（系统提示），弹框的title
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './processConfirm.less';
import logable from '../../../decorators/logable';

export default class ProcessConfirm extends Component {
  static propTypes = {
    okText: PropTypes.string,
    contentTitle: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.array.isRequired,
    onOk: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    modalKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    okText: '确认',
    contentTitle: '流程发送成功!',
    title: '系统提示',
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk() {
    const { onOk, modalKey } = this.props;
    onOk(modalKey);
  }

  @autobind
  modalContent() {
    const { content } = this.props;
    if (_.isEmpty(content)) {
      return null;
    }
    const contentElemArray = content.map(
      itemArray => (
        <div key={`${itemArray[0]}-${new Date().getTime()}`} className={styles.row}>
          <div className={styles.key}>{itemArray[0]}</div>
          <div className={styles.value}>{itemArray[1]}</div>
        </div>
      ),
    );
    return contentElemArray;
  }

  render() {
    const {
      title,
      contentTitle,
      okText,
      visible,
    } = this.props;

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
        okText={okText}
        wrapClassName={styles.modalContainer}
      >
        <div className={styles.contentTitle}>{contentTitle}</div>
        <div className={styles.content}>
          {this.modalContent()}
        </div>
      </Modal>
    );
  }
}
