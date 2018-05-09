/**
 * @file /history/IndicatorOverview.js
 *  历史指标-指标概览
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import ChartRadar from '../chartRealTime/ChartRadar';
import IndexItem from './IndexItem';
import styles from './indicatorOverview.less';
import { SelectTreeModal } from '../modals';
import logable, { logPV } from '../../decorators/logable';

export default class IndicatorOverview extends PureComponent {
  static propTypes = {
    overviewData: PropTypes.array,
    indexData: PropTypes.object,
    summuryLib: PropTypes.object.isRequired,
    saveIndcatorToHome: PropTypes.func.isRequired,
    changeCore: PropTypes.func.isRequired,
    level: PropTypes.string.isRequired,
    summaryType: PropTypes.string.isRequired,
  }

  static defaultProps = {
    overviewData: [],
    indexData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectTreeModal: false,
      selectIndex: 0, // 默认选中项
      clickItemIndex: 0, // 默认点击的项索引值
    };
  }

  componentWillReceiveProps(nextProps) {
    const { overviewData: preCore } = this.props;
    const { overviewData: nextCore } = nextProps;
    if (!_.isEqual(preCore, nextCore)) {
      this.setState({
        selectIndex: 0,
        clickItemIndex: 0,
      });
    }
  }

  /**
   * 弹窗处理（关闭）
  */
  @autobind
  handleCancel() {
    this.setState({ selectTreeModal: false });
  }
  /**
   * 弹窗处理（开启）
  */
  @autobind
  @logPV({ pathname: '/modal/adjustmentPointer', title: '指标调整' })
  showModal() {
    this.setState({ selectTreeModal: true });
  }

  // 选中Core指标
  @autobind
  @logable({ type: 'Click', payload: { name: '选中Core指标' } })
  handleCoreClick(index, key) {
    return () => {
      const { changeCore } = this.props;
      const { clickItemIndex } = this.state;
      if (index === clickItemIndex) {
        return;
      }
      this.setState({
        clickItemIndex: index,
        selectIndex: index,
      });
      changeCore(key);
    };
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标进入Core指标$args[0]' } })
  mouseEnter(index) {
    return () => {
      this.setState({
        selectIndex: index,
      });
    };
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '鼠标离开Core指标' } })
  mouseLeave() {
    const { clickItemIndex } = this.state;
    this.setState({
      selectIndex: clickItemIndex,
    });
  }

  render() {
    const {
      overviewData,
      indexData,
      summuryLib,
      saveIndcatorToHome,
      level,
      summaryType,
    } = this.props;
    if (_.isEmpty(overviewData)) {
      return null;
    }
    const { selectIndex, selectTreeModal, clickItemIndex } = this.state;
    // 创建共同配置项
    const selectTreeProps = {
      modalKey: 'selectTreeModal',
      modalCaption: '挑选指标（挑选您向要查看的指标名称，最少选择 4 项，最多选择 9 项）',
      closeModal: this.closeModal,
      summuryLib,
      visible: selectTreeModal,
      saveIndcatorToHome,
    };
    const radarHide = _.isEmpty(indexData) || level === '1';
    const overviewBoxSpan = radarHide ? '24' : '12';
    const coreCard = classnames({
      [styles.coreCard]: true,
      [styles.hasRadar]: !radarHide,
      [styles.noRadar]: radarHide,
    });
    const cardBdClass = classnames({
      [styles.height320]: !radarHide,
      [styles.height210]: radarHide,
      [styles.cardBd]: true,
    });
    return (
      <div className={styles.overviewBox}>
        <Row gutter={10} type="flex">
          <Col span={overviewBoxSpan}>
            <div className={styles.viewCard}>
              <div className={styles.cardHd}>
                <div className={styles.cardCaption}>指标概览</div>
                <div onClick={this.showModal} className={styles.pickCore}>指标调整</div>
              </div>
              <div className={cardBdClass}>
                <ul className={styles.coreCardUl}>
                  {
                    overviewData.map((item, index) => {
                      const itemIndex = `select${index}`;
                      const active = clickItemIndex === index;
                      const key = item.key;
                      return (
                        <li
                          className={coreCard}
                          onClick={this.handleCoreClick(index, key)}
                          key={itemIndex}
                          onMouseEnter={this.mouseEnter(index)}
                          onMouseLeave={this.mouseLeave}
                        >
                          <IndexItem
                            itemData={item}
                            active={active}
                          />
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
              <div className={styles.cardFt}>
                <div className={styles.coreInfo}>
                  <p>
                    <span
                      className={styles.coreName}
                    >
                      {overviewData[selectIndex].name}:
                    </span>
                    <span
                      className={styles.coreDesc}
                    >
                      {overviewData[selectIndex].description}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Col>
          {
            radarHide
              ? null
              : (
                <Col span="12">
                  <div className={styles.viewCard}>
                    <ChartRadar
                      radarData={indexData.data}
                      total={indexData.scopeNum}
                      selectCore={clickItemIndex}
                      localScope={level}
                      summaryType={summaryType}
                    />
                  </div>
                </Col>
              )
          }
        </Row>
        <SelectTreeModal {...selectTreeProps} />
      </div>
    );
  }
}
