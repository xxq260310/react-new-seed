/*
 * @Author: LiuJianShu
 * @Date: 2017-05-04 16:50:40
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-03-19 11:46:17
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Popover } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import ScrollBar from './ScrollBar';

import { data as helperData } from '../../helper';
import Pagination from '../common/Pagination';
import { fspContainer, optionsMap, constants } from '../../config';
import styles from './ChartTable.less';

// 按类别排序
const sortByType = optionsMap.sortByType;
const revert = { asc: 'desc', desc: 'asc' };
const fsp = document.querySelector(fspContainer.container);
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;

export default class ChartTable extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string,
    chartTableInfo: PropTypes.object,
    style: PropTypes.object,
    sourceData: PropTypes.array,
    data: PropTypes.object,
    getTableInfo: PropTypes.func,
    replace: PropTypes.func.isRequired,
    scope: PropTypes.number.isRequired,
    indexID: PropTypes.string,
    boardType: PropTypes.string.isRequired,
    summaryType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    location: {},
    style: {},
    level: '',
    indexID: '',
    chartTableInfo: {},
    sourceData: [],
    data: {},
    getTableInfo: () => { },
    repalce: () => { },
  }
  constructor(props) {
    super(props);
    this.state = {
      table: {
        bordered: true,
        loading: false,
        pagination: false,
        sortedInfo: null,
      },
      // url 中会存放的值
      orderIndicatorId: '',
      orderType: '',
      pageNum: 1,
      arr: [],
      temp: [],
      allWidth: 100,
      scrollDisplay: false,
      scrollLeft: 0,
    };
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.chartTableInfo)) {
      this.changeTableData(this.props);
    }
    this.onScroll();
    window.addEventListener('resize', this.onScroll, false);
    if (fsp) {
      $(fsp).on('scroll', this.onScroll);
    } else {
      document.addEventListener('scroll', this.onScroll, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    // 根据 nextProps 的值是否变化来判断是否调用此方法
    const props = this.props;
    if (!_.isEqual(props.chartTableInfo, nextProps.chartTableInfo)
      || !_.isEqual(props.scope, nextProps.scope)) {
      this.changeTableData(nextProps);
    }
  }

  componentDidUpdate() {
    this.onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onScroll);
    if (fsp) {
      $(fsp).off('scroll', this.onScroll);
    } else {
      document.removeEventListener('scroll', this.onScroll);
    }
  }

  // 表格滚动条显示
  @autobind
  onScroll() {
    const currentTable = this.currentTable;
    // 表格tbody
    const tableTbody = currentTable.querySelector('.ant-table-tbody');
    // 表格body
    const tableBody = currentTable.querySelector('.ant-table-body');
    // 表格向左滚动距离
    const tableScrollLeft = tableBody.scrollLeft;
    // 窗口可视高度
    const docElemHeight = document.documentElement.clientHeight;
    // 表格tbody距离顶部距离
    const topDistance = tableTbody.getBoundingClientRect().top;
    // 表格tbody的高度
    const tableTbodyHeight = tableTbody.clientHeight;
    if (tableTbody) {
      // 如果窗口可视高度大于表格tbody高度、元素距离顶部距离之和，此时表格全部显示出来，此时是不需要显示滚动条的，否则显示
      const visible = docElemHeight - tableTbodyHeight - topDistance;
      if (visible < 0 && topDistance > 0 && topDistance < docElemHeight) {
        this.setState({ scrollDisplay: true });
        this.setState({ scrollLeft: tableScrollLeft });
      } else {
        this.setState({ scrollDisplay: false });
      }
    }
  }

  @autobind
  setScrollLeft(scrollLeftValue) {
    const currentTable = this.currentTable;
    const tableBody = currentTable.querySelector('.ant-table-body');
    tableBody.scrollLeft = scrollLeftValue;
  }

  // 组合表格头部 排序 html
  @autobind
  getTitleHtml(item, unitFlag = true) {
    const { orderIndicatorId, orderType } = this.state;
    const orderUp = classnames({
      'ant-table-column-sorter-up': true,
      on: orderIndicatorId === item.key && (orderType !== 'desc'),
      off: orderIndicatorId === item.key && (orderType === 'desc'),
    });
    const orderDown = classnames({
      'ant-table-column-sorter-up': true,
      on: orderIndicatorId === item.key && (orderType !== 'asc'),
      off: orderIndicatorId === item.key && (orderType === 'asc'),
    });
    let titleHtml = '';
    titleHtml = (<span
      className={styles.columnsTitle}
      onClick={() => { this.handleTitleClick(item); }}
    >
      {unitFlag && item.unit ?
        `${item.name}(${encodeURIComponent(item.unit).indexOf(encodeURIComponent('元')) !== -1 ? `万${item.unit}` : item.unit})`
        :
        item.name
      }
      {
        !item.children ?
          <span className={'ant-table-column-sorter'}>
            <span
              className={orderUp}
              title="↑"
              onClick={(e) => {
                this.arrowHandle(e, item, 'asc');
              }}
            >
              <i className={'anticon anticon-caret-up'} />
            </span>
            <span
              className={orderDown}
              title="↓"
              onClick={(e) => {
                this.arrowHandle(e, item, 'desc');
              }}
            >
              <i className={'anticon anticon-caret-down'} />
            </span>
          </span>
          :
          null
      }

    </span>);
    return titleHtml;
  }
  // 根据 column 的 name 计算 column 的宽度
  @autobind
  getColumnWidth(str, unitStr = 0) {
    let newUnit = unitStr;
    if (encodeURIComponent(unitStr).indexOf(encodeURIComponent('元')) !== -1) {
      newUnit = `万${unitStr}`;
    }
    // 取出字符串对应的字节长度，汉字为 2，英文符号为 1，最终除以 2 当做字符串长度
    const length = helperData.getStrLen(str) / 2;
    let unitLength;
    if (!_.isEmpty(newUnit)) {
      unitLength = helperData.getStrLen(newUnit) / 2;
    } else {
      unitLength = 0;
    }
    // TODO，取出每个文字的实际字体大小
    // 设定每个 column 的宽度，16 为每个字的假想大小，60 为后面的箭头宽度
    const width = (length * 16) + (unitLength * 16) + 60;
    // 设定最小宽度，以防 name 太短，而对应的值过大，标题会换行
    return width < 120 ? 120 : width;
  }
  // 获取表格头部子元素
  @autobind
  getChildren(item) {
    const childrenArr = [];
    if (item.children) {
      item.children.map((child) => {
        const stamp = new Date().getTime();
        const childObj = {
          title: this.getTitleHtml(child),
          dataIndex: child.key,
          width: this.getColumnWidth(child.name, child.unit),
          key: `key${child.key}${stamp}`,
        };
        const hasThreeEle = child.children;
        if (hasThreeEle) {
          const threeEleArr = this.getThreeEle(child);
          childObj.children = threeEleArr;
        }
        return childrenArr.push(childObj);
      });
    }
    return childrenArr;
  }

  // 获取表格头部三级元素
  @autobind
  getThreeEle(item) {
    const threeEleArr = [];
    if (item.children) {
      item.children.map((child) => {
        const stamp = new Date().getTime();
        const threeEleObj = {
          title: this.getTitleHtml(child),
          dataIndex: child.key,
          width: this.getColumnWidth(child.name, child.unit),
          key: `key${child.key}${stamp}`,
        };
        return threeEleArr.push(threeEleObj);
      });
    }
    return threeEleArr;
  }
  @autobind
  handleTitleClick(item) {
    if (!_.isEmpty(item.children)) {
      return;
    }
    const { getTableInfo, indexID, scope } = this.props;
    const { orderIndicatorId, orderType, pageNum } = this.state;
    let tableOrderType;
    if (orderIndicatorId === item.key) {
      tableOrderType = revert[orderType] || 'desc';
    } else {
      tableOrderType = 'asc';
    }
    this.setState({
      orderIndicatorId: item.key,
      orderType: tableOrderType,
    });
    getTableInfo({
      orderIndicatorId: item.key,
      orderType: tableOrderType,
      pageNum,
      scope,
      categoryKey: indexID,
    });
  }
  // 表格标题排序箭头事件
  @autobind
  arrowHandle(e, item, type) {
    const { getTableInfo, indexID, scope } = this.props;
    const { pageNum } = this.state;
    e.stopPropagation();
    this.setState({
      orderIndicatorId: item.key,
      orderType: type,
    });
    getTableInfo({
      orderIndicatorId: item.key,
      orderType: type,
      pageNum,
      scope,
      categoryKey: indexID,
    });
  }
  // 表格第一列 tooltip 处理事件
  @autobind
  toolTipHandle(record) {
    let toolTipTittle;
    if (record.orgModel) {
      if (record.level === '3') {
        toolTipTittle = (<div>
          <p>{record.orgModel.level2Name}</p><p>{record.orgModel.level3Name}</p>
        </div>);
      } else if (record.level === '4') {
        toolTipTittle = (<div>
          <p>
            {record.orgModel.level2Name}
            {_.isEmpty(record.orgModel.level3Name) ? '' : `-${record.orgModel.level3Name}`}
          </p>
          <p>{record.orgModel.level4Name}</p>
        </div>);
      } else if (record.level === '5') {
        toolTipTittle = (<div>
          <p>
            {record.orgModel.level2Name}
            {_.isEmpty(record.orgModel.level3Name) ? '' : `-${record.orgModel.level3Name}`}
            -{record.orgModel.level4Name}
          </p>
          <p>{record.orgModel.level5Name}</p>
        </div>);
      } else {
        toolTipTittle = '';
      }
    } else {
      toolTipTittle = '';
    }
    return toolTipTittle ? <Popover placement="right" content={toolTipTittle} trigger="hover">
      <div className={styles.tdWrapperDiv}>
        {record.city}
      </div>
    </Popover>
      :
    <div className={styles.tdWrapperDiv}>{record.city}</div>;
    // return toolTipTittle ? <Tooltip placement="right" title={toolTipTittle}>
    //   <div className={styles.tdWrapperDiv}>
    //     {record.city}
    //   </div>
    // </Tooltip>
    // :
    // <div className={styles.tdWrapperDiv}>{record.city}</div>;
  }
  @autobind
  unitChange(arr) {
    let value;
    const newArr = arr.map((item) => {
      if (item.value && item.value !== 'null') {
        const itemValue = Number(item.value);
        switch (encodeURIComponent(item.unit)) {
          case encodeURIComponent('%'):
            value = Number.parseFloat((itemValue * 100).toFixed(2));
            break;
          case encodeURIComponent('‰'):
            value = Number.parseFloat((itemValue * 1000).toFixed(2));
            break;
          case encodeURIComponent('元'):
            value = `${Number.parseFloat((itemValue / 10000).toFixed(2))}`;
            break;
          case encodeURIComponent('元/年'):
            value = `${Number.parseFloat((itemValue / 10000).toFixed(2))}`;
            break;
          default:
            value = Number.parseFloat(itemValue.toFixed(2));
            break;
        }
      } else {
        value = '暂无';
      }
      return {
        [item.key]: value,
      };
    });
    return newArr;
  }
  // 分页事件
  @autobind
  handlePaginationChange(page) {
    const { getTableInfo, indexID, scope } = this.props;
    const { orderIndicatorId, orderType } = this.state;
    this.setState({
      pageNum: page,
    });
    getTableInfo({
      pageNum: page,
      orderIndicatorId,
      orderType,
      scope,
      categoryKey: indexID,
    });
  }
  @autobind
  changeTableData(nextProps) {
    const { chartTableInfo, scope, boardType, summaryType } = nextProps;
    const columns = chartTableInfo.titleList;
    const data = chartTableInfo.indicatorSummuryRecordDtos;
    const temp = [];
    let newArr = [];
    let tempArr = [];
    let allWidth;
    if (data && data.length) {
      data.map((item, index) => {
        const testArr = this.unitChange(item.indicatorDataList);
        const { id, level: itemLevel, name, orgModel = {} } = item;
        return temp.push(Object.assign(
          { key: index, city: name, level: itemLevel, id, orgModel }, ...testArr,
        ));
      });
      tempArr = columns.map((item) => {
        const tempName = `${item.name}`;
        const column = {
          dataIndex: item.key,
          title: this.getTitleHtml(item),
          width: this.getColumnWidth(tempName),
          render: text => (
            <div className={styles.tdWrapperDiv}>
              {text}
            </div>
          ),
        };
        // 如果表格标题包含 children，则给每个 child 设置排序事件
        const hasChildren = item.children;
        if (hasChildren) {
          const childArr = this.getChildren(item);
          column.children = childArr;
          column.title = tempName;
          column.width = _.sumBy(childArr, 'width');
        }
        return column;
      });
      // 匹配第一列标题文字，分公司、营业部、投顾
      // sortByType 初始的 scope 为 2，所以减去两个前面对象，得出最后与实际 scope 相等的索引
      let sortByTypeArr = sortByType[boardType];
      if (summaryType === hbgxSummaryType) {
        sortByTypeArr = sortByType.REPORT_RELATION_TYPE;
      }
      const keyName = sortByTypeArr[Number(scope) - 2].name;
      tempArr.unshift({
        title: keyName,
        dataIndex: 'city',
        key: 'city',
        width: 170,
        fixed: 'left',
        render: (text, record) => (
          this.toolTipHandle(record)
        ),
      });
      allWidth = _.sumBy(tempArr, 'width');
      // 最外层容器的宽度， 40 为 reportBody 的 margin 值
      const clientWidth = document.querySelector('#exApp').clientWidth - 40;
      // 如果表格的总宽度小于最外层容器的宽度，则删除设定好的 column 宽度，让其自适应
      // 否则按设定的宽度处理
      if (allWidth < clientWidth) {
        newArr = tempArr.map((item, index) => {
          let newItem = {};
          if (index !== 0) {
            newItem = { ...item, width: null };
          } else {
            newItem = item;
          }
          return newItem;
        });
      } else {
        newArr = tempArr;
      }
    }
    this.setState({
      arr: newArr,
      temp,
      allWidth,
    });
  }

  @autobind
  saveTableWrapper(dom) {
    this.currentTable = dom;
  }

  render() {
    const { chartTableInfo, style } = this.props;
    const { allWidth, scrollDisplay } = this.state;
    const paginationOption = {
      curPageNum: chartTableInfo.curPageNum || 1,
      totalRecordNum: chartTableInfo.totalCnt || 1,
      curPageSize: chartTableInfo.pageSize,
      onPageChange: this.handlePaginationChange,
      isShowSizeChanger: false,
    };
    return (
      <div className={styles.tableDiv} style={style} ref={this.saveTableWrapper}>
        <Table
          {...this.state.table}
          columns={this.state.arr}
          dataSource={this.state.temp}
          className={chartTableInfo.curPageNum === 1 ? styles.firstPage : ''}
          onChange={this.handleChange}
          scroll={{ x: this.state.allWidth }}
          // 默认文案配置
          locale={{
            // 空数据时的文案
            emptyText: '暂无数据',
          }}
        />
        <Pagination
          {...paginationOption}
        />
        {
          scrollDisplay ?
            <ScrollBar
              allWidth={allWidth}
              setScrollLeft={this.setScrollLeft}
              tableScrollLeft={this.state.scrollLeft}
            />
            :
            <div />
        }
      </div>
    );
  }
}
