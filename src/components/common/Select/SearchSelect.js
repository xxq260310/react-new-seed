/**
 * @Author: sunweibin
 * @Date: 2018-03-21 14:14:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-21 14:15:29
 * @description 批量佣金调整中的客户搜索组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { AutoComplete, Button } from 'antd';

import SimilarAutoComplete from '../similarAutoComplete';
import styles from './searchSelect.less';
import logable from '../../../decorators/logable';

const Option = AutoComplete.Option;

export default class SearchSelect extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired,
    onAddCustomer: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    width: PropTypes.string,
    defaultInput: PropTypes.string,
  }

  static defaultProps = {
    width: '300px',
    defaultInput: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectItem: {},
    };
  }

  // 把对应的数组值传入外部接口
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加' } })
  handleAddBtnClick() {
    this.props.onAddCustomer(this.state.selectItem);
  }

  // 搜索客户列表
  @autobind
  handleSearchCustList(value) {
    this.props.onChangeValue(value);
  }

  // 选择某个客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$props.labelName',
      value: '$args[0].custName',
    },
  })
  handleSelectCust(cust) {
    this.setState({ selectItem: cust });
  }

  @autobind
  renderOption(cust) {
    const { cusId, custId, custName, econNum, brokerNumber } = cust;
    return (
      <Option key={cusId || custId} value={custName} text={custName}>
        <span className={styles.prodValue}>{custName}({brokerNumber || econNum})</span>
      </Option>
    );
  }


  render() {
    const { labelName, dataSource } = this.props;
    const newDataSource = dataSource.map(item => ({ key: item.cusId || item.custId, ...item }));
    return (
      <div className={styles.selectSearchBox}>
        <span className={styles.labelName}>{`${labelName}：`}</span>
        <SimilarAutoComplete
          name="batchCustSelect"
          placeholder="经纪客户号/客户名称"
          searchList={newDataSource}
          width={184}
          showObjKey="key"
          objId="key"
          onSelect={this.handleSelectCust}
          onSearch={this.handleSearchCustList}
          renderOption={this.renderOption}
        />
        <Button className={styles.addButton} onClick={this.handleAddBtnClick}>添加</Button>
      </div>
    );
  }
}
