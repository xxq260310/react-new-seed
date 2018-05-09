/**
 * Created By K0170179 on 2018/1/26
 * 文字滚动
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './marquee.less';

let intervalId;
export default class Marquee extends PureComponent {
  static propTypes = {
    content: PropTypes.node.isRequired,
    speed: PropTypes.number,
  };

  static defaultProps = {
    speed: 20,
  };

  componentDidMount() {
    const { speed } = this.props;
    const wrapRef = this.wrapRef;
    const wrapStyle = wrapRef.style;
    const contentRef = this.contentRef;
    const itemWidth = contentRef.offsetWidth;
    let wrapLeftNum = 0;
    function marqueeMachine() {
      if (itemWidth === wrapLeftNum) {
        wrapLeftNum = 0;
      }
      wrapStyle.left = `-${wrapLeftNum++}px`;
    }

    intervalId = setInterval(marqueeMachine, speed);
    wrapRef.onmouseover = function StartScroll() {
      clearInterval(intervalId);
    };

    wrapRef.onmouseout = function StopScroll() {
      intervalId = setInterval(marqueeMachine, speed);
    };
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  render() {
    const { content } = this.props;
    return (
      <div className={styles.container}>
        <div ref={(c) => { this.wrapRef = c; }} className={styles.wrap}>
          <div ref={(c) => { this.contentRef = c; }} className={styles.item}>
            {content}
          </div>
          <div>
            {content}
          </div>
        </div>
      </div>
    );
  }
}
