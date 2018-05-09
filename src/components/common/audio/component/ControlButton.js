/*
 * @Description: 控制按钮
 * @Author: XiaZhiQiang
 * @Date: 2018/2/1 14:12
 * @Last Modified by: XiaZhiQiang
 * @Last Modified time: 2018/2/1 14:12
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PauseIcon from './svg/PauseIcon';
import PlayIcon from './svg/PlayIcon';


export default class ControlButton extends PureComponent {
  static propTypes = {
    isPlay: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    autoplay: false,
    preload: true,
    volume: 0.8,
    onChange() {},
  };

  render() {
    const { isPlay, onChange } = this.props;
    return (
      <button
        onClick={onChange}
        style={{
          transition: '.25s all ease',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#c5c3c3',
          border: 'none',
          cursor: 'pointer',
          zIndex: '10',
          outline: 'none',
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        {
          isPlay ? <PlayIcon /> : <PauseIcon />
        }
      </button>
    );
  }
}
