/**
 * @fileOverview components/invest/ChartBoard.js
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import _ from 'lodash';

import ChartBar from './ChartBar';
import styles from './ChartBoard.less';

const barColors = ['#3983ff', '#ffb24e', '#756fb8', '#ff784e'];

export default class ChartBoard extends PureComponent {

  static propTypes = {
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    location: PropTypes.object,
    style: PropTypes.object,
    chartData: PropTypes.array,
    custRange: PropTypes.array.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    // loading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    location: {},
    style: {},
    chartData: [],
    // loading: false,
  }

  render() {
    const { chartData, location, level, style, scope, custRange, updateQueryState } = this.props;
    return (
      <div className={styles.board} style={style}>
        <Row type="flex">
          {
            chartData.map((item, index) => {
              const barColor = barColors[(index % 4)];
              if (!_.isObject(item)) {
                return null;
              }
              const { indiModel } = item;
              if (!indiModel) {
                return null;
              }
              // if (indiModel.key === 'gjzServiceCompPercent') {
              //   // TODO 此处线针对高净值客户服务覆盖率chart做隐藏处理
              //   return null;
              // }
              return (
                <Col
                  span={8}
                  key={indiModel.key}
                  className={styles.colWrapper}
                >
                  <ChartBar
                    chartData={item}
                    location={location}
                    level={location.query.level || level}
                    scope={scope}
                    custRange={custRange}
                    updateQueryState={updateQueryState}
                    barColor={barColor}
                  />
                </Col>
              );
            })
          }
        </Row>
      </div>
    );
  }
}
