/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-28 16:22:31
 * 下拉框筛选
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, Icon } from 'antd';
import classnames from 'classnames';
import styles from './newSingleFilter.less';
import logable from '../../../decorators/logable';

const Option = Select.Option;

export default class SingleFilter extends PureComponent {
  static propTypes = {
    // 过滤器英文代号
    filter: PropTypes.string.isRequired,
    // 过滤器名称
    filterLabel: PropTypes.string.isRequired,
    // 过滤器可选字段
    filterField: PropTypes.array,
    // 选中条件时的回调
    onChange: PropTypes.func.isRequired,
    // 处理关闭icon的回调
    onCloseIconClick: PropTypes.func,
    // 过滤器当前条件编码值
    value: PropTypes.string.isRequired,

    hideCloseIcon: PropTypes.bool,

    status: PropTypes.bool,
    getPopupContainer: PropTypes.func,
  }
  static defaultProps = {
    filterField: [],
    hideCloseIcon: true,
    onCloseIconClick: _.noop,
    status: false,
    getPopupContainer: () => document.body,
  }
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }
  @autobind
  handleClick({ key, value }) {
    const { filter, filterLabel, onChange } = this.props;
    this.setState({
      value: key, // 这里并不清楚为什么要异步的这么做
    }, () => {
      onChange({
        name: filter,
        filterLabel,
        key,
        valueArray: [value],
      });
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$props.filterLabel',
      value: '$args[0].label',
    },
  })
  handleSelectChange(value) {
    this.handleClick({
      key: value.key,
      value: value.label,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭icon' } })
  handleSelectClose() {
    const { filter, filterLabel, onChange, onCloseIconClick } = this.props;
    const key = '';
    const value = '不限';
    this.setState({
      value: key, // 这里并不清楚为什么要异步的这么做
    }, () => {
      onChange({
        name: filter,
        filterLabel,
        key,
        valueArray: [value],
      });
      onCloseIconClick({
        name: filter,
        status: true,
      });
    });
  }

  render() {
    const { filterLabel, filterField, value, getPopupContainer } = this.props;
    const selectFilter = _.find(filterField, filter => filter.key === value);
    const selectValue = {
      key: selectFilter.key,
      label: selectFilter.value,
    };
    const cls = classnames({
      [styles.closeIcon]: true,
      [styles.hideCloseIcon]: this.props.hideCloseIcon,
    });
    const filterCls = classnames({
      [styles.filter]: true,
      [styles.hidden]: this.props.status,
    });
    return (
      <div className={filterCls}>
        {
          !_.isEmpty(filterLabel) ?
            <span className={styles.filterLabel} title={filterLabel}>
              {filterLabel}
            </span>
            : null
        }
        {
          !_.isEmpty(filterLabel) ?
            <span className={styles.filterSeperator}>：</span>
            : null
        }
        <Select
          value={selectValue}
          style={{ maxWidth: '84px', fontSize: '14px' }}
          dropdownClassName={styles.dropdownfilterLabel}
          onChange={this.handleSelectChange}
          dropdownMatchSelectWidth={false}
          labelInValue
          getPopupContainer={getPopupContainer}
        >
          {
            filterField.map(item => (
              <Option
                className={styles.overflowAction}
                key={item.key}
                value={item.key}
                title={item.value}
              >
                {item.value}
              </Option>
            ))
          }
        </Select>
        <Icon type="close-circle" className={cls} onClick={this.handleSelectClose} />
      </div>
    );
  }
}
