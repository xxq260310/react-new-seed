/**
 * @fileOverview chartRealTime/ChartRadar.js
 * @author yangquanjian
 * @description 雷达图
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import {
  radarCommon,
  seriesCommon,
  currentRadar,
  contrastRadar,
  currentLabel,
  contrastLabel,
} from './chartRadarOptions';
import IECharts from '../IECharts';
import { optionsMap, constants } from '../../config';
import styles from './chartRadar.less';

// 汇报关系的汇总方式
const hbgxSummaryType = constants.hbgxSummaryType;
// levelName
const orgClass = optionsMap.charRadarOrgClass;

export default class ChartRadar extends PureComponent {

  static propTypes = {
    radarData: PropTypes.array.isRequired,
    total: PropTypes.string.isRequired,
    localScope: PropTypes.string.isRequired,
    selectCore: PropTypes.number.isRequired,
    summaryType: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { localScope, summaryType } = props;
    let orgClassObj = orgClass.custRangeOrgClass;
    if (summaryType === hbgxSummaryType) {
      orgClassObj = orgClass.reportOrgClass;
    }
    this.state = {
      levelName: orgClassObj[`level${localScope}`],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { localScope: preLevel, radarData: preRadar, summaryType: preSummaryType } = this.props;
    const { localScope, radarData, summaryType } = nextProps;
    let orgClassObj = orgClass.custRangeOrgClass;
    if (summaryType === hbgxSummaryType) {
      orgClassObj = orgClass.reportOrgClass;
    }
    if (preLevel !== localScope || preSummaryType !== summaryType) {
      this.setState({
        levelName: orgClassObj[`level${localScope}`],
      });
    }
    if (!_.isEqual(radarData, preRadar)) {
      this.state.radar.clear();
      // TODO 当数据变化的时候，需要修改options
    }
  }

  componentWillUnmount() {
    const { radar } = this.state;
    if (radar && radar.clear) {
      radar.clear();
    }
  }

  @autobind
  optimizeIndicator(current, previous) {
    let max = 0;
    let min = 0;
    const currMax = Math.max(...current);
    const currMin = Math.min(...current);
    const prevMax = Math.max(...previous);
    const prevMin = Math.min(...previous);
    max = currMax > prevMax ? currMax : prevMax;
    min = currMin < prevMin ? currMin : prevMin;
    max += 10;
    if (min !== 1) {
      min -= 3;
    }
    return {
      max,
      min,
    };
  }

  @autobind
  makeRadarIndicators(current, contrast, scopeNum, indicatorName) {
    const indicators = [];
    const indicator = this.optimizeIndicator(current, contrast);
    const indicatorMax = indicator.max;
    const indicatorMin = indicator.min;
    let min = Number(scopeNum) - indicatorMax;
    let max = Number(scopeNum) - indicatorMin;
    if (_.isEmpty(current) && _.isEmpty(contrast)) {
      max = 10;
      min = 1;
    }
    _.each(indicatorName, (item) => {
      indicators.push({
        name: item,
        min,
        max,
      });
    });
    return indicators;
  }

  @autobind
  filterRadarData(radarData, scopeNum) {
    let originalCurrent = [];
    let originalContrast = [];
    let radarCurrent = [];
    let radarContrast = [];
    const indicatorName = [];
    _.each(radarData, (item) => {
      const {
        rank_current: currentV,
        rank_contrast: contrastV,
        indicator_name: name,
      } = item;

      indicatorName.push(name);
      if (scopeNum !== null && scopeNum !== 'null') {
         // 判断有无值
        if (currentV !== null && currentV !== 'null') {
          originalCurrent.push(Number(currentV));
          radarCurrent.push(Number(scopeNum) - Number(currentV));
        } else {
          // 无值时候，确保为空数组
          originalCurrent = [];
          radarCurrent = [];
        }
        if (contrastV !== null && contrastV !== 'null') {
          originalContrast.push(Number(contrastV));
          radarContrast.push(Number(scopeNum) - Number(contrastV));
        } else {
          // 无值时候，确保为空数组
          originalContrast = [];
          radarContrast = [];
        }
      }
    });
    return {
      original: {
        current: originalCurrent,
        contrast: originalContrast,
      },
      radar: {
        current: radarCurrent,
        contrast: radarContrast,
      },
      indicatorName,
    };
  }

  @autobind
  makeRadarSeriesData(radar, scopeNum) {
    const result = [];
    const legends = [];
    const { current, contrast } = radar;
    if (!_.isEmpty(current)) {
      const currentData = {
        ...currentRadar,
        value: current,
        label: {
          normal: {
            ...currentLabel,
            formatter: p => (scopeNum - p.value),
          },
        },
      };
      result.push(currentData);
      legends.push({ name: '本期', icon: 'square' });
    }
    if (!_.isEmpty(contrast)) {
      const contrastData = {
        ...contrastRadar,
        value: contrast,
        label: {
          normal: {
            ...contrastLabel,
            formatter: p => (scopeNum - p.value),
          },
        },
      };
      result.push(contrastData);
      legends.push({ name: '上期', icon: 'square' });
    }
    return {
      series: result,
      legend: legends,
    };
  }

  @autobind
  radarOnReady(instance) {
    this.setState({
      radar: instance,
    });
  }

  render() {
    const { radarData, total, selectCore, localScope } = this.props;
    if (localScope === '1' || _.isEmpty(radarData)) {
      return null;
    }
    const { levelName } = this.state;
    const {
      original: { current, contrast },
      radar,
      indicatorName,
    } = this.filterRadarData(radarData, total);
    const indicator = this.makeRadarIndicators(current, contrast, total, indicatorName);
    const allData = this.makeRadarSeriesData(radar, Number(total));
    const options = {
      // legend: {
      //   ...legend,
      //   data: allData.legend,
      // },
      radar: {
        ...radarCommon,
        indicator,
      },
      series: [
        {
          ...seriesCommon,
          data: allData.series,
        },
      ],
    };
    return (
      <div className={styles.radarBox}>
        <div className={styles.titleDv}>多维排名对比</div>
        <div className={styles.radar}>
          <IECharts
            option={options}
            resizable
            onReady={this.radarOnReady}
            style={{
              height: '330px',
            }}
          />
        </div>
        <div className={styles.radarInfo}>
          <div className={styles.radarDesc}>
            <span className={styles.name}>{indicatorName[selectCore]}排名</span>
            <span className={styles.totalDesc}>(共 </span>
            <span className={styles.totalNo}>{total === '0' ? '--' : total}</span>
            <span className={styles.totalDesc}> 家{levelName})</span>
            <span className={styles.radarNowDura}>本期:</span>
            <span className={styles.now}>
              {_.isEmpty(current) ? '--' : current[selectCore]}
            </span>
            <span className={styles.radarLastDura}>上期:</span>
            <span className={styles.before}>
              {_.isEmpty(contrast) ? '--' : contrast[selectCore]}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
