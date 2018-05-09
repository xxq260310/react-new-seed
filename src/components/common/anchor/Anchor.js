/* eslint-disable */
/** 搬运至antd/Anchor,解决导航时改变hash的问题,所以不做代码检查 */

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { Affix } from 'antd';
import AnchorLink from './AnchorLink';
import getScroll from 'antd/lib/_util/getScroll';
import getRequestAnimationFrame from 'antd/lib/_util/getRequestAnimationFrame';
import { fspContainer } from '../../../config';
import './index.less';
import logable from '../../../decorators/logable';

const fsp = document.querySelector(fspContainer.container);

function getDefaultTarget() {
  return window;
}

function getOffsetTop(element) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    const doc = element.ownerDocument;
    const docElem = doc.documentElement;
    return rect.top - docElem.clientTop;
  }

  return rect.top;
}

function easeInOutCubic(t, b, c, d) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
}

const reqAnimFrame = getRequestAnimationFrame();
export function scrollTo(href, offsetTop = 0, target = getDefaultTarget, callback = () => { }) {
  let scrollTopValue;
  if (fsp) {
    scrollTopValue = fsp.scrollTop;
  } else {
    scrollTopValue = getScroll(target(), true);
  }
  
  const targetElement = document.getElementById(href.substring(1));
  if (!targetElement) {
    return;
  }
  const eleOffsetTop = getOffsetTop(targetElement);
  const targetScrollTop = scrollTopValue + eleOffsetTop - offsetTop;

  const startTime = Date.now();
  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    // 搬了antd/Anchor判断是否在fsp中，因为fsp是自己做的滚动条
    
    if (fsp) {
      fsp.scrollTop = easeInOutCubic(time, scrollTopValue, targetScrollTop, 450);
    } else {
      window.scrollTo(window.pageXOffset, easeInOutCubic(time, scrollTopValue, targetScrollTop, 450));
    }
    
    if (time < 450) {
      reqAnimFrame(frameFunc);
    } else {
      callback();
    }
  };
  reqAnimFrame(frameFunc);
  // 搬了antd/Anchor去掉这一行
  // history.pushState(null, '', href);
}


export default class Anchor extends PureComponent {

  static Link = AnchorLink;

  static propTypes = {
    target: PropTypes.element,
    prefixCls: PropTypes.string,
    offsetTop: PropTypes.number,
    bounds: PropTypes.number,
    className: PropTypes.string,
    affix: PropTypes.bool,
    showInkInFixed: PropTypes.bool,
  }

  static defaultProps = {
    prefixCls: 'ant-anchor',
    affix: true,
    showInkInFixed: false,
  };

  static childContextTypes = {
    antAnchor: PropTypes.object,
  };

  // noinspection JSAnnotator
    refs: {
      ink: PropTypes.any;
  };

  // private links: String[];
  // private scrollEvent: any;
  // private animating: boolean;

  constructor(props: AnchorProps) {
    super(props);
    this.state = {
      activeLink: 'null',
    };
    this.links = [];
  }

  getChildContext() {
    return {
      antAnchor: {
        registerLink: (link) => {
          if (!this.links.includes(link)) {
            this.links.push(link);
          }
        },
        unregisterLink: (link) => {
          const index = this.links.indexOf(link);
          if (index !== -1) {
            this.links.splice(index, 1);
          }
        },
        activeLink: this.state.activeLink,
        scrollTo: this.handleScrollTo,
      },
    };
  }

  componentDidMount() {
    const getTarget = this.props.target || getDefaultTarget;
    // 搬了antd/Anchor判断是否在fsp中，控制scroll
    if (fsp) {
      $(fsp).on('scroll', this.handleScroll);
    } else {
      this.scrollEvent = addEventListener((this.props.target || getDefaultTarget)(), 'scroll', this.handleScroll);
    }
    this.handleScroll();
  }

  componentWillUnmount() {
    if (fsp) {
      $(fsp).off('scroll', this.onScroll);
    } else {
      this.scrollEvent.remove();
    }
  }

  componentDidUpdate() {
    this.updateInk();
  }

  @logable({ type: 'Click', payload: { name: '监听scroll事件' } })
  handleScroll = () => {
    if (this.animating) {
      return;
    }
    const { offsetTop, bounds } = this.props;
    this.setState({
      activeLink: this.getCurrentAnchor(offsetTop, bounds),
    });
  }

  handleScrollTo = (link) => {
    const { offsetTop, target = getDefaultTarget } = this.props;
    this.animating = true;
    this.setState({ activeLink: link });
    scrollTo(link, offsetTop, target, () => {
      this.animating = false;
    });
  }

  getCurrentAnchor(offsetTop = 0, bounds = 5) {
    let activeLink = '';
    if (typeof document === 'undefined') {
      return activeLink;
    }

    const linkSections = [];
    this.links.forEach(link => {
      const target = document.getElementById(link.substring(1));
      if (target && getOffsetTop(target) < offsetTop + bounds) {
        const top = getOffsetTop(target);
        linkSections.push({
          link,
          top,
        });
      }
    });

    if (linkSections.length) {
      const maxSection = linkSections.reduce((prev, curr) => curr.top > prev.top ? curr : prev);
      return maxSection.link;
    }
    return '';
  }

  updateInk = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const { prefixCls } = this.props;
    const linkNode = ReactDOM.findDOMNode(this).getElementsByClassName(`${prefixCls}-link-title-active`)[0];
    if (linkNode) {
      this.refs.ink.style.top = `${(linkNode).offsetTop + linkNode.clientHeight / 2 - 4.5}px`;
    }
  }

  render() {
    const {
      prefixCls,
      className = '',
      style,
      offsetTop,
      affix,
      showInkInFixed,
      children,
    } = this.props;
    const { activeLink } = this.state;

    const inkClass = classNames(`${prefixCls}-ink-ball`, {
      visible: activeLink,
    });

    const wrapperClass = classNames(className, `${prefixCls}-wrapper`);

    const anchorClass = classNames(prefixCls, {
      'fixed': !affix && !showInkInFixed,
    });

    const anchorContent = (
      <div className={wrapperClass} style={style}>
        <div className={anchorClass}>
          <div className={`${prefixCls}-ink`} >
            <span className={inkClass} ref="ink" />
          </div>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, { activeLink });
          })}
        </div>
      </div>
    );

    return !affix ? anchorContent : (
      <Affix offsetTop={offsetTop}>
        {anchorContent}
      </Affix>
    );
  }
}