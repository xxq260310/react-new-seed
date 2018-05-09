/*
* @Description: 合作合约修改/新建 -拟稿信息
* @Author: XuWenKang
* @Date:   2017-09-20 16:53:31
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-12 10:23:35
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';

import styles from './draftinfo.less';
import { seibelConfig } from '../../config';

// 合约条款的状态对应值
const { contract: { status: configStatus } } = seibelConfig;

export default class DraftInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const { data: { name, date, status } } = this.props;

    let statusLabel = '';
    if (status) {
      statusLabel = configStatus[Number(status)].label;
    } else {
      statusLabel = '';
    }
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="拟稿信息" />
        <InfoItem label="拟稿人" value={name} />
        <InfoItem label="提请时间" value={date} />
        <InfoItem label="状态" value={statusLabel} />
      </div>
    );
  }

}
