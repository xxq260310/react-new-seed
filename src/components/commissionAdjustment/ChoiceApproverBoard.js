/**
 * @file src/components/commissionAdjustment/ChoiceApproverBoard.js
 * @description 佣金调整选择审批人员弹出层
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import _ from 'lodash';

import CommonTable from '../common/biz/CommonTable';
import CommonModal from '../common/biz/CommonModal';
import styles from './choiceApproverBoard.less';
import logable from '../../decorators/logable';

const Search = Input.Search;
// 表头
const tableHeader = [
  {
    dataIndex: 'empNo',
    key: 'empNo',
    title: '工号',
    width: 120,
  },
  {
    dataIndex: 'empName',
    key: 'empName',
    title: '姓名',
    width: 120,
  },
  {
    dataIndex: 'belowDept',
    key: 'belowDept',
    title: '所属营业部',
  },
];

export default class ChoiceApproverBoard extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    approverList: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
  }

  static defaultProps = {
    approverList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      approverRadio: 0,
      listAfterFilter: _.cloneDeep(props.approverList),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { approverList: prevList } = this.props;
    const { approverList: nextList } = nextProps;
    if (!_.isEqual(prevList, nextList)) {
      this.setState({
        approverRadio: 0,
        listAfterFilter: _.cloneDeep(nextList),
      });
    }
  }

  @autobind
  onCloseModal() {
    this.props.onClose();
  }

  // 点击确认
  @autobind
  onOk() {
    const { approverRadio, listAfterFilter } = this.state;
    this.props.onOk(listAfterFilter[approverRadio]);
    this.onCloseModal();
  }

  @autobind
  onCancel() {
    this.setState({
      approverRadio: 0,
    });
    this.onCloseModal();
  }

  // 点击Radio
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '选择审批人员',
    },
  })
  handleApproverRadio(record, index) {
    this.setState({
      approverRadio: index,
    });
  }

  // 过滤审批人员列表
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索审批人员' } })
  filterApprovalUser(v) {
    const list = this.props.approverList;
    const listAfterFilter = _.filter(list, (user) => {
      const { empNo, empName } = user;
      if (empNo.indexOf(v) > -1 || empName.indexOf(v) > -1) {
        return true;
      }
      return false;
    });
    this.setState({
      approverRadio: 0,
      listAfterFilter,
    });
  }

  render() {
    const { visible } = this.props;
    const { approverRadio, listAfterFilter } = this.state;
    // 表格中需要的操作
    const operation = {
      column: {
        key: 'radio', // 'check'\'delete'\'view'
        title: '',
        radio: approverRadio,
        width: 60,
      },
      operate: this.handleApproverRadio,
    };
    return (
      <CommonModal
        title="选择审批人员"
        modalKey="choiceApprover"
        needBtn
        maskClosable={false}
        size="normal"
        visible={visible}
        closeModal={this.onCloseModal}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div className={styles.approverBox}>
          <div className={styles.serarhApprover}>
            <Search
              size="large"
              placeholder="员工号/员工姓名"
              style={{
                width: '300px',
              }}
              onSearch={this.filterApprovalUser}
              enterButton
            />
          </div>
          <div className={styles.approverListBox}>
            <CommonTable
              data={listAfterFilter}
              titleList={tableHeader}
              operation={operation}
              scroll={{ y: 294 }}
              size="middle"
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}
