/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 16:21:27
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-13 13:37:47
 * 任务描述
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import LabelInfo from '../common/LabelInfo';
import styles from './missionDescription.less';

export default class MissionDescription extends PureComponent {

  static propTypes = {
    // 任务描述
    missionDescription: PropTypes.string,
  }

  static defaultProps = {
    missionDescription: '',
  }

  render() {
    const {
      missionDescription,
    } = this.props;

    return (
      <div className={styles.missionDescriptionSection}>
        <LabelInfo value={'描述'} />
        <div className={styles.content}>
          {missionDescription || '--'}
        </div>
      </div>
    );
  }
}
