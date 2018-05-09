/**
 * @file components/customerPool/TaskListDetailInfo.js
 *  自建任务列表详情
 * @author 朱胜楠
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import pageConfig from '../pageConfig';

import styles from './detailInfo.less';

const { taskList: { status } } = pageConfig;

// 完成状态对应的 key 值
const COMPLETE_CODE = '02';

export default class TaskListDetailInfo extends PureComponent {

  static propTypes = {
    infoData: PropTypes.object,
  }

  static defaultProps = {
    infoData: {},
  }

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  changeDisplay(st, options) {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '--';
    }
    return '--';
  }

  render() {
    const { infoData } = this.props;
    const timelyIntervalValue = infoData.timelyIntervalValue || '--';
    return (
      <div className={styles.module}>
        {infoData.status !== COMPLETE_CODE ?
          <div className={styles.modContent}>
            <div>
              <span>任务编号&nbsp;:</span>
              <span>{infoData.currentId || '--'}</span>
            </div>
            <div className={styles.leftRow}>
              <span>任务状态&nbsp;:</span>
              <span>{this.changeDisplay(infoData.status, status) || '--'}</span>
            </div>
            <div className={styles.rightRow}>
              <span>有效期（天）&nbsp;:</span>
              <span>{String(timelyIntervalValue) || '--'}</span>
            </div>
            <div>
              <span>服务策略&nbsp;:</span>
              <span>
                <div
                  dangerouslySetInnerHTML={{ __html: infoData.strategyDescHtml || '--' }}
                />
              </span>
            </div>
            <div>
              <span>任务提示&nbsp;:</span>
              <span>
                <div
                  dangerouslySetInnerHTML={{ __html: infoData.infoContentHtml || '--' }}
                />
              </span>
            </div>
          </div> :
          <div className={styles.modContent}>
            <div>
              <span>任务编号&nbsp;:</span>
              <span>{infoData.currentId || '--'}</span>
            </div>
            <div>
              <span>任务状态&nbsp;:</span>
              <span>{this.changeDisplay(infoData.status, status) || '--'}</span>
            </div>
            <div className={styles.leftRow}>
              <span>触发时间&nbsp;:</span>
              <span>{infoData.triggerTime || '--'}</span>
            </div>
            <div className={styles.rightRow}>
              <span>截止时间&nbsp;:</span>
              <span>{infoData.deadTime || '--'}</span>
            </div>
            <div>
              <span>服务策略&nbsp;:</span>
              <span>
                <div
                  dangerouslySetInnerHTML={{ __html: infoData.strategyDesc || '--' }}
                />
              </span>
            </div>
            <div>
              <span>任务提示&nbsp;:</span>
              <span>
                <div
                  dangerouslySetInnerHTML={{ __html: infoData.infoContent || '--' }}
                />
              </span>
            </div>
          </div>
        }
      </div>
    );
  }
}
