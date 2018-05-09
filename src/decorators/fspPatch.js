/*
 * @Description: 为组件设置全屏的高度，并在卸载时取消高度
 * @Author: LiuJianShu
 * @Date: 2018-01-08 13:50:37
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-01-08 14:37:59
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import { dom, env } from '../helper';

const config = {
  utb: '#UTBContent',  // FSP 外层容器
  reactHeaderHeight: 140, // 在React框架下的头部高度
  fspHeaderHeight: 55, // 在FSP框架下的头部高度
  UTBContentMargin: '10px 30px 10px 25px',  // FSP 框架下顶层容器的 margin
  newUTBContentMargin: '0 0 0 25px',  // 需要设置的新 margin
};

const fspPatch = (...arg) => (ComposedComponent) => {
  /*
   * arg 可以传 'width'\'height' 等属性
   * 目前默认设置 height、margin，无需传入
   * 需要其他设置时，传入相应参数，并在 setContentStyle 中做相应更改
   */
  class FspPatchComponent extends PureComponent {

    componentDidMount() {
      // 初始化当前系统
      this.UTBContentElem = document.querySelector(config.utb);

      // 设置新的 系统的 margin
      this.setUTBContentMargin(config.newUTBContentMargin);

      // 添加监听 window.onResize 事件
      this.registerWindowResize();

      // 设置滚动区域
      this.setContentStyle();
    }

    componentWillUnmount() {
      // 重置外层容器 margin 样式,防止影响其他界面
      this.setUTBContentMargin(config.UTBContentMargin);

      // 取消监听 window.onResize 事件
      this.cancelWindowResize();
    }

    // Resize事件
    @autobind
    onResizeChange() {
      this.setContentStyle();
    }

    // 获取浏览器视口高度
    @autobind
    getViewHeight() {
      let h = dom.getViewPortHeight();
      if (env.isIE()) { h -= 10; }
      if (document.body.clientWidth === 1280) {
        h -= 17; // 处理视口宽度为最小的1280px时，需要去掉滚动条的宽度
      }
      return h;
    }

    // 设置装饰器包裹的组件样式
    @autobind
    setContentStyle() {
      // 传入的参数
      console.log('传入的参数 arg', arg);
      // 1.首先获取视口高度
      const viewportHeight = this.getViewHeight();
      // 目前CRM系统存在三种情况: 1.嵌入FSP系统页面 2.嵌入React系统页面 3.独立的开发页面
      // 嵌入FSP系统容器高度需要减去头部的 55px
      // 嵌入React系统容器高度需要减去头部的 90px
      // 独立开发的页面容器高度就是 viewportHeight
      // 组件只需要计算出容器的高度并赋值即可
      let pch = viewportHeight;
      if (env.isInFsp()) {
        // 因为FSP系统和独立开发系统均在 '#container', '#content'容器下
        pch = viewportHeight - config.fspHeaderHeight;
      }
      if (env.isInReact()) {
        // React系统下是在'#react-content'容器下
        pch = viewportHeight - config.reactHeaderHeight;
      }
      dom.setStyle(this.patchComponent, 'height', `${pch}px`);
    }

    // 设置系统容器的局部样式，margin
    @autobind
    setUTBContentMargin(str) {
      if (this.UTBContentElem) {
        dom.setStyle(this.UTBContentElem, 'margin', str);
      }
    }

    // 注册window的resize事件
    @autobind
    registerWindowResize() {
      window.addEventListener('resize', this.onResizeChange, false);
    }

    // 注销window的resize事件
    @autobind
    cancelWindowResize() {
      window.removeEventListener('resize', this.onResizeChange, false);
    }

    render() {
      return (
        <div ref={ref => this.patchComponent = ref}>
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }
  return FspPatchComponent;
};
export default fspPatch;
