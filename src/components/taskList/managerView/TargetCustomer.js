/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-13 10:41:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-25 14:14:29
 * 管理者视图右侧目标客户
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import LabelInfo from '../common/LabelInfo';
import TipsInfo from '../performerView/TipsInfo';
import styles from './targetCustomer.less';
import logable from '../../../decorators/logable';

export default class TargetCustomer extends PureComponent {

  static propTypes = {
    // 父容器宽度变化,默认宽度窄
    isFold: PropTypes.bool,
    // 客户来源
    custSource: PropTypes.string,
    // 客户总数
    custTotal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    // 客户来源说明
    custSourceDescription: PropTypes.string,
    // 预览客户明细
    onPreview: PropTypes.func,
    // 当前机构名
    orgName: PropTypes.string,
  }

  static defaultProps = {
    isFold: false,
    custSource: '',
    custTotal: '',
    custSourceDescription: '',
    onPreview: () => { },
    orgName: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      overlayTop: 0,
    };
  }

  /**
   * 浮层渲染到父节点
   */
  @autobind
  getPopupContainer() {
    return this.custTotalTipElem;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '客户总数' } })
  handlePreview() {
    const { onPreview } = this.props;
    onPreview({
      canLaunchTask: false,
    });
  }

  @autobind
  handleMouseOver() {
    if (this.custTotalTipElem) {
      this.setState({
        overlayTop: this.custTotalTipElem.getBoundingClientRect().top,
      });
    }
  }

  render() {
    const {
      isFold,
      custSource,
      custSourceDescription,
      custTotal,
      orgName,
    } = this.props;
    const { overlayTop } = this.state;
    const posi = 'rightBottom';
    const colSpanValue = isFold ? 12 : 24;

    return (
      <div className={styles.targetCustomerSection}>
        <LabelInfo value="目标客户" />
        <div className={styles.targetCustomerContent}>
          <div>
            <Row className={styles.rowItem}>
              <Col span={colSpanValue} className={styles.colItem}>
                <span
                  className={classnames({
                    [styles.label]: true,
                  })}
                >客户总数:&nbsp;</span>
                <span
                  className={classnames({
                    [styles.custTotal]: true,
                    [styles.content]: true,
                  })}
                  onClick={this.handlePreview}
                >{Number(custTotal) || 0}</span>
                <span
                  className={styles.custTotalTooltip}
                  onMouseOver={this.handleMouseOver}
                  ref={ref => (this.custTotalTipElem = ref)}
                >
                  <TipsInfo
                    title={`当前${orgName}有效客户总数`}
                    position={posi}
                    wrapperClass={classnames({
                      [styles.custNumberTips]: true,
                    })}
                    overlayStyle={{
                      top: overlayTop,
                    }}
                    getPopupContainer={this.getPopupContainer}
                  />
                </span>
              </Col>
              <Col span={colSpanValue} className={styles.colItem}>
                <span className={styles.label}>客户来源:&nbsp;</span>
                <span className={styles.content}>{custSource || '--'}</span>
              </Col>
            </Row>
            {
              !_.isEmpty(custSourceDescription) ?
                <Row className={styles.rowItem}>
                  <Col className={styles.colItem}>
                    <span className={`${styles.label} ${styles.fl}`}>客户来源说明:&nbsp;</span>
                    <p className={`${styles.content} ${styles.servicePolicy}`}>
                      {custSourceDescription || '--'}
                    </p>
                  </Col>
                </Row> : null
            }
          </div>
        </div>
      </div>
    );
  }
}
