/**
 * @Author: sunweibin
 * @Date: 2017-12-12 14:56:58
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-26 10:22:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import styles from './tipsInfo.less';


export default class TipsInfo extends PureComponent {
  static propTypes = {
    title: PropTypes.node.isRequired,
    position: PropTypes.string,
    wrapperClass: PropTypes.string,
    overlayStyle: PropTypes.object,
    getPopupContainer: PropTypes.func,
    trigger: PropTypes.string,
  }

  static defaultProps = {
    position: 'bottomLeft',
    wrapperClass: '',
    overlayStyle: null,
    trigger: 'hover',
    getPopupContainer: () => document.body,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    const {
      title,
      position,
      wrapperClass,
      overlayStyle,
      getPopupContainer,
      trigger,
    } = this.props;

    return (
      <Tooltip
        title={title}
        overlayClassName={classnames({
          [styles.globalTips]: true,
          [wrapperClass]: true,
        })}
        mouseEnterDelay={0.2}
        arrowPointAtCenter
        autoAdjustOverflow
        placement={position}
        overlayStyle={overlayStyle}
        getPopupContainer={getPopupContainer}
        trigger={trigger}
      >
        <Icon className={styles.icon} type="tishi2" />
      </Tooltip>
    );
  }
}
