/**
 * @file common/mouseWheel.js
 *  添加滚动轴时间监听，解决内部滚动问题
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { event } from '../../helper';

export default (options = {}) => (ComposedComponent) => {
  const { container = '.react-app', eventDom = '' } = options;

  class HOCComponent extends PureComponent {

    componentDidMount() {
      this.bindMousewheel();
    }

    componentDidUpdate() {
      this.bindMousewheel();
    }

    componentWillUnmount() {
      this.unbindMousewheel();
    }

    bindMousewheel() {
      const app = document.querySelector(container);
      event.addWheelEvent(app, this.handleMousewheel);
    }

    @autobind
    handleMousewheel() {
      const dropDown = document.querySelector(eventDom);
      if (!dropDown) {
        return;
      }
      this.addDropDownMouseWheel();
      // 模拟 fsp '#workspace-content>.wrapper' 上的鼠标mousedown事件
      event.triggerMouseDown(document.querySelector(container));
    }

    @autobind
    handleDropDownMousewheel(e = window.event) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    }

    @autobind
    addDropDownMouseWheel() {
      const elem = document.querySelector(eventDom);
      if (elem) {
        event.addWheelEvent(elem, this.handleDropDownMousewheel);
      }
    }

    unbindMousewheel() {
      const elem = document.querySelector(eventDom);
      const app = document.querySelector(container);
      if (elem) {
        event.removeWheelEvent(elem, this.handleDropDownMousewheel);
      }
      if (app) {
        event.removeWheelEvent(app, this.handleMousewheel);
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  return HOCComponent;
};
