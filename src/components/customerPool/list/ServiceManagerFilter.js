/**
 * @file components/customerPool/list/ServiceManagerFilter.js
 *  客户列表项中按服务经理筛选
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import DropdownSelect from '../../common/dropdownSelect';
import { emp } from '../../../helper';
import logable from '../../../decorators/logable';

import styles from './saleDepartmentFilter.less';

export default class ServiceManagerFilter extends PureComponent {

  static propTypes = {
    searchServerPersonList: PropTypes.array.isRequired,
    serviceManagerDefaultValue: PropTypes.string.isRequired,
    dropdownSelectedItem: PropTypes.func.isRequired,
    dropdownToSearchInfo: PropTypes.func.isRequired,
    disable: PropTypes.bool.isRequired,
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务经理',
      value: '$args[0].ptyMngName',
    },
  })
  handleSelct(value) {
    this.props.dropdownSelectedItem(value);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索服务经理' } })
  handleSearch(value) {
    this.props.dropdownToSearchInfo(value);
  }

  render() {
    const {
      searchServerPersonList,
      serviceManagerDefaultValue,
      disable,
    } = this.props;
    // 预置下拉框数据列表
    const presetList = [
      { ptyMngName: '所有人', ptyMngId: '' },
      { ptyMngName: '我的', ptyMngId: emp.getId() },
    ];
    return (
      <div>
        <span className={styles.selectLabel}>服务经理：</span>
        <DropdownSelect
          theme="theme2"
          showObjKey="ptyMngName"
          objId="ptyMngId"
          placeholder="输入姓名或工号查询"
          name="服务经理"
          disable={disable}
          value={serviceManagerDefaultValue}
          searchList={searchServerPersonList}
          emitSelectItem={this.handleSelct}
          emitToSearch={this.handleSearch}
          presetOptionList={presetList}
        />
      </div>
    );
  }
}
