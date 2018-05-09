/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Alert, Select } from 'antd';
import moment from 'moment';

import CustRange from './CustRange2';
import BoardSelect from './BoardSelect';
import { fspContainer, optionsMap, constants } from '../../config';
import DurationSelect from './DurationSelect';
import { dom } from '../../helper';
import logable from '../../decorators/logable';
// 选择项字典
import styles from './PageHeader.less';

const Option = Select.Option;
const fsp = document.querySelector(fspContainer.container);
const showBtn = document.querySelector(fspContainer.showBtn);
const hideBtn = document.querySelector(fspContainer.hideBtn);
const contentWrapper = document.getElementById('workspace-content');
const marginWidth = fspContainer.marginWidth;
const marginLeftWidth = fspContainer.marginLeftWidth;
const summaryTypeSelect = optionsMap.summaryTypeSelect;
// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;
const jxstSummaryType = constants.jxstSummaryType;
const jingZongLevel = constants.jingZongLevel;
// 时间格式化样式
const formatTxt = 'YYYYMMDD';

export default class PageHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    collectBoardSelect: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    collectDurationSelect: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    visibleBoards: PropTypes.array,
    newVisibleBoards: PropTypes.array,
    preView: PropTypes.bool,
    reportName: PropTypes.string,
    orgId: PropTypes.string,
    initialData: PropTypes.object.isRequired,
    updateOrgTreeValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custRange: [],
    visibleBoards: [],
    newVisibleBoards: [],
    preView: false,
    reportName: '',
    orgId: '',
  }
  constructor(props) {
    super(props);
    let contentWidth;
    let scrollX;
    let leftWidth;
    const { custRange } = props;
    if (fsp) {
      contentWidth = dom.getCssStyle(contentWrapper, 'width');
      scrollX = window.scrollX;
      leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    }
    this.state = {
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
      top: fsp ? '55px' : 0,
      left: fsp ? `${leftWidth - scrollX}px` : 0,
      summaryTypeValue: custRange[0].level !== jingZongLevel ? hbgxSummaryType : jxstSummaryType,
    };
  }

  componentDidMount() {
    this.didMountAddEventListener();
  }
  componentWillUnmount() {
    if (fsp) {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onWindowResize);
      showBtn.removeEventListener('click', this.toggleLeft);
      hideBtn.removeEventListener('click', this.toggleLeft);
    }
  }
  // resize 事件
  @autobind
  onWindowResize() {
    const contentWidth = dom.getCssStyle(contentWrapper, 'width');
    this.setState({
      width: fsp ? `${parseInt(contentWidth, 10) - marginWidth}px` : '100%',
    });
  }
  // 监听页面滚动事件，设置头部的 left 值
  @autobind
  onScroll() {
    const scrollX = window.scrollX;
    const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.setState({
      left: leftWidth - scrollX,
    });
  }
  // didmount 时添加监听事件
  @autobind
  didMountAddEventListener() {
    // 如果在 FSP 里，则添加监听事件
    if (fsp) {
      this.onWindowResize();
      this.addEventListenerClick();
      window.addEventListener('scroll', this.onScroll, false);
      window.addEventListener('resize', this.onWindowResize, false);
      const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
      this.setState({
        left: leftWidth,
      });
    }
  }
  // 监听 FSP 侧边栏显示隐藏按钮点击事件
  @autobind
  addEventListenerClick() {
    showBtn.addEventListener('click', this.toggleLeft, false);
    hideBtn.addEventListener('click', this.toggleLeft, false);
  }
  // 检测到 FSP 侧边栏显示隐藏按钮点击事件后，根据项目的容器改变 left 值
  @autobind
  toggleLeft() {
    const leftWidth = parseInt(dom.getCssStyle(contentWrapper, 'left'), 10) + marginLeftWidth;
    this.onWindowResize();
    this.setState({
      left: leftWidth,
    });
  }

  // 汇总方式切换,按绩效视图汇总，按组织机构汇总
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '汇总方式切换',
      value: '$args[0]',
    },
  })
  handleSummaryTypeChange(v) {
    this.setState({ summaryTypeValue: v });
    this.props.updateOrgTreeValue(v);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '营业地址选择项：',
      value: '$args[0].orgId',
    },
  })
  handleCustRange(obj) {
    this.props.updateQueryState(obj);
  }

  render() {
    const {
      preView,
      reportName,
      replace,
      push,
      custRange,
      location,
      visibleBoards,
      newVisibleBoards,
      updateQueryState,
      orgId,
      collectBoardSelect,
      collectCustRange,
      collectDurationSelect,
      initialData,
      location: { pathname },
    } = this.props;
    const { top, left, width, summaryTypeValue } = this.state;
    const maxDataDt = initialData.maxDataDt;
    const maxDataDtTip = moment(maxDataDt).format('YYYY/MM/DD');
    // 汇总方式的切换是否显示
    const summaryTypeIsShow = initialData.summaryTypeIsShow;
    // 当前日期减1天,并转化为YYYYMMDD格式日期
    const momentDataDt = moment(moment().subtract(1, 'days')).format(formatTxt);
    // 判断是否在 history 路由里
    const isHistory = pathname === '/history';
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            zIndex: 30,
            width,
            top,
            left,
          }}
        >
          <div className="reportHeader">
            <Row type="flex" justify="start" align="middle">
              <div className="reportName">
                {/* 需要针对预览页面做调整 */}
                {
                  preView
                  ?
                  (
                    <div className="preView">
                      {reportName}
                    </div>
                  )
                  :
                  (
                    <BoardSelect
                      location={location}
                      push={push}
                      replace={replace}
                      visibleBoards={visibleBoards}
                      newVisibleBoards={newVisibleBoards}
                      collectData={collectBoardSelect}
                    />
                  )
                }
              </div>
              <div className={styles.reportHeaderRight}>
                <DurationSelect
                  location={location}
                  replace={replace}
                  updateQueryState={updateQueryState}
                  collectData={collectDurationSelect}
                  initialData={initialData}
                  custRange={custRange}
                />
                <div className={styles.vSplit} />
                {/* 营业地址选择项 */}
                <CustRange
                  custRange={custRange}
                  location={location}
                  replace={replace}
                  updateQueryState={this.handleCustRange}
                  orgId={orgId}
                  collectData={collectCustRange}
                />
                {/* 汇总方式切换 */}
                {
                  summaryTypeIsShow ?
                    <div className={styles.SummaryTypeSelect}>
                      <div className={styles.vSplit} />
                      <Select
                        style={{ width: 150 }}
                        value={summaryTypeValue}
                        onChange={this.handleSummaryTypeChange}
                      >
                        {
                          summaryTypeSelect.map((item, index) => {
                            const summaryTypeIndex = `summaryType-${index}`;
                            return (
                              <Option
                                key={summaryTypeIndex}
                                value={item.value}
                              >
                                  按{item.name}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    </div>
                  :
                  null
                }
              </div>
            </Row>
            {
              moment(maxDataDt).isBefore(momentDataDt) && !isHistory ?
                <Alert
                  message="提示"
                  description={`因当前数据后台未核算完成，目前展现的是截止到${maxDataDtTip}的数据`}
                  type="warning"
                  closable
                  showIcon
                /> :
              null
            }
          </div>
        </div>
        <div style={{ height: '40px' }} />
      </div>
    );
  }
}
