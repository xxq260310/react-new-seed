/*
 * @Description: 自定义开关组件
 * @Author: XuWenKang
 * @Date:   2017-10-27 10:27:31
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import styles from './index.less';


export default class CustomSwitch extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    // 默认值
    value: PropTypes.bool,
  }

  static defaultProps = {
    value: true,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @autobind
  handleChange() {
    const { value, onChange, name } = this.props;
    onChange(name, !value);
  }

  render() {
    const { value, name } = this.props;
    return (
      <div className={styles.customSwitch}>
        <input type="checkbox" name={name} className={styles.checkbox} checked={value} />
        <label htmlFor={name} onClick={this.handleChange}>
          <span className={styles.textYes}>是</span>
          <span className={styles.textNo}>否</span>
        </label>
      </div>
    );
  }
}
