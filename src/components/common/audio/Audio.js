/*
 * @Description: 定制audio react 组件
 * @Author: XiaZhiQiang
 * @Date: 2018/2/1 12:48
 * @Last Modified by: XiaZhiQiang
 * @Last Modified time: 2018/2/1 12:48
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd';
import moment from 'moment';
import { autobind } from 'core-decorators';
import ControlButton from './component/ControlButton';
import styles from './audio.less';
import logable from '../../../decorators/logable';

// currentTime 是否交给滚动条控制
let IS_PROGRESS = false;

export default class Audio extends PureComponent {
  static propTypes = {
    autoPlay: PropTypes.bool,
    src: PropTypes.string,
    volume: PropTypes.number,
  };

  static defaultProps = {
    autoPlay: false,
    volume: 0.8,
    src: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      canPlay: false,  // 是否加载至可开始播放
      playing: false,
      currentTime: 0, // 当前播放时间
    };
  }

  componentWillUnmount() {
    this.setState({
      canPlay: false,
    });
  }

  // 拖动滚动条结束后重新设置音频currentTime -- 兼容问题，暂不支持
  @autobind
  onAfterChange(value) {
    const { canPlay } = this.state;
    IS_PROGRESS = false;
    if (canPlay) {
      const { duration } = this.audio;
      this.audio.currentTime = (value / 100) * duration;
    }
  }

  // 拖动进度条 -- 兼容问题，暂不支持
  @autobind
  progressChange(value) {
    const { canPlay } = this.state;
    if (!IS_PROGRESS) IS_PROGRESS = true;
    if (canPlay) {
      const { duration } = this.audio;
      const currentTime = (value / 100) * duration;
      this.setState({ currentTime });
    }
  }

  // 播放/暂停
  @autobind
  handlePlay() {
    const { canPlay } = this.state;
    if (canPlay) {
      const { paused } = this.audio;
      if (paused) {
        this.handleAudioPlay();
      } else {
        this.handleAudioPause();
      }
    }
  }

  // 播放
  @autobind
  @logable({ type: 'Click', payload: { name: '播放音频$props.volume' } })
  handleAudioPlay() {
    this.audio.play();
    this.setState({
      playing: true,
    });
  }

  // 暂停
  @autobind
  @logable({ type: 'Click', payload: { name: '暂停音频$props.volume' } })
  handleAudioPause() {
    this.audio.pause();
    this.setState({
      playing: false,
    });
  }

  get audio() {
    if (!this.nativeAudio) {
      return {
        duration: 0,
        paused: true, // 默认播放状态为暂停
      };
    }
    return this.nativeAudio;
  }

  // 时间格式化
  handleTimeFormat(audioSeconds) {
    if (!audioSeconds) {
      return '00:00';
    }
    const momentAudioTime = moment('000000', 'hhmmss').add(audioSeconds, 'second');
    if (audioSeconds <= 3600) {
      return momentAudioTime.format('mm:ss');
    }
    return momentAudioTime.format('HH:mm:ss');
  }
  // 当音频可以播放时
  @autobind
  handleAudioCanplay() {
    const { volume } = this.props;
    this.audio.volume = volume;
    this.setState({
      canPlay: true,
    });
  }
  // 当播放位置改变时
  handleTimeUpdate() {
    const { canPlay } = this.state;
    if (canPlay && !IS_PROGRESS) {
      const { paused, currentTime } = this.audio;
      this.setState({
        currentTime,
        playing: !paused,
      });
    }
  }
  // 播放进度
  percent() {
    const { currentTime } = this.state;
    const { duration } = this.audio;
    if (duration === 0 || isNaN(duration)) return 0;
    if (duration === Infinity) return 100;
    return (currentTime / duration) * 100;
  }

  render() {
    const { src, autoPlay } = this.props;
    const { currentTime, playing } = this.state;
    const { duration } = this.audio;
    return (
      <div className={styles.audioContainer}>
        <audio
          preload="auto"
          autoPlay={autoPlay}
          src={src}
          ref={(audio) => { this.nativeAudio = audio; }}
          onCanPlay={() => this.handleAudioCanplay()}
          onTimeUpdate={() => this.handleTimeUpdate()}
        />
        <div className={styles.audioControl}>
          <ControlButton
            isPlay={playing}
            onChange={this.handlePlay}
          />
        </div>
        <div className={styles.currentTime}>
          {
            this.handleTimeFormat(currentTime)
          }
        </div>
        <div className={styles.audioProgress}>
          <Slider
            // onChange={this.progressChange}
            // onAfterChange={this.onAfterChange}
            value={this.percent()}
            tipFormatter={null}
          />
        </div>
        {
          (duration < Infinity) ?
            <div className={styles.currentTime}>
              {
                this.handleTimeFormat(duration)
              }
            </div> : null
        }
      </div>
    );
  }
}
