import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Menu, Dropdown, Checkbox, Button } from 'antd';

import logable from '../../../decorators/logable';
import styles from './newMutiFilter.less';

const generateCheckStatus = (v, k, valueArray) => {
  if (_.isEmpty(valueArray)) {
    return false;
  }
  if (_.isEmpty(v) && k === '') {
    return true;
  } else if (v.indexOf(k) > -1) {
    return true;
  }
  return false;
};

export default class MultiFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    separator: PropTypes.string,
    valueArray: PropTypes.array,
  }
  static defaultProps = {
    filterField: [],
    separator: ',',
    valueArray: [],
  }

  constructor(props) {
    super(props);
    const { value, separator } = props;
    this.state = {
      keyArr: value ? value.split(separator) : [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, separator } = nextProps;
    if (value !== this.props.value) {
      this.setState({
        keyArr: value ? value.split(separator) : [],
      });
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$props.filterLabel' } })
  handleClick({ key, value, filterLabel }) {
    const { keyArr } = this.state;
    const { separator, filter, onChange, valueArray } = this.props;
    const valueArr =
      _.includes(valueArray, value) ? valueArray.filter(v => v !== value) : [...valueArray, value];
    if (key) {
      this.setState({
        keyArr: _.includes(keyArr, key) ? keyArr.filter(v => v !== key) : [...keyArr, key],
        valueArray: valueArr,
      }, () => {
        onChange({
          name: filter,
          filterLabel,
          key: this.state.keyArr.join(separator),
          valueArray: valueArr,
        });
      });
    } else { // 如果选中了不限
      this.setState({
        keyArr: [],
        valueArray: [],
      }, () => {
        onChange({
          name: filter,
          filterLabel,
          valueArray: [],
          key: '',
        });
      });
    }
  }

  @autobind
  getFilterValue(valueArray) {
    if (_.isEmpty(valueArray) || valueArray[0] === '不限') {
      return '不限';
    }
    return valueArray.join('，');
  }

  @autobind
  renderFilterChoice() {
    const { filterField, filterLabel, valueArray } = this.props;
    const { keyArr } = this.state;
    return (
      <Menu className={styles.dropDownMenu}>
        {
          filterField.map(item => (
            <Menu.Item key={item.key} className={styles.filterItem}>
              <Checkbox
                className={styles.overflowAction}
                checked={generateCheckStatus(keyArr, item.key, valueArray)}
                onChange={() => this.handleClick({ key: item.key, value: item.value, filterLabel })}
              >
                <span title={item.value}>{item.value}</span>
              </Checkbox>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }

  render() {
    const { filterLabel, filterField, valueArray } = this.props;
    const filterValue = this.getFilterValue(valueArray);
    const menu = this.renderFilterChoice();
    if (_.isEmpty(filterField)) {
      return null;
    }
    return (
      <div className={styles.filter}>
        <span className={styles.filterLabel} title={filterLabel}>{filterLabel}</span>
        <span className={styles.filterSeperator}>：</span>
        <Dropdown
          className={styles.filterDropDown}
          overlay={menu}
          trigger={['click']}
        >
          <Button className={styles.filterContent}>
            <span className={styles.filterValue} title={filterValue}>{filterValue}</span>
            <span className={styles.icon} />
          </Button>
        </Dropdown>
      </div>
    );
  }
}
