/**
 * by xuxiaoqin
 * ScatterAnalysis.js
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import AbilityScatterAnalysis from './AbilityScatterAnalysis';
import { scatterType } from '../../config';
import styles from './scatterAnalysis.less';

const custScatter = scatterType[0];
const investScatter = scatterType[1];
const EMPTY_LIST = [];
export default class ScatterAnalysis extends PureComponent {
  static propTypes = {
    contributionAnalysisData: PropTypes.object.isRequired,
    reviewAnalysisData: PropTypes.object.isRequired,
    queryContrastAnalyze: PropTypes.func.isRequired,
    cust: PropTypes.array,
    invest: PropTypes.array,
    switchDefault: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    isLvIndicator: PropTypes.bool.isRequired,
    currentSelectIndicatorKey: PropTypes.string.isRequired,
    isCommissionRate: PropTypes.bool.isRequired,
    orgId: PropTypes.string,
    summaryType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    cust: EMPTY_LIST,
    invest: EMPTY_LIST,
    orgId: '',
  };

  render() {
    const {
      queryContrastAnalyze,
      contributionAnalysisData,
      reviewAnalysisData,
      cust,
      invest,
      switchDefault,
      location: { query: { boardType } },
      level,
      scope,
      isLvIndicator,
      currentSelectIndicatorKey,
      isCommissionRate,
      orgId,
      summaryType,
    } = this.props;

    return (
      <div className={styles.scatterSection}>
        <Row type="flex" gutter={10}>
          <Col span={12} className={styles.leftScatterSection}>
            <AbilityScatterAnalysis
              data={contributionAnalysisData}
              queryContrastAnalyze={queryContrastAnalyze}
              title={custScatter.title}
              contrastType={'客户类型'}
              optionsData={cust}
              description={'客户贡献'}
              type={custScatter.type}
              isLvIndicator={isLvIndicator}
              switchDefault={switchDefault}
              level={level}
              scope={scope}
              boardType={boardType}
              currentSelectIndicatorKey={currentSelectIndicatorKey}
              isCommissionRate={isCommissionRate}
              style={{
                left: '-65px',
              }}
              orgId={orgId}
              summaryType={summaryType}
            />
          </Col>
          {
            // 投顾历史看板下的营业部不展示投顾维度散点图
            level === '4'
              ? <div
                style={{
                  height: '400px',
                }}
              /> :
              <Col span={12} className={styles.rightScatterSection}>
                <AbilityScatterAnalysis
                  data={reviewAnalysisData}
                  queryContrastAnalyze={queryContrastAnalyze}
                  title={boardType === 'TYPE_LSDB_TGJX' ? '投顾贡献对比' : '服务经理贡献对比'}
                  contrastType={'投顾类型'}
                  optionsData={invest}
                  description={boardType === 'TYPE_LSDB_TGJX' ? '入岗投顾贡献' : '服务经理贡献'}
                  type={investScatter.type}
                  switchDefault={switchDefault}
                  isLvIndicator={isLvIndicator}
                  boardType={boardType}
                  level={level}
                  scope={scope}
                  currentSelectIndicatorKey={currentSelectIndicatorKey}
                  isCommissionRate={isCommissionRate}
                  style={{
                    left: '-65px',
                  }}
                  orgId={orgId}
                  summaryType={summaryType}
                />
              </Col>
          }
        </Row>
      </div>
    );
  }
}
