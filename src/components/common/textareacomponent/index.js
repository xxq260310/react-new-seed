import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './style.less';

export default class TextareaComponent extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: '',
    placeholder: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // textarea中的value值
      value: '',
    };
  }

  componentWillMount() {
    this.setState({ value: this.props.value });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ value: newProps.value });
  }

  @autobind
  changeTextValue(e) {
    // 触发事件， 向上传递
    this.props.onEmitEvent(e.target.value);
  }

  render() {
    return (
      <div className={style.approvalContent}>
        <span className={style.approvalContentTitle}>{this.props.title}：</span>
        <div className={style.approvalContentText}>
          <textarea
            className={style.acTextarea}
            value={this.state.value}
            onChange={this.changeTextValue}
            placeholder={this.props.placeholder}
          />
        </div>
      </div>
    );
  }
}
