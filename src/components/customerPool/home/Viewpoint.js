/**
 * @file components/customerPool/home/Viewpoint.js
 *  首页投顾观点区域
 * @author zhangjunli
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { openRctTab } from '../../../utils';
import { url as urlHelper } from '../../../helper';
import logable from '../../../decorators/logable';
import styles from './viewpoint.less';

export default class Viewpoint extends PureComponent {
  static propTypes = {
    information: PropTypes.object,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
    information: {},
  }

  @autobind
  openNewTab(url, query, editPane) {
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '资讯' };
    const { push } = this.props;
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
      editPane,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '更多 >' } })
  handleMoreClick() {
    // 跳转到资讯列表界面
    this.openNewTab('/customerPool/viewpointList', null,
      {
        name: '资讯列表',
        path: '/customerPool/viewpointList',
      });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '详情' } })
  handleDetailClick(index) {
    // 跳转到资讯详情界面
    this.openNewTab('/customerPool/viewpointDetail', { detailIndex: index },
      {
        name: '资讯详情',
        path: '/customerPool/viewpointDetail',
      });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]' } })
  handleListClick(title, index) {
    if (!_.isEmpty(title)) {
      this.handleDetailClick(index);
    }
  }

  @autobind
  renderContent(titleArray) {
    return titleArray.map((item, index) => (
      <div
        className={classnames(styles.row, { [styles.none]: (index >= 12) })}
        onClick={() => { this.handleListClick(item.subtitle, index); }}
        key={item.id}
      >
        <a
          className={classnames(styles.news, { [styles.emptyNews]: _.isEmpty(item.subtitle) })}
          title={_.isEmpty(item.subtitle) ? '' : item.subtitle}
        >
          {_.isEmpty(item.subtitle) ? '--' : item.subtitle}
        </a>
      </div>
    ));
  }

  render() {
    const { information = {} } = this.props;
    const { infoVOList = [] } = _.isEmpty(information) ? {} : information;
    // 展示第一个新闻
    const { texttitle = '', abstract = '' } = _.isEmpty(infoVOList) ? {} : _.head(infoVOList);
    // : 为中文符号，英文的：不匹配
    const titleArray = _.split(texttitle, '：');
    const newTitle = _.last(titleArray);
    // 分割成段，展示，过滤掉非p标签，因为自带样式不符合需求
    const newFormateAbstract = _.isEmpty(abstract) ? (
      '<p>暂无内容</p>'
    ) : (
        abstract.replace(
          /<(\/?)([^\s>]+)[^>]*?>/g,
          (all, isEnd, tagName) => {
            if (_.includes(['p', 'pre'], tagName)) {
              return _.isEmpty(isEnd) ? '<p>' : '</p>';
            }
            return '';
          },
        )
      );
    // ↵ 是个符号，可以直接写，过滤掉。写 \n 过滤不掉 ↵ 符号
    const formateAbstract = newFormateAbstract.replace('↵', '');
    const isShowMore = infoVOList.length > 12;
    const isHiddenDetail = _.isEmpty(abstract);
    const newInfoVOList = _.map(infoVOList, (item, index) => ({ ...item, id: `${index}` }));
    return (
      <div className={styles.container}>
        <div className={styles.head}>首席投顾观点</div>
        <div className={styles.up}>
          <div
            className={styles.title}
            title={newTitle || '暂无标题'}
          >
            {newTitle || '暂无标题'}
          </div>
          <div className={styles.article}>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: formateAbstract }} // eslint-disable-line
            />
            <div
              className={classnames(
                styles.details,
                { [styles.detailsNone]: isHiddenDetail },
              )}
            >
              <a onClick={() => { this.handleDetailClick(0); }}>[详情]</a>
            </div>
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.headContainer}>
            <div className={classnames(styles.head, styles.listHead)}>资讯列表</div>
            {
              isShowMore ? (
                <div className={styles.fold} >
                  <a onClick={this.handleMoreClick}>{'更多 >'}</a>
                </div>
              ) : (
                  null
                )
            }
          </div>
          {
            _.isEmpty(newInfoVOList) ?
              <div className={styles.descri}>暂无数据</div> :
              <div className={classnames(styles.descriContainer, { [styles.descri]: !isShowMore })}>
                {this.renderContent(newInfoVOList)}
              </div>
          }
        </div>
      </div>
    );
  }
}
