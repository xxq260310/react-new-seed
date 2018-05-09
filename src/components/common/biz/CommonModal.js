/*
 * @Author: LiuJianShu
 * @Date: 2017-09-14 14:44:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-09 12:33:13
 */
/**
 * 常用说明
 * 参数          类型         说明
 * title         string      弹窗的标题
 * visible       boolean     弹窗是否可见
 * onOk          function    点击确定回调
 * closeModal      function    点击遮罩层或右上角叉或取消按钮的回调
 * okText        string      确认按钮文字，默认为 【确认】
 * okType        string      确认按钮类型，类型参照 commom/Button 下的类型
 * cancelText    string      取消按钮文字，默认为 【取消】
 * maskClosable  boolean     点击蒙层是否允许关闭
 * 新增参数
 * size          string      弹窗的大小，可选值 [large, normal, small] 默认为 normal
 * btnStatus     boolean     确认按钮的禁用状态， 默认 【false】
 * children      string/DOM  弹窗内需要显示的元素
 * needBtn       boolean     是否需要显示底部的Button
 * showCancelBtn boolean     是否显示Cancel Button 默认为true
 * 其他参数与 Antd.Modal 相同，具体见下方链接
 * https://ant.design/components/modal-cn/
 * 示例
 <CommonModal
   title="这是一个弹出层"
   visible={visible}
   onOk={this.onOk}
   onCancel={this.onCancel}
   size="small"
 >
   <div style={{ width: '1200px', height: '1200px', border: '1px solid #ccc' }}>
     打开弹出层
   </div>
 </CommonModal>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import ModalLoading from './ModalLoading';
import styles from './commonModal.less';
import logable from '../../../decorators/logable';

export default class CommonModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    needBtn: PropTypes.bool,
    title: PropTypes.string.isRequired,
    okText: PropTypes.string,
    size: PropTypes.string,
    cancelText: PropTypes.string,
    modalKey: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    onOk: PropTypes.func,
    btnStatus: PropTypes.bool,
    showOkBtn: PropTypes.bool,
    showCancelBtn: PropTypes.bool,
    modalLoading: PropTypes.bool,
    wrapClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.element,
      PropTypes.node,
    ]),
    selfBtnGroup: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.element,
      PropTypes.node,
    ]),
  }

  static defaultProps = {
    needBtn: true,
    btnStatus: false,
    modalLoading: false,
    showCancelBtn: true,
    showOkBtn: true,
    okText: '确认',
    cancelText: '取消',
    children: '子元素内容区域',
    size: 'normal',
    wrapClassName: '',
    selfBtnGroup: {},
    onOk: () => {},
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk(modalKey) {
    this.props.onOk(modalKey);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.cancelText' } })
  handleCancel(modalKey) {
    this.props.closeModal(modalKey);
  }

  render() {
    const {
      size,
      children,
      modalKey,
      cancelText,
      okText,
      btnStatus,
      needBtn,
      showCancelBtn,
      showOkBtn,
      selfBtnGroup,
    } = this.props;
    const modalSize = `modal${size}`;
    const okBtn = !showOkBtn ? null
    : (<Button
      key="submit"
      type="primary"
      size="large"
      disabled={btnStatus}
      onClick={() => this.handleOk(modalKey)}
    >
      {okText}
    </Button>);
    const cancelBtn = !showCancelBtn ? null
    : (<Button
      key="back"
      size="large"
      onClick={() => this.handleCancel(modalKey)}
    >
      {cancelText}
    </Button>);
    let footerContent = !needBtn ? null
      : [okBtn, cancelBtn];
    if (!_.isEmpty(selfBtnGroup)) {
      footerContent = selfBtnGroup;
    }
    return (
      <Modal
        {...this.props}
        onCancel={() => this.handleCancel(modalKey)}
        wrapClassName={`${styles.commonModal} ${styles[modalSize]} ${this.props.wrapClassName}`}
        footer={footerContent}
      >
        {children}
        <ModalLoading loading={this.props.modalLoading} />
      </Modal>
    );
  }
}
