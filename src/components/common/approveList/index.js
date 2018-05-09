/*
 * @Description: 审批记录列表组件
 * @Author: LiuJianShu
 * @Date: 2017-09-25 18:42:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-04 15:24:28
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Pagination from '../../common/Pagination';

import styles from './index.less';

export default class ApproveList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    nowStep: PropTypes.object,
    needPagination: PropTypes.bool,
  }

  static defaultProps = {
    data: [],
    nowStep: {},
    needPagination: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 默认第一页
      page: 1,
      // 默认每页五条
      pageSize: 5,
    };
  }

  @autobind
  changePagination(current) {
    this.setState({
      page: current,
    });
  }

  render() {
    const { data, nowStep, needPagination } = this.props;
    const { page, pageSize } = this.state;
    const chunkData = data.length ? _.chunk(data, pageSize)[page - 1] : [];
    const displayData = needPagination ? chunkData : data;
    const paginationOption = {
      current: page,
      total: chunkData.length,
      pageSize,
      onChange: this.changePagination,
    };
    return (
      <div className={styles.approveWrapper}>
        {
          !_.isEmpty(nowStep) ?
            <div className={styles.approveNow}>
              <span>当前步骤：</span>
              <span>{nowStep.stepName}</span>
              <span>当前审批人：</span>
              <span>{nowStep.handleName}</span>
            </div>
            :
            null
        }
        {
          displayData.length ?
            <div className={styles.approveList}>
              {
                displayData.map(item => (
                  <div key={item.entryTime} className={styles.approveItem}>
                    <p>
                      审批人：{item.handleName}
                      于{item.handleTime}，
                      步骤名称：{item.stepName}
                    </p>
                    <p>
                      {item.comment}
                    </p>
                  </div>
                ))
              }
              {
                needPagination ?
                  <Pagination
                    {...paginationOption}
                  />
                  :
                  null
              }
            </div>
            :
            null
        }
      </div>
    );
  }
}
