/**
 * @file list/CreateCollapse.js
 *  折叠
 * @author xuxiaoqin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Collapse } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import ServiceRecordContent from './ServiceRecordContent';
import styles from './createCollapse.less';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const Panel = Collapse.Panel;


export default class CreateCollapse extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    executeTypes: PropTypes.array.isRequired,
    serveWay: PropTypes.array.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    data: EMPTY_LIST,
    loading: false,
    filesList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      currentActiveIndex: ['0'],
    };
  }

  /**
   * 处理collapse change事件
   * @param {*} currentKey 当前key
   */
  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handleCollapseChange(currentKey) {
    const { handleCollapseClick, data, getCeFileList } = this.props;
    if (!_.isEmpty(currentKey)) {
      const service = data[currentKey];
      const { uuid } = service;
      const attachment = uuid;
      if (!_.isEmpty(uuid)) {
        getCeFileList({ attachment });
      }
    }
    // 手动上报日志
    handleCollapseClick({ currentKey });
    this.setState({
      currentActiveIndex: currentKey,
    });
  }

  /**
  * 分割时间，同一天的保留一个年月日，其余都是时分秒
  * 不同一天，保留年月日时分秒
  */
  separateDate(serviceTime) {
    if (_.isEmpty(serviceTime)) {
      return null;
    }

    const serviceTimeCollection = _.map(serviceTime, item => item.serveTime);

    let currentDate = moment(serviceTimeCollection[0]).date();
    const newDate = [{
      yearTime: serviceTimeCollection[0].substring(0, 10),
      dayTime: serviceTimeCollection[0].substring(11),
    }];
    let tempDate;
    _.forEach(serviceTimeCollection, (item, index) => {
      if (index !== 0) {
        tempDate = moment(item).date();
        if (tempDate === currentDate) {
          newDate.push({
            yearTime: '',
            dayTime: item.length > 10 ? item.substring(11) : '',
          });
        } else {
          currentDate = tempDate;
          newDate.push({
            yearTime: item.substring(0, 10),
            dayTime: item.length > 10 ? item.substring(11) : '',
          });
        }
      }
    });

    return newDate;
  }

  renderHeaderLeft(item) {
    if (_.isEmpty(item)) {
      return null;
    }

    if (!_.isEmpty(item.subtypeCd) && item.subtypeCd.indexOf('MOT服务记录') === -1) {
      // 不是MOT任务，但是是从OCRM来的
      return (
        <div
          className={styles.headerLeft}
          title={`${item.subtypeCd || ''}：${item.serveRecord || ''}`}
        >
          {_.isEmpty(item.subtypeCd) ? '' : `${item.subtypeCd}：`}{item.serveRecord || ''}
        </div>
      );
    }
    // MOT服务记录
    // MOT系统来的，短信、呼叫中心
    return (
      <div
        className={styles.headerLeft}
        title={`${item.taskName || ''}：${item.serveRecord || ''}`}
      >
        {_.isEmpty(item.taskName) ? '' : `${item.taskName}：`}{item.serveRecord || ''}
      </div>
    );
  }

  renderHeaderRight(item) {
    if (_.isEmpty(item)) {
      return null;
    }

    if (_.isEmpty(item.subtypeCd)) {
      // 从MOT系统来，没有活动方式
      return (
        <span>{item.serveChannel || '--'}</span>
      );
    }

    return (
      <span className={styles.activityType}>{item.serveOrigin}</span>
    );
  }

  renderPanel(serveTime) {
    const { data, executeTypes, filesList } = this.props;
    const { currentActiveIndex } = this.state;
    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <div className={styles.panelContainer}>
        <Collapse
          /* 只打开一个panel */
          accordion
          className={styles.serviceCollapse}
          defaultActiveKey={['0']}
          onChange={this.handleCollapseChange}
          ref={ref => this.collapse = ref}
        >
          {
            _.map(data, (item, index) =>
              <Panel
                header={
                  <div className={styles.headerContainer}>
                    <div>
                      {
                        !_.isEmpty(serveTime) ?
                          <div
                            className={styles.serviceTime}
                            key={`${serveTime[index].yearTime}${serveTime[index].dayTime}`}
                          >
                            <div className={styles.yearTime}>{serveTime[index].yearTime || ''}</div>
                            <div
                              className={
                                classnames({
                                  [styles.activeTime]: _.includes(currentActiveIndex,
                                    String(index)),
                                  [styles.dayTime]: !_.includes(currentActiveIndex,
                                    String(index)),
                                  [styles.onlyDayTime]: _.isEmpty(serveTime[index].yearTime),
                                })
                              }
                            >
                              {serveTime[index].dayTime || ''}
                            </div>
                          </div> : null
                      }
                      <div className={styles.leftAnchor}>
                        <span
                          className={
                            classnames({
                              [styles.hidden]: !_.includes(currentActiveIndex, String(index)),
                              [styles.visible]: _.includes(currentActiveIndex, String(index)),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.collapsePanel}>
                      {
                        this.renderHeaderLeft(item)
                      }
                      <div className={styles.headerRight}>
                        {
                          this.renderHeaderRight(item)
                        }
                        <div
                          className={
                            classnames({
                              [styles.upIcon]: _.includes(currentActiveIndex, String(index)),
                              [styles.downIcon]: !_.includes(currentActiveIndex, String(index)),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                }
                className={styles.panelHeader}
                key={index}
              >
                <ServiceRecordContent
                  executeTypes={executeTypes}
                  item={item}
                  filesList={filesList}
                />
              </Panel>,
            )
          }
        </Collapse>
      </div >
    );
  }

  render() {
    const {
      data = EMPTY_LIST,
      loading,
     } = this.props;

    if (_.isEmpty(data) && !loading) {
      return (
        <div className={styles.noServiceRecord}>无服务记录</div>
      );
    }

    // 左边服务时间字段
    const serveTimeCollection = _.isEmpty(data) ?
      EMPTY_LIST : _.filter(data, item => !_.isEmpty(item.serveTime));

    const serveTime = this.separateDate(serveTimeCollection);

    return (
      <div className={styles.collapseContainer}>
        {
          this.renderPanel(serveTime)
        }
      </div>
    );
  }
}
