/**
 * @file components/commissionAdjustment/AddCustomer.js
 * @description 批量佣金调整添加客户
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import confirm from '../common/Confirm';
import OperationOfCustermorList from './OperationOfCustermorList';
import CustomerTableList from './CutomerTableList';
import ProcessConfirm from '../common/biz/ProcessConfirm';
import styles from './addCustomer.less';

export default class AddCustomer extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchList: PropTypes.array.isRequired,
    passList2Home: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
    validateResult: PropTypes.string,
    validataLoading: PropTypes.bool,
  }

  static defaultProps = {
    validataLoading: false,
    validateResult: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      selectList: [],
      customerList: [],
      customer: null,
      content: [[]],
      processModal: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { validataLoading: prevL } = this.props;
    const { validataLoading: nextL, validateResult } = nextProps;
    if (!nextL && prevL) {
      // 验证完毕
      // 添加客户
      if (validateResult === 'OK') {
        this.addCustomer(this.state.customer);
        this.setState({
          customer: null,
        });
      } else {
        const { customer } = this.state;
        const content = [[customer.custName, validateResult]];
        this.setState({
          content,
          processModal: true,
        });
      }
    }
  }

  @autobind
  clearCustList() {
    this.setState({
      customerList: [],
    });
    this.passData2Home([]);
  }

  // 选出需要传递给接口的值
  @autobind
  pickValue(list) {
    const tempList = _.cloneDeep(list);
    return tempList.map(item => ({
      custId: item.cusId,
      custEcon: item.brokerNumber,
      custName: item.custName,
    }));
  }

  @autobind
  passData2Home(list) {
    this.props.passList2Home(list);
  }

  @autobind
  handleValidate(customer) {
    const { customerList } = this.state;
    // 判断是否已经存在改用户
    const exist = _.findIndex(customerList, o => o.cusId === customer.cusId) > -1;
    // 如果存在，则不给添加
    if (exist) {
      confirm({ shortCut: 'custExist' });
      return;
    }
    // 如果客户列表中已经有200个客户，则不让再添加
    if (customerList.length >= 200) {
      confirm({ shortCut: 'custListMaxLength' });
      return;
    }
    this.setState({ customer });
    this.props.onValidate(customer);
  }

  // 添加用户
  @autobind
  addCustomer(customer) {
    const { customerList } = this.state;
    // 判断是否已经存在改用户
    const exist = _.findIndex(customerList, o => o.cusId === customer.cusId) > -1;
    if (exist) return;
    const newList = _.concat([customer], customerList);
    this.setState({
      customerList: newList,
    });
    this.passData2Home(this.pickValue(newList));
  }

  // 删除选择的用户
  @autobind
  handleDeleteCustomer() {
    const { customerList, selectList } = this.state;
    if (_.isEmpty(selectList)) return;
    const newList = _.filter(customerList, item => !_.includes(selectList, item.cusId));
    this.setState({
      customerList: newList,
      selectList: [],
    });
    this.passData2Home(this.pickValue(newList));
  }

  @autobind
  handleSelectedCustList(selectList) {
    this.setState({
      selectList,
    });
  }

  @autobind
  closeProcessModal() {
    this.setState({
      processModal: false,
      content: [[]],
    });
  }

  render() {
    const { searchList, onSearch } = this.props;
    const { customerList, processModal, content } = this.state;
    const listWithKey = customerList.map(item => ({ ...item, key: item.cusId }));
    return (
      <div className={styles.addCustomersBox}>
        <OperationOfCustermorList
          onChangeValue={onSearch}
          labelName="客户"
          dataSource={searchList}
          onDelectCustomer={this.handleDeleteCustomer}
          validate={this.handleValidate}
        />
        <div className={styles.tableList}>
          <CustomerTableList
            customerList={listWithKey}
            onSelectCustomerList={this.handleSelectedCustList}
          />
        </div>
        <ProcessConfirm
          modalKey="processModal"
          visible={processModal}
          onOk={this.closeProcessModal}
          content={content}
          contentTitle=""
        />
      </div>
    );
  }
}
