/**
 * @fileOverview pageCommon/DurationSelect.js
 * @author sunweibin
 * @description 时间段选择器
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { time } from '../../helper';
import { optionsMap } from '../../config';
import Icon from '../common/Icon';
import styles from './DurationSelect.less';
import logable from '../../decorators/logable';

moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 时间筛选条件
const timeOptions = optionsMap.time;
const historyTime = optionsMap.historyTime;
const compareArray = optionsMap.compare;
// 时间格式化样式
const formatTxt = 'YYYYMMDD';

// 渲染5个头部期间Radio
const timeRadios = timeOptions.map((item, index) => {
  const timeIndex = `Timeradio${index}`;
  return React.createElement(RadioButton, { key: timeIndex, value: `${item.key}` }, `${item.name}`);
});
const historyTimeRadios = (
  historyTime.map((item, index) => {
    const timeIndex = `Timeradio${index}`;
    return <RadioButton key={timeIndex} value={item.key}>{item.name}</RadioButton>;
  })
);

export default class DurationSelect extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    initialData: PropTypes.object.isRequired,
    custRange: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { pathname } } = props;
    // 判断是否在 history 路由里
    const isHistory = pathname === '/history';
    const value = 'month';
    const { initialData } = this.props;
    const maxDataDt = initialData.maxDataDt;
    const obj = time.getDurationString(value, maxDataDt);
    const beginMoment = moment(obj.begin);
    const endMoment = moment(obj.end);
    this.state = {
      open: false,
      cycleType: value,
      beginMoment,
      endMoment,
      selfDatePickerOpen: false,
      compare: compareArray[0].key,
      isHistory,
      ...obj,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 因为Url中只有boardId会变化
    const { location: { pathname }, custRange } = nextProps;
    const { location: { pathname: prePathname }, custRange: preCustRange } = this.props;
    if (!_.isEqual(pathname, prePathname)) {
      const isHistory = pathname === '/history';
      this.setState({
        isHistory,
      });
    }
    // 切换汇总方式的时候，需要把时间恢复到初始值
    if (!_.isEqual(custRange, preCustRange)) {
      const { initialData } = this.props;
      const maxDataDt = initialData.maxDataDt;
      const value = 'month';
      const duration = time.getDurationString(value, maxDataDt);
      this.state = { ...duration };
    }
  }
  // 期间变化
  @autobind
  @logable({ type: 'Click', payload: { name: '期间变化' } })
  handleDurationChange(e) {
    const value = e.target.value;
    const { initialData } = this.props;
    const maxDataDt = initialData.maxDataDt;
    const duration = time.getDurationString(value, maxDataDt);
    const { updateQueryState, collectData } = this.props;
    collectData({
      text: duration.cycleType,
    });
    this.setState({
      open: false,
      ...duration,
    });
    // 需要改变query中的查询变量
    // 修改查询使用参数
    updateQueryState({
      begin: duration.begin,
      end: duration.end,
      cycleType: duration.cycleType,
    });
  }
  // 根据同环比来计算不同日期
  @autobind
  calcDateByCompare(compare, begin, end) {
    // 开始与结束日期相距的天数
    const distanceDays = moment(end).diff(moment(begin), 'days') + 1;
    // 结束日期的月份
    const endMonth = moment(end).month() + 1;
    // 当前日期的月份
    const nowMonth = moment(new Date()).month() + 1;
    let newBegin;
    let newEnd;

    let obj = {};

    // 如果大于 90 天
    if (distanceDays > 90) {
      newBegin = moment(begin).startOf('month').format(formatTxt);
      // 如果包含当前月
      if (endMonth === nowMonth) {
        // 取上个月结束日期，因为取月份时候 + 1，所以取上个月的时候 - 2
        newEnd = moment(end).set('month', endMonth - 2).endOf('month').format(formatTxt);
      } else {
        // 否则取选择的结束日期所在月的结束日期
        newEnd = moment(end).endOf('month').format(formatTxt);
      }
      // 开始与结束日期相隔的月份
      const distanceMonths = moment(newEnd).diff(moment(newBegin), 'months') + 1;
      // 如果 对比方式是 环比
      obj = compare === 'MoM'
      ?
        ({
          lastBegin: moment(newBegin).subtract(distanceMonths, 'months').format(formatTxt),
          lastEnd: moment(newEnd).subtract(distanceMonths, 'months').endOf('month').format(formatTxt),
        })
      :
        ({
          lastBegin: moment(newBegin).subtract(1, 'year').format(formatTxt),
          lastEnd: moment(newEnd).subtract(1, 'year').format(formatTxt),
        });
    } else {
      newBegin = moment(begin).format(formatTxt);
      newEnd = moment(end).format(formatTxt);
      // 如果对比方式是 环比
      obj = compare === 'MoM'
      ?
        ({
          lastBegin: moment(newBegin).subtract(distanceDays, 'days').format(formatTxt),
          lastEnd: moment(newEnd).subtract(distanceDays, 'days').format(formatTxt),
        })
      :
        ({
          lastBegin: moment(newBegin).subtract(1, 'year').format(formatTxt),
          lastEnd: moment(newEnd).subtract(1, 'year').format(formatTxt),
        });
    }

    obj.newBegin = newBegin;
    obj.newEnd = newEnd;
    return obj;
  }
  // 环比同比切换事件
  @autobind
  @logable({ type: 'Click', payload: { name: '环比同比切换事件' } })
  compareChangeHandle(e) {
    const compare = e.target.value;
    const { beginMoment, endMoment } = this.state;
    const begin = beginMoment.format(formatTxt);
    const end = endMoment.format(formatTxt);

    const lastObj = this.calcDateByCompare(compare, begin, end);
    this.setState({
      compare,
      selfDatePickerOpen: false,
      ...lastObj,
    }, this.saveDurationToHome);
  }
  // 隐藏时间段选择
  @autobind
  hideDurationPicker() {
    this.setState({
      open: false,
    });
    document.removeEventListener('click', this.hideDurationPicker);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$state.durationStr' } })
  handleDurationClick() {
    // 需要给document一个click事件
    document.addEventListener('click', this.hideDurationPicker, false);
    this.setState({
      open: true,
    });
  }

  @autobind
  durationSelectRef(input) {
    this.durationSelect = input;
  }

  // 给 DatePicker 添加 wrapper
  @autobind
  findContainer() {
    return this.durationSelect;
  }
  @autobind
  disabledDate(current) {
    const { initialData } = this.props;
    const maxDataDt = initialData.maxDataDt;
    // 不能选择大于后端返回有数据的最大日期
    return current && current.valueOf() > moment(maxDataDt, formatTxt).valueOf();
  }
  // 用户自己选的时间段事件
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '用户自己选的时间段事件',
      value: '$args[1]',
    },
  })
  rangePickerChange(dates, dateStrings) {
    const { compare } = this.state;
    const beginMoment = dates[0];
    const endMoment = dates[1];
    const durationStr = `${beginMoment.format('YYYY/MM/DD')}-${endMoment.format('YYYY/MM/DD')}`;
    const begin = dateStrings[0];
    const end = dateStrings[1];

    const lastObj = this.calcDateByCompare(compare, begin, end);
    this.setState({
      cycleType: null,
      durationStr,
      open: false,
      selfDatePickerOpen: false,
      beginMoment,
      endMoment,
      ...lastObj,
    }, this.saveDurationToHome);
  }
  @autobind
  openChange(status) {
    this.setState({
      selfDatePickerOpen: status,
    });
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '自定义' } })
  showSelfDatePicker() {
    this.setState({
      selfDatePickerOpen: true,
    });
  }

  // 历史看板预定义时间范围切换事件
  @autobind
  @logable({ type: 'Click', payload: { name: '历史看板预定义时间范围切换事件' } })
  historyChangeDuration(e) {
    const { compare } = this.state;
    const { initialData } = this.props;
    const maxDataDt = initialData.maxDataDt;
    const cycleType = e.target.value;
    const nowDuration = time.getDurationString(cycleType, maxDataDt);
    const beginMoment = moment(nowDuration.begin);
    const endMoment = moment(nowDuration.end);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    const durationStr = nowDuration.durationStr;


    const lastObj = this.calcDateByCompare(compare, begin, end);

    this.setState({
      cycleType,
      open: false,
      selfDatePickerOpen: false,
      durationStr,
      beginMoment,
      endMoment,
      ...lastObj,
    }, this.saveDurationToHome);
  }

  @autobind
  saveDurationToHome() {
    const { updateQueryState } = this.props;
    const {
      cycleType,
      lastBegin,
      lastEnd,
      newBegin,
      newEnd,
    } = this.state;
    let newDuration;
    if (cycleType) {
      newDuration = cycleType;
    } else {
      newDuration = 'month';
    }
    updateQueryState({
      begin: newBegin,
      end: newEnd,
      cycleType: newDuration,
      contrastBegin: lastBegin, // 上期开始时间
      contrastEnd: lastEnd, // 上期结束时间
    });
  }


  render() {
    const {
      isHistory,
      cycleType,
      durationStr,
      open,
      beginMoment,
      endMoment,
      selfDatePickerOpen,
    } = this.state;

    const timeArray = isHistory ? historyTime : timeOptions;
    const durationTip = cycleType && _.filter(timeArray, { key: cycleType })[0].name;
    const toggleDurationPicker = classnames({
      durationPicker: true,
      hasHistoryPicker: isHistory,
      hide: !open,
    });
    return (
      <div className="durationSelect" ref={this.durationSelectRef}>
        <div className="duration">
          <Icon type="rili" />
          <div className="text" onClick={this.handleDurationClick}>
            {durationStr}
            <span>
              {durationTip}
            </span>
          </div>
          {/* 同环比按钮 */}
          {
            isHistory ?
              <div className={styles.compareDiv}>
                <RadioGroup onChange={this.compareChangeHandle} value={this.state.compare}>
                  {
                    compareArray.map((item) => {
                      const compareKey = `compare${item.key}`;
                      return (
                        <Radio
                          key={compareKey}
                          value={item.key}
                        >
                          {item.name}
                        </Radio>
                      );
                    })
                  }
                </RadioGroup>
              </div>
            :
              null
          }
        </div>
        {/* 选择时间段 */}
        <div className={toggleDurationPicker}>
          <div className="pickerHead">{durationStr}</div>
          <div className="divider" />
          <div className="pickerFoot">
            <div className={styles.pickerFootRadio}>
              {
                isHistory ?
                  <RadioGroup
                    value={cycleType}
                    onChange={this.historyChangeDuration}
                  >
                    {historyTimeRadios}
                  </RadioGroup>
                :
                  <RadioGroup
                    value={cycleType}
                    onChange={this.handleDurationChange}
                  >
                    {timeRadios}
                  </RadioGroup>
              }
            </div>
            <div className={styles.pickerFootCustom}>
              <a onClick={this.showSelfDatePicker}>自定义</a>
            </div>
          </div>
        </div>
        <RangePicker
          allowClear={false}
          disabledDate={this.disabledDate}
          value={[beginMoment, endMoment]}
          format="YYYY/MM/DD"
          onChange={this.rangePickerChange}
          open={selfDatePickerOpen}
          onOpenChange={this.openChange}
          getCalendarContainer={this.findContainer}
        />
      </div>
    );
  }
}
