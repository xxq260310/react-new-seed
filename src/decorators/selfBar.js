/**
 * @file /src/decorators/selfBar.js
 * @description 自定义滚动条样式
 * @author sunweibin
 */

import React, { PureComponent } from 'react';

import { dom, env } from '../helper';
import './bar.less';

export default (ComposedComponent) => {
  class UpdateBarableComponent extends PureComponent {
    componentDidMount() {
      const body = document.querySelector('body');
      if (env.isIE()) {
        // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
        dom.addClass(body, 'selfScrollBarStyleIE');
      } else {
        dom.addClass(body, 'selfScrollBarStyle');
      }
    }
    componentWillUnmount() {
      const body = document.querySelector('body');
      if (env.isIE()) {
        // 给元素添加该class修改滚动条颜色，以避免其他页面受影响
        dom.removeClass(body, 'selfScrollBarStyleIE');
      } else {
        dom.removeClass(body, 'selfScrollBarStyle');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }
  return UpdateBarableComponent;
};
