/**
 * Created By K0170179 on 2018/1/12
 * 播报详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { url as urlHelper, emp, fsp } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { openRctTab } from '../../utils';
import { request } from '../../config';
import styles from './boradcastDetail.less';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Audio from '../../components/common/audio/Audio';
import Icon from '../../components/common/Icon';
import logable from '../../decorators/logable';

const effects = {
  getBoradcastDetail: 'morningBoradcast/getBoradcastDetail',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  boradcastDetail: state.morningBoradcast.boradcastDetail,
});

const mapDispatchToProps = {
  getBoradcastDetail: fetchDataFunction(true, effects.getBoradcastDetail),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BroadcastDetail extends PureComponent {
  static propTypes = {
    boradcastDetail: PropTypes.object.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { newItemDetail, newsId } = this.getItemDetail();
    const { getBoradcastDetail } = this.props;
    fsp.scrollToTop();
    if (_.isEmpty(newItemDetail) && newsId) {
      getBoradcastDetail({ newsId });
    }
  }

  @autobind()
  getItemDetail() {
    const { location: { query } } = this.props;
    const { newsId } = query;
    const { boradcastDetail } = this.props;
    const newItemDetail = boradcastDetail[newsId] || {};
    return { newItemDetail, newsId };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '晨间播报列表' } })
  handleBackClick() {
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_LIST', title: '晨报' };
    const url = '/broadcastList';
    const query = { };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
    });
  }

  @autobind
  getSourceSrc(source) {
    return `${request.prefix}/file/ceFileDownload?attachId=${source.attachId}&empId=${emp.getId()}&filename=${window.encodeURIComponent(source.name)}`;
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() {}

  render() {
    const { newItemDetail } = this.getItemDetail();
    const { audioFileList = [], otherFileList = [] } = newItemDetail;
    const audioSource = audioFileList[0];
    return (
      <div className={styles.broadcastDetail_wrap}>
        <div className={styles.broadcastDetail}>
          <div className={styles.content}>
            <div onClick={this.handleBackClick} className={`${styles.backList} ${styles.headerBack}`}>
              <Icon className="icon" type="fanhui" />
              晨间播报列表
            </div>
            <div className={styles.header}>
              <div className={styles.title}>{ newItemDetail.title }</div>
              <div className={styles.info}>
                <div>类型：{ newItemDetail.newsTypValue }</div>
                <div>作者：{ newItemDetail.updatedBy || newItemDetail.createdBy }</div>
                <div>发布日期：{ newItemDetail.created }</div>
              </div>
            </div>
            <div className={styles.body}>
              <p>{ newItemDetail.summary }</p>
              <p>{ newItemDetail.content }</p>
            </div>
            <div className={styles.footer}>
              <div className={styles.downMusic}>
                <Icon className="icon" type="shipinwenjian" style={{ color: '#2d86d8' }} />
                <div className={styles.audioTitle} title="点击下载">
                  音频文件
                </div>
                <div className={styles.audioControl}>
                  <Audio
                    src={audioSource && this.getSourceSrc(audioSource)}
                  />
                </div>
                {
                  audioSource ?
                    <a
                      onClick={this.handleDownloadClick}
                      href={this.getSourceSrc(audioSource)}
                    >
                      <Icon className="icon" type="xiazai" />
                    </a> :
                    null
                }
              </div>
              {
                otherFileList.length ? (
                  <span>
                    <div className={styles.downOther}>
                      <Icon className="icon" type="qitawenjian" style={{ color: '#cdcdcd' }} />
                      <span>其他文件</span>
                    </div>
                    <CommonUpload
                      attachmentList={otherFileList}
                      edit={false}
                    />
                  </span>
                ) : null
              }
              <div onClick={this.handleBackClick} className={`${styles.backList} ${styles.footerBack}`}>
                <Icon className="icon" type="fanhui" />
                晨间播报列表
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
