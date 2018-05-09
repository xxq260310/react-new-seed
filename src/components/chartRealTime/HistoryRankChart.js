/**
 * @description 历史对比排名图表,此处用来判断走普通视图，还是堆叠视图
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RankNormalChart from './historyRank/RankNormalChart';
import RankStackChart from './historyRank/RankStackChart';

export default class HistoryRankChart extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    showChartUnit: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  };

  render() {
    const { data: { orgModel } } = this.props;
    const { data, level, scope, showChartUnit, custRange, updateQueryState } = this.props;
     // 增加判断走堆叠还是普通柱状图
    if (orgModel
      && Array.isArray(orgModel)
      && orgModel.length > 0
      && Array.isArray(orgModel[0].indiModelList)
      && orgModel[0].indiModelList.length > 0) {
      // 走堆叠柱状图
      return (
        <RankStackChart
          chartData={data}
          level={level}
          scope={scope}
          showChartUnit={showChartUnit}
          custRange={custRange}
          updateQueryState={updateQueryState}
        />
      );
    }
    return (
      <RankNormalChart
        chartData={data}
        level={level}
        scope={scope}
        showChartUnit={showChartUnit}
        custRange={custRange}
        updateQueryState={updateQueryState}
      />
    );
  }
}
