/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 08:57:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 13:41:39
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Table from './Table';
import Pagination from '../Pagination';
import styles from './index.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const NOOP = _.noop;

// 给数据源添加空数据
// 譬如分页需要一页12条，总数据有45条，那么添加45%12条空白行
const padDataSource = (dataSource, pageSize, emptyListDataNeedEmptyRow) => {
  if (_.isEmpty(dataSource) && !emptyListDataNeedEmptyRow) {
    return EMPTY_LIST;
  }
  const dataSize = _.size(dataSource);
  const emptyRowCount = _.isEmpty(dataSource) ?
    pageSize : (Math.ceil(dataSize / pageSize) * pageSize) - dataSize;
  let newDataSource = dataSource;
  // 填充空白行
  for (let i = 1; i <= emptyRowCount; i++) {
    newDataSource = _.concat(newDataSource, [{
      key: `empty_row_${i}`,
      id: `empty_row_${i}`,
      // 空白行标记
      flag: `empty_row_${i}`,
    }]);
  }

  return newDataSource;
};

export default class CommonTable extends PureComponent {
  static propTypes = {
    pageData: PropTypes.object,
    listData: PropTypes.array,
    // 页目change的时候
    onSizeChange: PropTypes.func,
    // 页码change的时候
    onPageChange: PropTypes.func,
    // 表格的className
    tableClass: PropTypes.string.isRequired,
    // 表格标题
    titleColumn: PropTypes.array.isRequired,
    // 表格操作列action
    actionSource: PropTypes.array,
    // 表格第一列是否可以点击
    isFirstColumnLink: PropTypes.bool,
    // 表格第一列点击的回调
    firstColumnHandler: PropTypes.func,
    // 是否展示表格边框
    bordered: PropTypes.bool,
    // 是否固定列
    isFixedColumn: PropTypes.bool,
    // 是否固定标题
    isFixedTitle: PropTypes.bool,
    // 固定列的区间
    fixedColumn: PropTypes.array,
    // 滚动的x范围
    scrollX: PropTypes.number,
    // 滚动Y范围
    scrollY: PropTypes.number,
    // row selection
    isNeedRowSelection: PropTypes.bool,
    // 选择单列的回调
    onSingleRowSelectionChange: PropTypes.func,
    // 选择列回调
    onRowSelectionChange: PropTypes.func,
    // 当前选中项的key数组
    currentSelectRowKeys: PropTypes.array,
    // 列的宽度
    columnWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    // 是否需要分页
    needPagination: PropTypes.bool,
    // 选择框类型
    selectionType: PropTypes.string,
    // 全选，取消全选回调
    onSelectAllChange: PropTypes.func,
    // tableStyle
    tableStyle: PropTypes.object,
    // 第一列class
    operationColumnClass: PropTypes.string,
    // 是否展示表头
    showHeader: PropTypes.bool,
    // 分页器是否在表格内部
    paginationInTable: PropTypes.bool,
    // 是否需要展示空白数据行
    needShowEmptyRow: PropTypes.bool,
    // 分页器class
    paginationClass: PropTypes.string,
    // 当listData数据源为空的时候是否需要填充空白行
    emptyListDataNeedEmptyRow: PropTypes.bool,
    // 表格头部
    title: PropTypes.func,
  };

  static defaultProps = {
    pageData: EMPTY_OBJECT,
    listData: EMPTY_LIST,
    actionSource: [],
    isFirstColumnLink: false,
    bordered: false,
    isFixedColumn: false,
    fixedColumn: [],
    scrollX: 0,
    scrollY: 0,
    isFixedTitle: false,
    columnWidth: ['20%', '20%', '20%', '20%', '20%'],
    firstColumnHandler: NOOP,
    isNeedRowSelection: false,
    onSingleRowSelectionChange: NOOP,
    onRowSelectionChange: NOOP,
    currentSelectRowKeys: [],
    needPagination: true,
    onPageChange: NOOP,
    onSizeChange: NOOP,
    selectionType: 'radio',
    onSelectAllChange: NOOP,
    tableStyle: null,
    operationColumnClass: '',
    showHeader: true,
    paginationInTable: false,
    needShowEmptyRow: true,
    paginationClass: '',
    emptyListDataNeedEmptyRow: false,
    title: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      curSelectedRow: -1,
    };
  }

  @autobind
  handleRowClick(record, index) {
    this.setState({
      curSelectedRow: index,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'Page为$args[0]' } })
  handlePageChange(page, pageSize) {
    this.props.onPageChange(page, pageSize);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'PageSize为$args[1]' } })
  handlePageSizeChange(current, size) {
    this.props.onSizeChange(current, size);
  }

  /**
   * 构造page size
   * @param {*} totalRecordNum 总条目
   * @param {*} curPageSize 当前分页数
   */
  renderPageSizeOptions(totalRecordNum) {
    const { originPageSizeUnit } = this.state;
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / originPageSizeUnit);

    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((originPageSizeUnit * i).toString());
    }

    return pageSizeOption;
  }

  @autobind
  renderColumnValue(record, item) {
    // 如果存在空白行标记，则不展示--,直接展示空
    if (!_.isEmpty(record.flag)) {
      return '';
    }
    if ((!_.isInteger(record[item.key]) && _.isEmpty(record[item.key]))) {
      return '--';
    }
    if (item.render) {
      return item.render(record, item.key);
    }
    return record[item.key];
  }

  /**
   * 合并单元格
   * @param {*string} value 当前值
   * @param {*object} row 当前行记录
   * @param {*number} index 当前行索引
   */
  renderContent(value, row, index, needMergeRowIndex) {
    const obj = {
      children: value,
      props: {},
    };
    if (index === needMergeRowIndex) {
      obj.props.colSpan = 0;
    }
    return obj;
  }

  /**
   * 构造每一列
   */
  renderColumns() {
    const {
      listData,
      titleColumn,
      actionSource,
      isFirstColumnLink,
      firstColumnHandler,
      isFixedColumn,
      fixedColumn,
      columnWidth,
      operationColumnClass,
      emptyListDataNeedEmptyRow,
    } = this.props;
    const len = titleColumn.length - 1;

    if (_.isEmpty(listData) && !emptyListDataNeedEmptyRow) {
      return [];
    }

    return _.map(titleColumn, (item, index) => ({
      dataIndex: item.key,
      width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
      title: item.value,
      fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
      render: (text, record) => {
        if (index === 0 && isFirstColumnLink) {
          // 第一列可以Link，有handler
          return (
            <div
              className={
                classnames({
                  [styles.operation]: true,
                  [operationColumnClass]: true,
                  operation: true,
                })}
            >
              <span
                title={record[item.key]}
                className={styles.link}
                onClick={() => firstColumnHandler(record, item.value)}
              >
                {this.renderColumnValue(record, item)}
              </span>
            </div>
          );
        }
        if (index === len && !_.isEmpty(actionSource)) {
          return (<div
            className={
              classnames({
                [styles.operation]: true,
                operation: true,
              })}
          >
            {
              _.map(actionSource, itemData => (
                <span
                  className={styles.link}
                  key={itemData.type}
                  onClick={() => itemData.handler(record)}
                >
                  {itemData.type}
                </span>
              ),
              )
            }
          </div>);
        }

        return (
          <span title={record[item.key]} className={'column'}>
            {this.renderColumnValue(record, item)}
          </span>
        );
      },
    }));
  }

  /**
   * 构造数据源
   */
  renderTableDatas(dataSource) {
    const {
      needShowEmptyRow,
      emptyListDataNeedEmptyRow,
      pageData: { curPageSize },
      paginationInTable,
    } = this.props;
    if (_.isEmpty(dataSource) && !emptyListDataNeedEmptyRow) {
      return [];
    }

    let newDataSource = [];
    // 在外部传入数据时，统一加入一个id
    newDataSource = _.map(dataSource,
      item => ({
        ...item,
        key: item.id,
      }));

    if (needShowEmptyRow) {
      return padDataSource(
        newDataSource,
        Number(curPageSize),
        emptyListDataNeedEmptyRow,
        paginationInTable,
      );
    }

    return newDataSource;
  }

  @autobind
  renderRowSelection() {
    const {
      onRowSelectionChange,
      onSingleRowSelectionChange,
      currentSelectRowKeys,
      selectionType,
      onSelectAllChange,
    } = this.props;

    return {
      type: selectionType || 'radio',
      selectedRowKeys: currentSelectRowKeys,
      onChange: onRowSelectionChange,
      hideDefaultSelections: true,
      onSelect: onSingleRowSelectionChange,
      onSelectAll: onSelectAllChange,
    };
  }

  @autobind
  renderFooter(paganationOption) {
    return (
      <Pagination
        paginationKey={'pagination'}
        {...paganationOption}
      />
    );
  }

  render() {
    const {
      listData = EMPTY_LIST,
      pageData: {
        curPageNum,
        curPageSize,
        totalRecordNum,
        isHideLastButton,
        isShortPageList,
        showSizeChanger,
        },
      tableClass,
      bordered,
      isFixedColumn,
      scrollX,
      scrollY,
      isFixedTitle,
      isNeedRowSelection,
      needPagination,
      tableStyle,
      showHeader,
      paginationClass,
      title: tableTitle,
      paginationInTable,
    } = this.props;
    const { curSelectedRow } = this.state;
    const paganationOption = {
      current: Number(curPageNum),
      total: Number(totalRecordNum),
      pageSize: Number(curPageSize),
      isHideLastButton,
      isShortPageList,
      showSizeChanger,
      onChange: (page, pageSize) => {
        // 翻页的时候，将高亮取消
        this.setState({
          curSelectedRow: -1,
        });
        this.handlePageChange(page, pageSize);
      },
      onShowSizeChange: this.handlePageSizeChange,
    };
    const dataSource = this.renderTableDatas(listData);
    const columns = this.renderColumns(paganationOption);
    const scrollYArea = isFixedTitle ? { y: scrollY } : {};
    const scrollXArea = isFixedColumn ? { x: scrollX } : {};
    const tableStyleProp = !_.isEmpty(tableStyle) ? { style: tableStyle } : {};
    const titleProp = tableTitle ? { title: tableTitle } : {};
    const footerProp = paginationInTable ? {
      footer: () =>
        this.renderFooter(paganationOption),
    } : {};

    return (
      <div className={styles.groupTable}>
        <Table
          className={tableClass}
          columns={columns}
          dataSource={dataSource}
          bordered={bordered}
          scroll={_.merge(scrollXArea, scrollYArea)}
          onRow={(record, index) => ({
            onClick: () => this.handleRowClick(record, index),       // 点击行
          })}
          rowSelection={isNeedRowSelection ? this.renderRowSelection() : null}
          rowClassName={(record, index) =>
            classnames({
              [styles.rowSelected]: curSelectedRow === index,
              // 如果存在flag标记，说明是空白行
              emptyRow: !_.isEmpty(record.flag),
            })}
          showHeader={showHeader}
          {...tableStyleProp}
          pagination={(needPagination && totalRecordNum > 0 && !paginationInTable) ?
            paganationOption : false}
          paginationClass={`${styles.pagination} ${paginationClass}`}
          // 默认文案配置
          locale={{
            // 空数据时的文案
            emptyText: '暂无数据',
          }}
          {...titleProp}
          {...footerProp}
        />
      </div>
    );
  }
}
