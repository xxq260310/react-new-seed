/**
 * @file components/commissionAdjustment/OperationOfCustermorList
 * @description 新建批量佣金调整客户列表选择和移除
 * @author baojiajia
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';

import SearchSelect from '../common/Select/SearchSelect';
import styles from './operationOfCustermorList.less';
import logable from '../../decorators/logable';

export default class ProductsDropdownBox extends PureComponent {

  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onDelectCustomer: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  }

  @autobind
  handleValidate(customer) {
    // 验证用户
    this.props.validate(customer);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '移除' } })
  handleDelete() {
    this.props.onDelectCustomer();
  }

  render() {
    const {
      labelName,
      dataSource,
      onChangeValue,
    } = this.props;
    return (
      <div className={styles.operationOfCustList}>
        <div className={styles.searchSelectArea}>
          <SearchSelect
            onAddCustomer={this.handleValidate}
            onChangeValue={onChangeValue}
            width="184px"
            labelName={labelName}
            dataSource={dataSource}
            defaultInput="经纪客户号/客户名称"
          />
        </div>
        <Button
          className={styles.delectCustomerButton}
          onClick={() => { this.handleDelete(); }}
        >移除</Button>
      </div>
    );
  }
}

