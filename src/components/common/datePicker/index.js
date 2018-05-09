/*
* @Description: 日期选择组件
* @Author: XuWenKang
* @Date:   2017-09-20 10:38:57
* @Last Modified by:   K0240008
* @Last Modified time: 2017-11-16 18:33:35
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './index.less';

export default class CommonDatePicker extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    placeholder: PropTypes.string,
    boxStyle: PropTypes.object,
    disabled: PropTypes.bool,
    dateFormat: PropTypes.string,
    allowClear: PropTypes.bool,
  }

  static defaultProps = {
    value: '',
    placeholder: '',
    boxStyle: {},
    disabled: false,
    dateFormat: 'YYYY-MM-DD',
    allowClear: false,
  }

  @autobind
  handleChange(date, dateStr) {
    const { name, onChange } = this.props;
    onChange({ name, value: dateStr, date });
  }


  render() {
    const {
      value,
      placeholder,
      boxStyle,
      disabled,
      dateFormat,
      allowClear,
    } = this.props;
    // value 的属性有一个是 _i
    const { _i } = value;
    const hasValue = value && !_.isEmpty(_i);
    // 1. 日期控件，当value 值为空，即value._i为空时，日期控件不要有value和defalutValue属性，否则报warning
    // 2. 要用日期控件的defaultValue属性，显示value。
    // 2的区别（自测出来的）：用defaultValue属性，可以手动删除日期框中的内容，不反弹。
    // :                 用value属性，手动删除日历框中的内容，有反弹的情况出现。快速删除可反弹。缓慢删除，不反弹（我试的时候是酱紫的）
    const addValueToPickProps = hasValue ? { defaultValue: value } : {};
    return (
      <div
        className={styles.commonDatePicker}
        style={boxStyle}
      >
        <DatePicker
          disabled={disabled}
          allowClear={allowClear}
          format={dateFormat}
          placeholder={placeholder}
          onChange={this.handleChange}
          {...addValueToPickProps}
        />
      </div>
    );
  }
}
