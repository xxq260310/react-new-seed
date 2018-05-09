/*
 * @Author: LiuJianShu
 * @Date: 2017-09-12 10:39:48
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-08 14:17:56
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import './index.less';
import Icon from '../Icon';
import { feedbackOptions } from '../../../config';
import logable from '../../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

// 状态字典
const STATUS_MAP = [
  { value: 'PROCESSING', label: '解决中' },
  { value: 'CLOSED', label: '关闭' },
];

export default class LeftPanel extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      curSelectedRow: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 第一次替换query
    // 添加currentId
    const { list: { resultData: prevResultData = EMPTY_LIST } } = this.props;
    const {
      location: { query, pathname, query: { currentId } },
      replace,
      list: { resultData = EMPTY_LIST, page = EMPTY_OBJECT } } = nextProps;
    const { curPageNum, pageSize } = page;

    // 只有当有数据，
    // 当前没有选中项currentId
    // 或者query上存在currentId，但是数据没有匹配时
    // 默认设置第一条初始值
    if (prevResultData !== resultData) {
      if (!_.isEmpty(resultData)) {
        if ((!currentId || (
          currentId &&
          _.isEmpty(_.find(resultData, item => item.id.toString() === currentId))
        ))) {
          replace({
            pathname,
            query: {
              ...query,
              currentId: resultData[0] && resultData[0].id,
              curPageNum,
              curPageSize: pageSize,
            },
          });
          // 选中第一行
          this.setState({
            curSelectedRow: 0,
          });
        } else {
          // query上存在正确的currentId
          // 设置当前选中行
          this.setState({
            curSelectedRow: _.findIndex(resultData,
              item => item.id.toString() === currentId),
          });

          replace({
            pathname,
            query: {
              ...query,
              // curPageNum,
              // curPageSize: pageSize,
            },
          });
        }
      }
    }
  }

  /**
   * 点击某一行记录
   * @param {*} record 当前行数据
   * @param {*} index 当前行index
   */
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '问题反馈左侧列表',
    },
  })
  handleRowClick(record, index) {
    const {
      location: { pathname, query },
      replace,
      list: { resultData = EMPTY_LIST },
    } = this.props;

    // 设置当前选中行
    this.setState({
      curSelectedRow: index,
    });

    // 替换currentId
    replace({
      pathname,
      query: {
        ...query,
        currentId: resultData[index].id,
      },
    });
  }

  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页
   */
  @autobind
  @logable({ type: 'Click', payload: { name: 'Page为$args[0]' } })
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
      },
    });
  }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'issueType.feedId.description.feedEmpInfo',
      width: '80%',
      render: (text, record) => {
        // 当前行记录
        const { feedEmpInfo = EMPTY_OBJECT, issueType } = record;
        const { name = '无', l1 = '', l2 = '', l3 = '' } = feedEmpInfo;
        const typeIcon = {
          type: issueType === 'DEFECT' ? 'wenti' : 'jianyi',
          className: issueType === 'DEFECT' ? 'wenti' : 'jianyi',
        };
        return (
          <div className="leftSection">
            <div className="id">
              {issueType ? <Icon {...typeIcon} /> : <Icon className="emptyIcon" />}
              <span className="feedbackId">{record.feedId || '无'}</span>
            </div>
            <div className="description">{record.description || '无'}</div>
            <div className="address">来自：{name}，{`${l1 || ''}${l2 || ''}${l3 || ''}` || '无'}</div>
          </div>
        );
      },
    }, {
      dataIndex: 'status.processer.createTime',
      width: '20%',
      render: (text, record) => {
        // 当前行记录
        let statusClass;
        let statusLabel;
        let processerLabel;
        if (record.status) {
          statusClass = classnames({
            'state-resolve': record.status === STATUS_MAP[0].value,
            'state-close': record.status === STATUS_MAP[1].value,
          });
          statusLabel = STATUS_MAP.filter(item => item.value === record.status);
        }
        if (!_.isEmpty(record.processer)
          && record.processer !== '无'
          && record.processer !== 'null') {
          processerLabel = feedbackOptions.allOperatorOptions.filter(item =>
            item.value === record.processer);
        }
        return (
          <div className="rightSection">
            <div className={statusClass}>{(!_.isEmpty(statusLabel) && statusLabel[0].label) || '无'}</div>
            <div className="name">{(!_.isEmpty(processerLabel) && processerLabel[0].label) || '无'}</div>
            <div className="date">{(record.createTime &&
              record.createTime.length >= 10 &&
              record.createTime.slice(0, 10)) || '无'}</div>
          </div>
        );
      },
    }];

    return columns;
  }

  /**
   * 构造数据源
   */
  constructTableDatas(dataSource) {
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    return newDataSource;
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  @logable({ type: 'Click', payload: { name: 'PageSize为$args[1]' } })
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
      },
    });
  }

  constructPageSizeOptions(totalRecordNum) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }

    return pageSizeOption;
  }

  render() {
    const { list: { resultData = EMPTY_LIST, page = EMPTY_OBJECT },
      location: { query: { curPageNum, curPageSize } } } = this.props;
    const { totalRecordNum } = page;
    const { curSelectedRow } = this.state;

    if (!resultData) {
      return null;
    }

    const columns = this.constructTableColumns();

    const paginationOptions = {
      current: parseInt(curPageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: totalRecordNum,
      pageSize: parseInt(curPageSize, 10),
      defaultPageSize: 10,
      onChange: this.handlePageChange,
      showTotal: total => `共${total}个`,
      showSizeChanger: true,
      onShowSizeChange: this.handleShowSizeChange,
      pageSizeOptions: this.constructPageSizeOptions(totalRecordNum),
    };

    return (
      <div className="leftPanel">
        <Table
          className="leftPanelTable"
          columns={columns}
          dataSource={this.constructTableDatas(resultData)}
          onRow={(record, index) => ({
            onClick: () => this.handleRowClick(record, index),       // 点击行
          })}
          showHeader={false}
          pagination={paginationOptions}
          bordered={false}
          rowClassName={(record, index) => {
            if (curSelectedRow === index) {
              return 'active';
            }
            return '';
          }}
          // 默认文案配置
          locale={{
            // 空数据时的文案
            emptyText: '暂无数据',
          }}
        />
      </div >
    );
  }
}
