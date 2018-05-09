/**
 * @file components/common/tag/index.js
 * @author sunweibin
 * @description 用于显示列表组件中的标签组件
 * 由于接口的原因，
 * 传递的属性说明：
 * type {string} // 需要使用何种样式，目前仅有两个选项blue, yellow
 * text {string} // 标签显示文字
 * color {string} // 背景颜色的自定义色值，可选
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// import tagConfig from './config';
import styles from './index.less';

export default class Tag extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
    clsName: PropTypes.string,
  };

  static defaultProps = {
    color: '',
    text: '',
    type: 'blue',
    clsName: '',
  }

  render() {
    const { type, color, text, clsName } = this.props;
    const lowType = type.toLowerCase();
    let newStyle = {};
    if (color !== '') {
      newStyle = {
        backgroundColor: color,
      };
    }

    const tagCls = classnames({
      [styles[`tag-${lowType}`]]: true,
      [styles.htscTag]: true,
      [clsName]: !!clsName,
    });

    return (
      <span className={tagCls} style={newStyle}>{text}</span>
    );
  }
}
