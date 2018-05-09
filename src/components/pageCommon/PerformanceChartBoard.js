/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ChartBoard from './ChartBoard';
import ChartTable from './ChartTable';
import BoardHeader from './BoardHeader';

export default class PerformanceChartBoard extends PureComponent {

  static propTypes = {
    boardType: PropTypes.string.isRequired,
    chartData: PropTypes.array,
    chartTableInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
    showChart: PropTypes.string.isRequired,
    level: PropTypes.string,
    scope: PropTypes.number.isRequired,
    categoryScope: PropTypes.number.isRequired,
    categoryOrder: PropTypes.string.isRequired,
    getTableInfo: PropTypes.func,
    boardTitle: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    collectScopeSelect: PropTypes.func.isRequired,
    collectOrderTypeSelect: PropTypes.func.isRequired,
    updateShowCharts: PropTypes.func.isRequired,
    updateCategoryScope: PropTypes.func.isRequired,
    updateCategoryOrder: PropTypes.func.isRequired,
    showScopeOrder: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    indexID: PropTypes.string,
    selfRequestData: PropTypes.func,
    custRange: PropTypes.array.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    orgId: PropTypes.string,
    summaryType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    boardType: 'TYPE_TGJX',
    indexID: '',
    orgId: '',
    location: {},
    chartData: [],
    chartTableInfo: {},
    level: '',
    getTableInfo: () => {},
    repalce: () => {},
    selfRequestData: () => {},
  }

  render() {
    const {
      showChart,
      chartData,
      chartTableInfo,
      replace,
      location,
      level,
      scope,
      postExcelInfo,
      boardTitle,
      showScopeOrder,
      indexID,
      selfRequestData,
      getTableInfo,
      updateShowCharts,
      categoryScope,
      categoryOrder,
      updateCategoryScope,
      updateCategoryOrder,
      custRange,
      updateQueryState,
      collectScopeSelect,
      collectOrderTypeSelect,
      boardType,
      orgId,
      summaryType,
    } = this.props;
    if (!(chartData && chartData.length) && showChart !== 'tables') {
      return null;
    }
    return (
      <div className="investPerformanceBoard">
        <BoardHeader
          boardType={boardType}
          location={location}
          title={boardTitle}
          postExcelInfo={postExcelInfo}
          replace={replace}
          level={level}
          scope={scope}
          categoryScope={categoryScope}
          categoryOrder={categoryOrder}
          showChart={showChart}
          showScopeOrder={showScopeOrder}
          indexID={indexID}
          selfRequestData={selfRequestData}
          getTableInfo={getTableInfo}
          updateShowCharts={updateShowCharts}
          updateCategoryScope={updateCategoryScope}
          updateCategoryOrder={updateCategoryOrder}
          collectScopeSelect={collectScopeSelect}
          collectOrderTypeSelect={collectOrderTypeSelect}
          orgId={orgId}
          summaryType={summaryType}
        />
        {/* 根据 url 里的 showChart 来显示不同的组件 */}
        {
          showChart === 'tables' ?
          (
            <ChartTable
              chartTableInfo={chartTableInfo}
              getTableInfo={getTableInfo}
              replace={replace}
              level={level}
              scope={categoryScope}
              location={location}
              indexID={indexID}
              boardType={boardType}
              summaryType={summaryType}
            />
          )
          :
          (
            <ChartBoard
              chartData={chartData}
              location={location}
              level={level}
              scope={categoryScope}
              custRange={custRange}
              updateQueryState={updateQueryState}
            />
          )
        }
      </div>
    );
  }
}
