/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import ChartBarStack from '../chartRealTime/ChartBarStack';
import ChartBarNormal from '../chartRealTime/ChartBarNormal';
import logable from '../../decorators/logable';

export default class ChartBar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    chartData: PropTypes.object,
    custRange: PropTypes.array.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    barColor: PropTypes.string.isRequired,
  }

  static defaultProps = {
    location: {},
    chartData: {},
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handleUpdateQueryState() {
    this.props.updateQueryState();
  }


  render() {
    const { chartData: { orgModel } } = this.props;
    const { chartData, level, location, scope, custRange, barColor } = this.props;
    // 增加判断走堆叠还是普通柱状图
    if (orgModel
      && Array.isArray(orgModel)
      && orgModel.length > 0
      && Array.isArray(orgModel[0].indiModelList)
      && orgModel[0].indiModelList.length > 0) {
      // 走堆叠柱状图
      return (
        <ChartBarStack
          location={location}
          chartData={chartData}
          level={level}
          scope={scope}
          custRange={custRange}
          updateQueryState={this.handleUpdateQueryState}
        />
      );
    }
    return (
      <ChartBarNormal
        location={location}
        chartData={chartData}
        level={level}
        scope={scope}
        custRange={custRange}
        updateQueryState={this.handleUpdateQueryState}
        barColor={barColor}
      />
    );
  }
}
