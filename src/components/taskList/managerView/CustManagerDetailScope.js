/*
 * @Author: xuxiaoqin
 * @Date: 2018-04-09 21:41:03
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-13 09:10:06
 * 服务经理维度任务统计
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Table from '../../common/commonTable';
import styles from './custManagerDetailScope.less';
import { ORG_LEVEL1, ORG_LEVEL2 } from '../../../config/orgTreeLevel';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const INITIAL_PAGE_SIZE = 5;
const INITIAL_PAGE_NUM = 1;

export default class CustManagerDetailScope extends PureComponent {

  static propTypes = {
    detailData: PropTypes.object,
    currentOrgLevel: PropTypes.string,
    // 是否处于折叠状态
    isFold: PropTypes.bool,
  }

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    currentOrgLevel: '',
    isFold: false,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    return _.map(listData, item => ({
      ...item,
      // 三个字段组合作为唯一
      id: `${item.mssnId}-${item.login}-${item.custDepartmentCode}`,
    }));
  }

  /**
   * 渲染服务经理的姓名和工号在一列
   * @param {*object} record 当前行记录
   */
  @autobind
  renderManagerNameId(record = EMPTY_OBJECT) {
    const { empName, login } = record;
    return (
      <span>{empName}（{login}）</span>
    );
  }

  /**
   * 渲染各个种类的客户总数和比例
   * @param {*object} record 当前行记录
   */
  @autobind
  renderEveryCust(custTotal, everyCust) {
    const percent = ((everyCust / custTotal) * 100).toFixed(0);

    return (
      <span>{everyCust}（{percent}%）</span>
    );
  }

  /**
   * 渲染表头
   */
  @autobind
  renderTableTitle() {
    return (
      <span className={`${styles.tableTitle} tableTitle`}>服务经理</span>
    );
  }

  /**
   * 渲染每一列数据
   */
  @autobind
  renderColumn() {
    const { currentOrgLevel } = this.props;
    // 如果是营业部层级，则只展示基本的5列数据
    let columnTitle = [{
      key: 'login',
      value: '服务经理姓名工号',
      render: this.renderManagerNameId,
    }, {
      key: 'flowNum',
      value: '客户总数',
    }, {
      key: 'servFlowNum',
      value: '已服务客户',
      render: ({ flowNum, servFlowNum: everyCust }) =>
        this.renderEveryCust(flowNum, everyCust),
    }, {
      key: 'doneFlowNum',
      value: '已完成客户',
      render: ({ flowNum, doneFlowNum: everyCust }) =>
        this.renderEveryCust(flowNum, everyCust),
    }, {
      key: 'traceFlowNum',
      value: '结果达标客户',
      render: ({ flowNum, traceFlowNum: everyCust }) =>
        this.renderEveryCust(flowNum, everyCust),
    }];

    if (currentOrgLevel === ORG_LEVEL1) {
      // 经纪及财富管理部层级
      // 增加分公司和营业部展示
      columnTitle = [
        ...columnTitle,
        {
          key: 'empCompanyName',
          value: '所属分公司',
        },
        {
          key: 'empDepartmentName',
          value: '所属营业部',
        },
      ];
    } else if (currentOrgLevel === ORG_LEVEL2) {
      // 分公司层级
      // 增加营业部列展示
      columnTitle = [
        ...columnTitle,
        {
          key: 'empDepartmentName',
          value: '所属营业部',
        },
      ];
    }

    return columnTitle;
  }

  /**
   * 渲染每一列的宽度
   */
  @autobind
  renderColumnWidth() {
    const { isFold, currentOrgLevel } = this.props;
    let columnWidth = [];
    let columnWidthTotal = 0;

    if (isFold) {
      columnWidthTotal = 950;
      // 列的总宽度950px
      // 处于折叠状态，每一列的宽度需要增加
      columnWidth = ['310px', '160px', '160px', '160px', '160px'];
      if (currentOrgLevel === ORG_LEVEL1) {
        // 多展示两列数据
        columnWidth = [...columnWidth, '160px', '160px'];
        columnWidthTotal = 1270;
      } else if (currentOrgLevel === ORG_LEVEL2) {
        // 多展示一列数据
        columnWidth = [...columnWidth, '160px'];
        columnWidthTotal = 1110;
      }
    } else {
      columnWidthTotal = 570;
      // 处于展开状态,
      // 列的总宽度570px
      columnWidth = ['170px', '100px', '100px', '100px', '100px'];
      if (currentOrgLevel === ORG_LEVEL1) {
        // 多展示两列数据
        columnWidth = [...columnWidth, '100px', '150px'];
        columnWidthTotal = 820;
      } else if (currentOrgLevel === ORG_LEVEL2) {
        // 多展示一列数据
        columnWidth = [...columnWidth, '150px'];
        columnWidthTotal = 720;
      }
    }

    return {
      columnWidth,
      columnWidthTotal,
    };
  }

  render() {
    const { detailData = EMPTY_OBJECT, isFold } = this.props;
    const { page = EMPTY_OBJECT, list = EMPTY_LIST } = detailData;
    const { pageNum, pageSize, totalCount } = page;
    const {
      columnWidth,
      columnWidthTotal,
    } = this.renderColumnWidth();

    return (
      <div className={styles.container}>
        <Table
          pageData={{
            curPageNum: pageNum || INITIAL_PAGE_NUM,
            curPageSize: pageSize || INITIAL_PAGE_SIZE,
            totalRecordNum: totalCount,
          }}
          listData={this.addIdToDataSource(list)}
          onSizeChange={this.handleShowSizeChange}
          onPageChange={this.handlePageChange}
          tableClass={
            classnames({
              [styles.custManagerScopeTable]: true,
              // 展开的样式
              [styles.notFoldedScope]: !isFold,
              // 折叠的样式
              [styles.foldedScope]: isFold,
            })
          }
          columnWidth={columnWidth}
          titleColumn={this.renderColumn()}
          // 分页器样式
          paginationClass={'selfPagination'}
          needPagination
          isFixedColumn
          // 横向滚动，固定服务经理列
          fixedColumn={[0]}
          // 列的总宽度加上固定列的宽度
          scrollX={columnWidthTotal}
          title={this.renderTableTitle}
          emptyListDataNeedEmptyRow
        />
      </div>
    );
  }
}
