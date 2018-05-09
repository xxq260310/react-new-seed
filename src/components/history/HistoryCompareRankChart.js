/**
 * @description 历史对比排名区域
 * @author sunweibin
 * @fileOverview history/HistoryCompareRankChart.js
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { optionsMap, constants } from '../../config';
import report from '../../helper/page/report';
import Icon from '../common/Icon';
import HistoryRankChart from '../chartRealTime/HistoryRankChart';
import imgStr from '../chartRealTime/noChart.png';
import styles from './HistoryCompareRankChart.less';
import logable from '../../decorators/logable';

// Select的选项组件
const Option = Select.Option;
// 自高到低、自低到高排序选项
const sortByOrder = optionsMap.sortByOrder;
const sortByOrderSelect = sortByOrder.map((item, index) => {
  const optionKey = `hOrder-${index}`;
  return (React.createElement(Option, { key: optionKey, value: `${item.key}` }, `${item.name}`));
});
// 按类别排序
const sortByType = optionsMap.sortByType;
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;

export default class HistoryCompareRankChart extends PureComponent {
  static propTypes = {
    level: PropTypes.string,
    scope: PropTypes.string,
    boardType: PropTypes.string,
    swtichDefault: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    changeRankBar: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    orgId: PropTypes.string,
    summaryType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    level: '1', // 当前组织结构级别
    scope: '2', // 查询数据的维度
    boardType: 'TYPE_LSDB_TGJX', // 维度下拉框选项配置的默认值
    orgId: '',
  }

  constructor(props) {
    super(props);
    const { scope, data: { historyCardRecordVo } } = props; // scope为维度
    const page = this.getpagination(historyCardRecordVo);
    this.state = {
      ...page,
      scopeSelectValue: scope,
      scope,
      orderType: 'desc',
      unit: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: preData, scope: preScope, swtichDefault: oldSwitch } = this.props;
    const { data, scope, swtichDefault } = nextProps;
    if (!_.isEqual(preData, data)) {
      const page = this.getpagination(data.historyCardRecordVo);
      this.setState({
        ...page,
      });
    }
    if (!_.isEqual(preScope, scope) || !_.isEqual(swtichDefault, oldSwitch)) {
      const page = this.getpagination(data.historyCardRecordVo);
      this.setState({
        ...page,
        scopeSelectValue: scope,
        scope,
        orderType: 'desc',
      });
    }
  }

  @autobind
  getpagination(record) {
    let totalPage = 1;
    let rankPage = 1;
    if (!_.isEmpty(record)) {
      rankPage = Number.parseInt(record.current_page, 10);
      totalPage = Math.ceil(Number.parseInt(record.total_num, 10) / 10);
    }
    return {
      totalPage,
      rankPage,
    };
  }

  @autobind
  getPopupContainer() {
    return document.querySelector('.react-app');
  }

  @autobind
  showChartUnit(unit) {
    this.setState({ unit });
  }

  @autobind
  changeRankPage(rankPage) {
    this.setState({ rankPage });
    this.updateRankData({
      pageNum: rankPage,
    });
  }

  @autobind
  updateRankData(query) {
    const { scopeSelectValue, orderType, rankPage } = this.state;
    this.props.changeRankBar({
      scope: scopeSelectValue,
      orderType,
      pageNum: rankPage,
      ...query,
    });
  }

  // 切换维度
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '切换维度',
      value: '$args[0]',
    },
  })
  handleScopeChange(v) {
    // 如果切换维度，则需要页面设置为初始值
    this.setState({
      rankPage: 1,
      scopeSelectValue: v,
    });
    this.updateRankData({
      scope: v,
      pageNum: 1,
    });
  }

  // 切换排序
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '切换排序',
      value: '$args[0]',
    },
  })
  handleOrderTypeChange(v) {
    // 如果切换维度，则需要将页面设置为初始值
    this.setState({
      rankPage: 1,
      orderType: v,
    });
    this.updateRankData({
      orderType: v,
      pageNum: 1,
    });
  }

  // 上一页
  @autobind
  @logable({ type: 'Click', payload: { name: '上一页' } })
  handleLastClick() {
    let { rankPage } = this.state;
    if (rankPage > 1) {
      this.changeRankPage(--rankPage);
    }
  }

  // 下一页
  @autobind
  @logable({ type: 'Click', payload: { name: '上一页' } })
  handleNextClick() {
    const { totalPage } = this.state;
    let { rankPage } = this.state;
    if (rankPage < totalPage) {
      this.changeRankPage(++rankPage);
    }
  }

  render() {
    const {
      custRange,
      level,
      boardType,
      updateQueryState,
      data: { historyCardRecordVo },
      orgId,
      summaryType,
    } = this.props;
    const { orderType, scopeSelectValue, rankPage, totalPage } = this.state;
    let { unit } = this.state;
    if (_.isEmpty(historyCardRecordVo)) {
      unit = '--';
    }
    // 隐藏选项
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
    // 是否隐藏翻页按钮
    const togglePageFlip = classnames({
      [styles.pageFlip]: true,
      hideEle: totalPage < 2,
    });
    // 上一页按钮显示状态
    const toggleLastPage = classnames({
      [styles.pageBtn]: true,
      [styles.marginRight]: true,
      hideEle: false,
      [styles.pageBtnDis]: rankPage === 1,
    });
    // 分割线显示状态
    const toggleDivider = classnames({
      hideEle: false,
    });
    // 下一页按钮显示状态
    const toggleNextPage = classnames({
      [styles.pageBtn]: true,
      [styles.marginLeft]: true,
      hideEle: false,
      [styles.pageBtnDis]: rankPage === totalPage,
    });

    // 无数据情况下的chartBd样式
    const chartBdClass = classnames({
      [styles.chartBd]: true,
      [styles.fixPadRight]: _.isEmpty(historyCardRecordVo),
    });

    let sortByTypeArr = sortByType[boardType];
    if (summaryType === hbgxSummaryType) {
      sortByTypeArr = sortByType.REPORT_RELATION_TYPE;
    }

    return (
      <div className={styles.historyRange}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>成员排名</span>
            <span className={styles.chartUnit}>{`(${unit})`}</span>
          </div>
          <div className={styles.headerRight}>
            <Select
              value={scopeSelectValue}
              className={styles.newSelect}
              onChange={this.handleScopeChange}
              getPopupContainer={this.getPopupContainer}
              dropdownClassName={styles.rankSelectDropdown}
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
              className={styles.newSelect1}
              onChange={this.handleOrderTypeChange}
              getPopupContainer={this.getPopupContainer}
              dropdownClassName={styles.rankSelectDropdown}
            >
              {sortByOrderSelect}
            </Select>
            <div className={togglePageFlip}>
              <span className={toggleLastPage} onClick={this.handleLastClick}><Icon title="上一页" type="xiangzuo" /></span>
              <span className={toggleDivider}>|</span>
              <span className={toggleNextPage} onClick={this.handleNextClick}><Icon title="下一页" type="xiangyou" /></span>
            </div>
          </div>
        </div>
        <div className={chartBdClass}>
          {
            _.isEmpty(historyCardRecordVo)
              ?
              (
                <div className={styles.nochart}>
                  <img src={imgStr} alt="无对应数据" />
                </div>
              )
              :
              (
                <HistoryRankChart
                  data={historyCardRecordVo.data}
                  level={level}
                  scope={scopeSelectValue}
                  showChartUnit={this.showChartUnit}
                  custRange={custRange}
                  updateQueryState={updateQueryState}
                />
              )
          }
        </div>
      </div>
    );
  }
}
