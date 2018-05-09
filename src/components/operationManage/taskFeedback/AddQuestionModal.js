/*
 * @Description: 任务反馈新增问题弹框
 * @Author: Wangjunjun
 * @path: src/components/taskFeedback/AddQuestionModal.js
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Button } from 'antd';
import classnames from 'classnames';

import AddQuestionForm from './AddQuestionForm';
import logable from '../../../decorators/logable';
import styles from './addQuestionModal.less';


export default class AddQuestionModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    wrapClassName: PropTypes.string,
    visible: PropTypes.bool,
    footer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    width: 650,
    wrapClassName: '',
    visible: false,
    footer: '',
    onOk: () => {},
    onCancel: () => {},
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  submitOneQuestion() {
    this.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.onOk(values);
    });
  }

  render() {
    const {
      wrapClassName,
      footer,
    } = this.props;
    const wrapCls = classnames({
      [styles.addQuestion]: true,
      [wrapClassName]: !!wrapClassName,
    });
    const modalFooter = (
      <div>
        <Button
          type="primary"
          onClick={this.submitOneQuestion}
        >
          确定
        </Button>
      </div>
    );
    return (
      <Modal
        {...this.props}
        wrapClassName={wrapCls}
        footer={footer || modalFooter}
      >
        <AddQuestionForm
          ref={ref => this.form = ref}
        />
      </Modal>
    );
  }
}
