/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 10:53:22
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-20 13:32:34
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupUpdateModal.less';
import logable from '../../../decorators/logable';

const NOOP = _.noop;
const EMPTY_OBJECT = {};
export default class CustomerGroupUpdateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    wrapperClass: PropTypes.string,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okType: PropTypes.string,
    onOkHandler: PropTypes.func,
    modalContent: PropTypes.node,
    onCancelHandler: PropTypes.func,
    footer: PropTypes.node,
    modalStyle: PropTypes.object,
    modalWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    closable: PropTypes.bool,
    // 拿到包裹的modal
    wrappedComponentRef: PropTypes.func,
    bodyStyle: PropTypes.object,
  };

  static defaultProps = {
    wrapperClass: '',
    visible: false,
    title: '',
    okType: 'primary',
    cancelText: '取消',
    modalContent: null,
    onCancelHandler: NOOP,
    footer: null,
    modalStyle: EMPTY_OBJECT,
    modalWidth: 700,
    onOkHandler: NOOP,
    okText: '',
    closable: false,
    wrappedComponentRef: NOOP,
    bodyStyle: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible: nextVisible } = nextProps;
    this.setState({
      visible: nextVisible,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.cancelText' } })
  handleCancel() {
    const { visible } = this.state;
    const { onCancelHandler } = this.props;
    this.setState({
      visible: !visible,
    });
    onCancelHandler();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk() {
    this.props.onOkHandler();
  }

  render() {
    const {
      wrapperClass,
      title,
      okText,
      cancelText,
      okType,
      modalContent,
      modalStyle,
      modalWidth,
      footer,
      closable,
      wrappedComponentRef,
      bodyStyle,
    } = this.props;
    const { visible } = this.state;
    const modalNode = (
      <Modal
        wrapClassName={wrapperClass}
        visible={visible}
        title={title}
        onOk={this.handleOk}
        okText={okText}
        okType={okType}
        cancelText={cancelText}
        maskClosable={false}
        width={modalWidth}
        onCancel={this.handleCancel}
        closable={closable}
        footer={footer}
        style={modalStyle}
        bodyStyle={bodyStyle}
      >
        {
          modalContent
        }
      </Modal>
    );

    return (
      <div
        className={styles.groupUpdateWrapper}
        ref={wrappedComponentRef}
      >
        {modalNode}
      </div>
    );
  }
}
