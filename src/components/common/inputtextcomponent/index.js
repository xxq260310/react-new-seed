import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './style.less';

export default class InputTextComponent extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: '',
    placeholder: '',
  }

  constructor() {
    super();
    this.state = {
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
  changeValue(e) {
    this.props.onEmitEvent(e.target.value);
  }

  render() {
    return (
      <input
        type="text"
        value={this.state.value}
        className={style.inputText}
        placeholder={this.props.placeholder}
        onChange={this.changeValue}
      />
    );
  }
}
