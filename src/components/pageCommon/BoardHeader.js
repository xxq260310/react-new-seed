/**
 * @fileOverview invest/BoardHeader.js
 * @author sunweibin
 * @description 业绩看板头部
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { fspContainer, optionsMap, constants } from '../../config';
import report from '../../helper/page/report';
import Icon from '../common/Icon';
import styles from './BoardHeader.less';
import logable from '../../decorators/logable';

const reactApp = fspContainer.reactApp;
// Select的选项组件
const Option = Select.Option;
// 自高到低、自低到高排序选项
const sortByOrder = optionsMap.sortByOrder;
const sortByOrderSelect = sortByOrder.map((item, index) => {
  const optionKey = `Order-${index}`;
  return (React.createElement(Option, { key: optionKey, value: `${item.key}` }, `${item.name}`));
});
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;
// 按类别排序
const sortByType = optionsMap.sortByType;

export default class BoardHeader extends PureComponent {

  static propTypes = {
    boardType: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    updateShowCharts: PropTypes.func.isRequired,
    updateCategoryScope: PropTypes.func.isRequired,
    updateCategoryOrder: PropTypes.func.isRequired,
    collectScopeSelect: PropTypes.func.isRequired,
    collectOrderTypeSelect: PropTypes.func.isRequired,
    selfRequestData: PropTypes.func,
    showScopeOrder: PropTypes.bool.isRequired,
    level: PropTypes.string,
    indexID: PropTypes.string,
    categoryScope: PropTypes.number.isRequired,
    categoryOrder: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    getTableInfo: PropTypes.func,
    showChart: PropTypes.string.isRequired,
    orgId: PropTypes.string,
    summaryType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    level: '',
    indexID: '',
    orgId: '',
    selfRequestData: () => {},
    getTableInfo: () => {},
  }

  constructor(props) {
    super(props);
    const { scope, showChart } = props;
    this.state = {
      scopeSelectValue: String(scope),
      scope: String(scope),
      showChart: showChart || 'zhuzhuangtu',
      orderType: 'desc',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { showChart, categoryScope, categoryOrder } = nextProps;
    const { categoryScope: preCategoryScope, categoryOrder: preCategoryOrder } = this.props;
    if (preCategoryScope !== categoryScope) {
      this.setState({
        scopeSelectValue: String(categoryScope),
        scope: categoryScope,
      });
    }
    if (categoryOrder !== preCategoryOrder) {
      this.setState({
        orderType: categoryOrder,
      });
    }
    this.setState({
      showChart,
    });
  }

  @autobind
  getPopupContainer() {
    return document.querySelector(reactApp);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '导出到文件' } })
  handleDataExportClick() {
    const { postExcelInfo, indexID } = this.props;
    const { scope } = this.state;
    postExcelInfo({
      categoryKey: indexID,
      scope,
    });
  }

  // 柱状图与表格切换
  @autobind
  handleIconClick(type) {
    const {
      updateShowCharts,
      indexID,
      selfRequestData,
      getTableInfo,
    } = this.props;
    const { orderType, scope } = this.state;
    if (type === 'zhuzhuangtu') {
      selfRequestData({
        categoryKey: indexID,
        orderType,
        scope,
      });
    } else {
      getTableInfo({
        categoryKey: indexID,
        scope,
      });
    }
    this.setState({
      showChart: type,
    });
    updateShowCharts(indexID, type);
  }


  @autobind
  handleSortChange(column, value) {
    const {
      indexID,
      selfRequestData,
      getTableInfo,
      updateCategoryScope,
      updateCategoryOrder,
    } = this.props;
    const { showChart, scope, orderType } = this.state;
    if (showChart === 'zhuzhuangtu') {
      selfRequestData({
        categoryKey: indexID,
        scope: column === 'scope' ? value : scope,
        orderType: column === 'orderType' ? value : orderType,
      });
    } else {
      getTableInfo({
        categoryKey: indexID,
        [column]: value,
      });
    }
    if (column === 'scope') {
      updateCategoryScope(indexID, value);
    } else {
      updateCategoryOrder(indexID, value);
    }
    this.setState({
      [column]: value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '排序方式（按范围）',
      value: '$args[0]',
    },
  })
  handleScopeChange(v) {
    this.setState({
      scopeSelectValue: v,
    });
    const { collectScopeSelect, boardType, summaryType } = this.props;
    let sortByTypeArr = sortByType[boardType];
    if (summaryType === hbgxSummaryType) {
      sortByTypeArr = sortByType.REPORT_RELATION_TYPE;
    }
    const scopeText = _.find(sortByTypeArr, { scope: String(v) }).name;
    const text = `按${scopeText}`;
    collectScopeSelect({
      text,
    });
    this.handleSortChange('scope', v);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '排序方式(按高低)',
      value: '$args[0]',
    },
  })
  handleOrderTypeChange(v) {
    const { collectOrderTypeSelect } = this.props;
    const orderText = _.find(sortByOrder, { key: String(v) }).name;
    collectOrderTypeSelect({
      text: orderText,
    });
    this.handleSortChange('orderType', v);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '表格视图' } })
  handleTablesIconClick() {
    this.handleIconClick('tables');
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '柱状视图' } })
  handleBarIconClick() {
    this.handleIconClick('zhuzhuangtu');
  }

  render() {
    // 取出相关变量
    const { level, showScopeOrder, indexID, boardType, orgId, summaryType } = this.props;
    const { showChart, orderType, scopeSelectValue } = this.state;
    let { title } = this.props;
    // 针对开通业务明细，名称进行修改
    if (indexID === 'newBusinessDetail') {
      title = `${title}(新开)`;
    }
    // 首先通过showScopeOrder来判断当前页面在invest还是在其他页面中
    const toggleSortText = classnames({
      [styles.iconBtn1]: true,
      hideSelect: !showScopeOrder && showChart === 'tables',
    });

    // 当showScopeOrder=true时在invest页面中
    const toggleIconBtn = classnames({
      [styles.iconBtn]: true,
      [styles.fixIconBtnBorder]: showScopeOrder ? false : (showChart === 'tables'),
    });

    const toggleScopeSelect = classnames({
      [styles.newSelect]: true,
      hideSelect: !showScopeOrder,
    });

    const toggleOrderTypeSelect = classnames({
      [styles.newSelect1]: true,
      hideSelect: showChart === 'tables',
    });

    const toggleBarIconColor = classnames({
      [styles.fixMargin]: true,
      iconColor: showChart === 'zhuzhuangtu',
    });
    const toggleTableIconColor = classnames({
      [styles.fixMargin]: true,
      iconColor: showChart === 'tables',
    });

    const toggleScope2Option = classnames({
      hideOption: Number(level) !== 1,
    });
    const toggleScope3Option = classnames({
      hideOption: Number(level) === 3 ||
        Number(level) === 4 ||
        (Number(level) === 2 && !report.isNewOrg(orgId)),
    });
    const toggleScope4Option = classnames({
      hideOption: Number(level) === 4,
    });

    let sortByTypeArr = sortByType[boardType];
    if (summaryType === hbgxSummaryType) {
      sortByTypeArr = sortByType.REPORT_RELATION_TYPE;
    }
    return (
      <div className={styles.titleBar}>
        <div className={styles.titleText}>{title}</div>
        <div className={styles.titleBarRight}>
          <div className={toggleSortText}>
            <span className={styles.orderLabel}>排序方式:</span>
            <Select
              value={scopeSelectValue}
              className={toggleScopeSelect}
              onChange={this.handleScopeChange}
              getPopupContainer={this.getPopupContainer}
            >
              {
                sortByTypeArr.map((item, index) => {
                  const sortByTypeIndex = index;
                  let optionClass = '';
                  // 按投顾所有级别均存在
                  if (index === 0) {
                    // 按分公司
                    optionClass = toggleScope2Option;
                  }
                  if (index === 1) {
                    // 按财富中心
                    optionClass = toggleScope3Option;
                  }
                  if (index === 2) {
                    // 按营业部
                    optionClass = toggleScope4Option;
                  }
                  return (
                    <Option
                      className={optionClass}
                      key={sortByTypeIndex}
                      value={item.scope}
                    >
                      按{item.name}
                    </Option>
                  );
                })
              }
            </Select>
            <Select
              value={orderType}
              className={toggleOrderTypeSelect}
              onChange={this.handleOrderTypeChange}
              getPopupContainer={this.getPopupContainer}
            >
              {sortByOrderSelect}
            </Select>
          </div>
          <div className={toggleIconBtn}>
            <Icon
              title="表格视图"
              type="biaoge"
              className={toggleTableIconColor}
              onClick={this.handleTablesIconClick}
            />
            <Icon
              title="柱状视图"
              type="bar"
              className={toggleBarIconColor}
              onClick={this.handleBarIconClick}
            />
          </div>
          <div className={styles.iconBtn}>
            <Icon
              title="导出到文件"
              type="export"
              onClick={this.handleDataExportClick}
            />
          </div>
        </div>
      </div>
    );
  }
}
