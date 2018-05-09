/**
 * @file invest/PerformanceItem.js
 * @author LiuJianShu
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../common/Icon';
import Item from './Item';
import styles from './PerformanceItem.less';
import logable from '../../decorators/logable';

const pageSize = 8;
export default class PerformanceItem extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    const { data } = props;
    // 默认第一页
    const page = 1;
    // 取出第一页的数据
    const firstPage = _.slice(data, 0, pageSize);
    // 计算出所有页数
    const pageNum = data.length <= 8 ? 1 : _.ceil(data.length / 8);
    this.state = {
      page,
      pageNum,
      showAllBtn: pageNum > 1,
      showPreBtn: page > 1,
      showNextBtn: page === pageNum,
      performanceData: firstPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props.data;
    const newData = nextProps.data;
    if (!_.isEqual(oldData, newData)) {
      const page = 1;
      const pageNum = newData.length <= 8 ? 1 : _.ceil(newData.length / 8);
      const firstPage = _.slice(newData, 0, pageSize);
      this.setState({
        page,
        pageNum,
        showAllBtn: pageNum > 1,
        showPreBtn: page > 1,
        showNextBtn: page === pageNum,
        performanceData: firstPage,
      });
    }
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '向前' } })
  hanldePreClick(preOrNext) {
    this.clickHandle(preOrNext);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '向后' } })
  handleNextClick(preOrNext) {
    this.clickHandle(preOrNext);
  }

  @autobind
  clickHandle(preOrNext) {
    const { page, pageNum } = this.state;
    const { data } = this.props;
    let newPage;
    if (preOrNext === 'next') {
      newPage = page + 1;
      if (newPage > pageNum) {
        newPage = pageNum;
      }
    } else {
      newPage = page - 1;
      if (newPage < 0) {
        newPage = 0;
      }
    }
    const beginIndex = (newPage - 1) * pageSize;
    const endIndex = newPage * pageSize;
    const newData = _.slice(data, beginIndex, endIndex);
    this.setState({
      page: newPage,
      performanceData: newData,
      showPreBtn: newPage > 1,
      showNextBtn: newPage === pageNum,
    });
  }

  render() {
    const { performanceData, showAllBtn, showPreBtn, showNextBtn } = this.state;
    return (
      <div>
        <div className={styles.titleText}>总量指标</div>
        <div className={styles.items}>
          {
            showAllBtn ?
              <div>
                {
                  showPreBtn ?
                    <a className={styles.preBtn} onClick={() => this.hanldePreClick('pre')}>
                      <Icon type="more" />
                    </a>
                  :
                    null
                }
                {
                  !showNextBtn ?
                    <a className={styles.nextBtn} onClick={() => this.handleNextClick('next')}>
                      <Icon type="more" />
                    </a>
                  :
                    null
                }
              </div>
            :
              null
          }
          <Row>
            {
              performanceData.map(item => (
                <Col span={3} className={styles.itemWrap} key={`${item.key}Key`}>
                  <Item data={item} />
                </Col>
              ))
            }
          </Row>
        </div>
      </div>
    );
  }
}
