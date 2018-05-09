/**
 * @Author: sunweibin
 * @Date: 2017-11-10 10:12:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-02-01 15:54:07
 * @description 分割组件
 * 此组件中
 * 当左侧列表组件折叠起来后，右侧详情的isFold属性将会变成true,
 * 并且在详情的外部容器组件上会多一个isCSListFold的CSS类
 * 当左侧列表组件展开起来后，右侧详情的isFold属性将会变成false,
 * 并且在详情的外部容器组件上没有isCSListFold的CSS类
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Resize from 'element-resize-detector';

import Icon from '../Icon';
import config from './config';
import { env, dom } from '../../../helper';

import styles from './cutScreen.less';
import nodatapng from './nodata.png';
import logable from '../../../decorators/logable';

export default class CutScreen extends PureComponent {
  static propTypes = {
    topPanel: PropTypes.element.isRequired,
    leftPanel: PropTypes.element.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    rightPanel: PropTypes.element,
    leftListClassName: PropTypes.string,
    leftWidth: PropTypes.number,
  }

  static defaultProps = {
    leftListClassName: 'pageCommonList',
    rightPanel: null,
    leftWidth: 520,
  }

  constructor(props) {
    super(props);
    this.state = {
      isFold: false, // 判断左侧列表组件是否折叠起来
    };
    this.resize = null;
    this.fnResize = null;
    this.splitHeight = this.getViewHeight();
  }

  componentDidMount() {
    // 初始化当前系统
    this.UTBContentElem = document.querySelector(config.utb);
    // 将系统的Margin设置为0;
    this.setUTBContentMargin(0, 0, 0);
    // 监听window.onResize事件
    this.registerWindowResize();
    this.initPanel();
    this.setDocumentScroll();
    this.listenTopPanelHeightChange();
  }

  componentWillUnmount() {
    // 重置外层容器样式,防止影响其他界面
    this.setUTBContentMargin('10px', '30px', '10px');
    this.resetContainerStyle();
    this.cancelWindowResize();
    this.cancelTopReszieListen();
  }

  // Resize事件
  @autobind
  onResizeChange() {
    this.setDocumentScroll();
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

  // 设置系统容器的局部样式
  @autobind
  setUTBContentMargin(top, right, bottom) {
    dom.setStyle(this.UTBContentElem, 'marginTop', top);
    dom.setStyle(this.UTBContentElem, 'marginRight', right);
    dom.setStyle(this.UTBContentElem, 'marginBottom', bottom);
  }
  // 设置split下列表和详情区域的高度
  @autobind
  setSplitMainHeight() {
    // 头部筛选区域的高度
    const topHeight = dom.getRect(this.splitTop, 'height');
    // 中间padding的高度和
    const padding = 40;
    const mh = this.splitHeight - topHeight - padding;
    dom.setStyle(this.splitMain, 'height', `${mh}px`);
  }

  // 设置分割区域的滚动
  @autobind
  setDocumentScroll() {
    // 1.首先获取视口高度
    const viewportHeight = this.getViewHeight();
    // 目前CRM系统存在三种情况: 1.嵌入FSP系统页面 2.嵌入React系统页面 3.独立的开发页面
    // 嵌入FSP系统容器高度需要减去头部的 55px
    // 嵌入React系统容器高度需要减去头部的 90px
    // 独立开发的页面容器高度就是 viewportHeight
    // 因为新的CutScreen组件使用display: flex;来使用内部高度，
    // 因此组件只需要计算出容器的高度并赋值即可
    let pch = viewportHeight;
    if (env.isInFsp()) {
      pch = viewportHeight - config.fspHeaderHeight;
      // 因为FSP系统和独立开发系统均在 '#container', '#content'容器下
    }
    if (env.isInReact()) {
      // React系统下是在'#react-content'容器下
      pch = viewportHeight - config.reactHeaderHeight;
    }
    dom.setStyle(this.splitPanel, 'height', `${pch}px`);
    // 将split的高度保存下来;
    this.splitHeight = pch;
    this.setSplitMainHeight();
  }


  // 监听头部筛选区域高度的变化
  @autobind
  listenTopPanelHeightChange() {
    const fnResize = _.debounce(this.setSplitMainHeight, 250, {
      leading: true,
      trailing: true,
    });
    const resize = Resize({ strategy: 'scroll' });
    resize.listenTo(this.splitTop, fnResize);
    this.resize = resize;
    this.fnResize = fnResize;
  }

  // 注销对头部筛选区域高度的变化的监听
  @autobind
  cancelTopReszieListen() {
    if (this.resize && this.resize.uninstall) {
      this.resize.uninstall(this.splitTop);
    }
    if (this.fnResize && this.fnResize.cancel) {
      this.fnResize.cancel();
    }
  }

  // 重置系统容器样式
  @autobind
  resetContainerStyle() {
    let containerElem;
    if (this.UTBContentElem) {
      containerElem = this.UTBContentElem.querySelector(config.container);
    } else {
      containerElem = document.querySelector(config.container);
    }
    dom.setStyle(containerElem, 'height', 'auto');
  }

  // 初始化的时候，设置各自的宽度
  @autobind
  initPanel() {
    let { leftWidth } = this.props;
    if (env.isIE()) {
      leftWidth += 20;
    } else if (env.isFirefox()) {
      leftWidth += 10;
    }
    dom.setStyle(this.listWrap, 'width', `${leftWidth}px`);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '收起' } })
  shrinkList() {
    this.setState({
      stretchIcon: 'caret-right',
      isFold: true,
    });
    dom.setStyle(this.listWrap, 'display', 'none');
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '展开' } })
  growList() {
    this.setState({
      stretchIcon: 'caret-left',
      isFold: false,
    });
    dom.setStyle(this.listWrap, 'display', 'block');
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

  // splitWrap
  @autobind
  splitRef(input) {
    this.splitPanel = input;
  }
  // splitWrap
  @autobind
  splitMainRef(input) {
    this.splitMain = input;
  }

  // splitWrap
  @autobind
  splitTopRef(input) {
    this.splitTop = input;
  }

  // 左侧列表
  @autobind
  listWrapRef(input) {
    this.listWrap = input;
  }

  @autobind
  rightDetailWrapRef(input) {
    this.rightDetailWrap = input;
  }

  render() {
    const {
      topPanel,
      leftPanel,
      rightPanel,
      isEmpty,
    } = this.props;
    const { isFold } = this.state;
    const noDataClass = classnames({
      [styles.hide]: !isEmpty,
      [styles.noData]: true,
    });
    const hasDataClass = classnames({
      [styles.hide]: isEmpty,
      [styles.main]: true,
    });
    const hasFoldCls = classnames({
      [styles.detailWrap]: true,
      isCSListFold: isFold,
    });
    const stretchEmptyCls = classnames({
      [styles.stretch]: true,
      [styles.hideStretch]: isFold,
    });
    const stretchCls = classnames({
      [styles.stretchGrow]: true,
      [styles.hideStretch]: !isFold,
    });

    return (
      <div className={styles.splitWrap} ref={this.splitRef}>
        <div className={styles.header} ref={this.splitTopRef}>
          {topPanel}
        </div>
        <div className={noDataClass}>
          <div className={styles.nodataBlock}>
            <img src={nodatapng} alt="nodata" />
            <div className={styles.nodataText}>暂无数据</div>
          </div>
        </div>
        <div className={hasDataClass} ref={this.splitMainRef}>
          <div className={stretchCls}>
            <div className={styles.growIcon}>
              <Icon type="zhankai-" onClick={this.growList} />
            </div>
          </div>
          <div className={styles.listWrap} ref={this.listWrapRef}>
            <leftPanel.type {...leftPanel.props} onShrink={this.shrinkList} />
          </div>
          <div className={stretchEmptyCls}> { /** 留着占位置 */} </div>
          <div className={hasFoldCls}>
            {
              _.isEmpty(rightPanel) ? null
                : (
                  <rightPanel.type
                    {...rightPanel.props}
                    isFold={isFold}
                    ref={this.rightDetailWrapRef}
                  />
                )
            }
          </div>
        </div>
      </div>
    );
  }
}
