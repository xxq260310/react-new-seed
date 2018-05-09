import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { Menu, Dropdown, Checkbox, Button } from 'antd';

import styles from './filterMoreButton.less';

const generateCheckStatus = (valueArray, name) => {
  const Statusitem = _.find(valueArray, item => item.name === name);
  if (Statusitem && !Statusitem.status) {
    return true;
  }

  return false;
};

export default class FilterMoreButton extends PureComponent {
  static propTypes = {
    valueArray: PropTypes.array.isRequired,
    labelArray: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onCloseIconClick: PropTypes.func.isRequired,
    onCheckMoreButton: PropTypes.func.isRequired,
  }

  @autobind
  handleClick({ name, value, filterLabel }) {
    const { onChange, onCloseIconClick, onCheckMoreButton } = this.props;
    // 选中状态
    if (value) {
      onCheckMoreButton({
        name,
        status: false,
      });
    } else { // 取消选中
      onCloseIconClick({
        name,
        status: true,
      });
      onChange({
        name,
        filterLabel,
        valueArray: [],
        key: '',
      });
    }
  }

  @autobind
  renderFilterChoice() {
    const { labelArray, valueArray } = this.props;
    return (
      <Menu className={styles.dropDownMenu}>
        {
          labelArray.map(item => (
            <Menu.Item key={item.filterCode} className={styles.filterItem}>
              <Checkbox
                className={styles.overflowAction}
                checked={generateCheckStatus(valueArray, item.filterCode)}
                onChange={e => this.handleClick({
                  value: e.target.checked,
                  name: item.filterCode,
                  filterLabel: item.filterDesc,
                })}
              >
                <span title={item.filterDesc}>{item.filterDesc}</span>
              </Checkbox>
            </Menu.Item>
          ))
        }
      </Menu>
    );
  }

  render() {
    const { labelArray } = this.props;
    if (_.isEmpty(labelArray)) {
      return null;
    }
    const menu = this.renderFilterChoice();
    return (
      <div className={styles.filter}>
        <Dropdown
          className={styles.filterDropDown}
          overlay={menu}
          trigger={['click']}
        >
          <Button className={styles.filterContent}>
            <span className={styles.filterValue}>更多</span>
            <span className={styles.icon} />
          </Button>
        </Dropdown>
      </div>
    );
  }
}
