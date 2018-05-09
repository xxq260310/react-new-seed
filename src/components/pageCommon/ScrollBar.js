/**
* @fileOverview components/pageCommon/scrollBar.js
* @author hongguangqing
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { dom, event, env } from '../../helper';
import { fspContainer } from '../../config';
import styles from './scrollBar.less';

const clientWidthValue = document.querySelector('#exApp').clientWidth - 40;
const fspWorkspaceContent = document.querySelector(fspContainer.workspaceContent);
// fsp中侧边栏点击显示和隐藏按钮
const showBtn = document.querySelector(fspContainer.showBtn);
const hideBtn = document.querySelector(fspContainer.hideBtn);

export default class ScrollBar extends PureComponent {

  static propTypes = {
    allWidth: PropTypes.number.isRequired,
    tableScrollLeft: PropTypes.number.isRequired,
    setScrollLeft: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      clientWidth: clientWidthValue,
    };
  }

  componentDidMount() {
    // 由表格的滚动条的scrollLeft值来控制自己写的滚动条的scrollLeft值
    this.reportScroll.scrollLeft = this.props.tableScrollLeft;
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    if (env.isInFsp()) {
      // 监听 FSP 侧边栏显示隐藏按钮点击事件
      event.addClickEvent(showBtn, this.onWindowResize);
      event.addClickEvent(hideBtn, this.onWindowResize);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tableScrollLeft: preTSL } = this.props;
    const { tableScrollLeft: nextTSL } = nextProps;
    if (!_.isEqual(preTSL, nextTSL)) {
      this.reportScroll.scrollLeft = nextTSL;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    if (env.isInFsp()) {
      // remove FSP 侧边栏显示隐藏按钮点击事件
      event.removeClickEvent(showBtn, this.onWindowResize);
      event.removeClickEvent(hideBtn, this.onWindowResize);
    }
  }

  @autobind
  onWindowResize() {
    this.setState({ clientWidth: document.querySelector('#exApp').clientWidth - 40 });
  }

  @autobind
  handleScroll(e) {
    const { setScrollLeft } = this.props;
    const scrollLeft = e.target.scrollLeft;
    // 滚动条向左滚动距离的传递函数
    setScrollLeft(scrollLeft);
  }

  @autobind
  reportScrollBar(input) {
    this.reportScroll = input;
  }
  render() {
    const { clientWidth } = this.state;
    const { allWidth } = this.props;
    // 20为表格距离浏览器左边的值，45为fsp中表格距离浏览器左边的值
    return (
      <div
        className={styles.reportScrollBar}
        onScroll={this.handleScroll}
        ref={this.reportScrollBar}
        style={{
          width: clientWidth,
          left: env.isInFsp() ? parseInt(dom.getCssStyle(fspWorkspaceContent, 'left'), 10) + 45 : 20,
        }}
      >
        <div className={styles.reportScrollBarInner} style={{ width: allWidth }} />
      </div>
    );
  }
}
