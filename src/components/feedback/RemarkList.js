/**
 * @file components/feedback/RemarkList.js
 *  处理记录
 * @author yangquanjian
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import './remarkList.less';

const EMPTY_LIST = [];
export default class RemarkList extends PureComponent {
  static propTypes = {
    remarkList: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    const { remarkList = EMPTY_LIST } = props;
    this.state = {
      dataSource: remarkList,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { remarkList: nextList = EMPTY_LIST } = nextProps;
    const { remarkList: prevList = EMPTY_LIST } = this.props;
    if (nextList !== prevList) {
      this.setState({
        dataSource: nextList,
      });
    }
  }
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'title.description',
      width: '100%',
      render: (text, record) =>
        // 当前行记录
        (
          <div className="item">
            <div className="wrap">
              <div className="info_dv">
                <span>{record.title}</span>
              </div>
              <pre className="txt">
                {record.description}
              </pre>
            </div>
          </div>
        ),
    }];
    return columns;
  }
  /**
   * 构造数据源
   */
  constructTableDatas() {
    const { dataSource } = this.state;
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }
    return newDataSource;
  }
  render() {
    const columns = this.constructTableColumns();
    return (
      <Table
        className="record_list"
        columns={columns}
        dataSource={this.constructTableDatas()}
        showHeader={false}
        pagination={false}
        bordered={false}
        // 默认文案配置
        locale={{
          // 空数据时的文案
          emptyText: '暂无数据',
        }}
      />
    );
  }
}
