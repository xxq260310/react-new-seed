/*
 * @Description: 批量划转的错误提醒页面
 * @Author: LiuJianShu
 * @Date: 2018-02-02 15:37:14
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-05 09:37:47
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import fspPatch from '../../decorators/fspPatch';
import withRouter from '../../decorators/withRouter';
import styles from './notifies.less';

// 通知提醒默认 ID
const DEFAULT_APPID = '20557';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 批量划转的数据
  notifiesInfo: state.mainPosition.notifiesInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 清空批量划转的数据
  getNotifies: fetchDataFunction(true, 'mainPosition/getNotifies', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
@fspPatch()
export default class FilialeCustTransferNotifies extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 清空批量划转的数据
    getNotifies: PropTypes.func,
    notifiesInfo: PropTypes.object,
  }

  static defaultProps = {
    getNotifies: _.noop,
    notifiesInfo: {},
  }

  componentWillMount() {
    const {
      location: { query: { appId = DEFAULT_APPID } },
      getNotifies,
    } = this.props;
    getNotifies({ appId });
  }


  render() {
    const {
      // 清空批量划转的数据
      notifiesInfo,
    } = this.props;
    if (_.isEmpty(notifiesInfo)) {
      return null;
    }
    return (
      <div className={styles.notifiesInfoWrapper}>
        <h2>通知提醒</h2>
        <p>您的主职位已被更新为{notifiesInfo.position} {notifiesInfo.department},</p>
        <p> 新开户的客户服务关系将归属该职位！</p>
      </div>
    );
  }
}
