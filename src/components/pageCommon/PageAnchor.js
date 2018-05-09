/**
 * @file pageCommon/PageAnchor.js
 * @description 经营业绩看板页内导航
 * @author hongguangqing
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../common/Icon';
import { fsp } from '../../helper';

import Anchor from '../../components/common/anchor';
import { reportAnchorOptions } from '../../config';
import styles from './pageAnchor.less';
import logable from '../../decorators/logable';

const { Link } = Anchor;

export default class PageAnchor extends PureComponent {

  static propTypes = {
    chartInfo: PropTypes.array.isRequired,
  }

  /**
   * key和value显示转换
  */
  @autobind
  changeDisplay(st, options) {
    if (st) {
      const nowStatus = _.find(options, o => o.key === st);
      if (nowStatus) {
        return nowStatus.value;
      }
    }
    return '其他';
  }

  /**
   * 点击返回顶部图标滚动顶部
  */
  @autobind
  @logable({ type: 'Click', payload: { name: '返回顶部' } })
  handleGotoTop() {
    fsp.scrollToTop();
  }

  render() {
    const { chartInfo } = this.props;
    const charInfoLength = chartInfo.length;
    return (
      <div>
        {
          charInfoLength >= 3 ?
            <Anchor className={styles.pageAnchor} offsetTop={130} >
              {
                chartInfo.map((item) => {
                  const { key } = item;
                  const href = `#${key}`;
                  return (
                    <Link
                      key={key}
                      href={href}
                      title={this.changeDisplay(key, reportAnchorOptions)}
                    />
                  );
                })
              }
              <Link><div className={styles.gotoTop} onClick={this.handleGotoTop}><Icon type="fanhuidingbu" /></div></Link>
            </Anchor>
          :
            <div />
        }
      </div>
    );
  }
}
