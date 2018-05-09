/**
 * Clickable.js 统一封装可点击元素，便于统一日志收集行为
 * @author maoquan(maoquan@htsc.com)
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind, time } from 'core-decorators';

@connect()
export default class Clickable extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    eventName: PropTypes.string,
    payload: PropTypes.object,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventName: '',
    payload: {},
  }

  @autobind
  @time('handleClick')
  handleClick(...args) {
    const { onClick, eventName, payload, dispatch } = this.props;
    if (eventName) {
      dispatch({
        type: eventName,
        payload,
      });
    }
    onClick(...args);
  }

  render() {
    const { children } = this.props;
    const child = React.Children.only(children);
    return (
      <child.type {...child.props} onClick={this.handleClick} />
    );
  }
}
