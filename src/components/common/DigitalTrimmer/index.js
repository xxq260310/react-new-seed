/**
 * @file DigitalTrimmer.js
 * 通过鼠标或键盘，输入范围内的数值
 * author baojiajia
 */
import React, { PureComponent } from 'react';
import { InputNumber, Modal } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import style from './style.less';

const confirm = Modal.confirm;

export default class DigitalTrimmer extends PureComponent {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    getValue: PropTypes.func.isRequired,
    ref: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 0.16,
    max: Infinity,
    step: 0.01,
    value: 0.16,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  @autobind
  onChange(value) {
    const clearValue = this.clearInput;
    let inputLength = 0;
    if (value.toString().split('.').length > 1) {
      inputLength = value.toString().split('.')[1].length;
    }
    if (isNaN(value)) {
      confirm({
        okText: '确定',
        cancelText: '取消',
        title: '错误',
        content: '请输入数字',
        onOk() {
          clearValue();
        },
        onCancel() {
        },
      });
    } else if (!isNaN(value) && (inputLength > 2)) {
      confirm({
        okText: '确定',
        cancelText: '取消',
        title: '错误',
        content: '小数点后不超过两位',
        onOk() {
          clearValue();
        },
        onCancel() {
        },
      });
    } else {
      this.setState({
        value,
      });
      this.props.getValue(value);
    }
  }

  @autobind
  clearInput() {
    this.setState({
      value: '',
    });
  }

  @autobind
  reset() {
    this.setState({
      value: this.props.value,
    });
  }

  render() {
    const { min, max, step } = this.props;
    const { value } = this.state;
    return (
      <InputNumber
        className={style.inputBox}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={this.onChange}
      />
    );
  }
}

