/**
 * @file Select.js
 * @author honggaunqging
 * @Last Modified by: baojiajia
 * @Last Modified:新增width属性 默认值为220px
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import styles from './index.less';

const Option = Select.Option;
export default class CommonSelect extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
    width: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    value: '全部',
    data: [],
    width: '',
    disabled: false,
  }

  @autobind
  makeSelectOptions(data) {
    const options = [];
    _.forEach(data, (item) => {
      const { show, value, label } = item;
      if (show) {
        options.push(<Option key={value} value={value}>{label}</Option>);
      }
    });
    return options;
  }


  render() {
    const { data, name, value, onChange, width, ...resetProps } = this.props;
    const options = this.makeSelectOptions(data);
    return (
      <div className={styles.commomSelect}>
        <Select
          placeholder="全部"
          value={value}
          onChange={key => onChange(name, key)}
          dropdownMatchSelectWidth={false}
          style={{ width }}
          dropdownStyle={{ width }}
          {...resetProps}
        >
          {options}
        </Select>
      </div>
    );
  }
}
