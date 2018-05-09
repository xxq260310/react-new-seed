/**
 * @file components/commissionAdjustment/CutomerTableList.js
 * @description 批量佣金调整用户列表
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Table } from 'antd';

import styles from './customerTableList.less';
import logable from '../../decorators/logable';

// 表格的表头
const columns = [
  {
    title: '经纪客户号',
    dataIndex: 'brokerNumber',
  },
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: '300px',
  },
  {
    title: '客户等级',
    dataIndex: 'custLevelName',
  },
  {
    title: '开户营业部',
    dataIndex: 'openOrgName',
  },
];

export default class CutomerTableList extends PureComponent {
  static propTypes = {
    customerList: PropTypes.array,
    onSelectCustomerList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    customerList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { customerList: prevList } = this.props;
    const { customerList: nextList } = nextProps;
    if (!_.isEqual(prevList, nextList)) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '批量佣金添加客户',
    },
  })
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
    this.props.onSelectCustomerList(selectedRowKeys);
  }

  render() {
    const { customerList } = this.props;
    if (_.isEmpty(customerList)) {
      return null;
    }
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <Table
        className={`${styles.cutomerListTable}`}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={customerList}
        pagination={{
          pageSize: 10,
        }}
        // 默认文案配置
        locale={{
          // 空数据时的文案
          emptyText: '暂无数据',
        }}
      />
    );
  }
}
