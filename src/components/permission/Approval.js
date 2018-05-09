import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import TextareaComponent from '../common/textareacomponent';
import style from './approval.less';

export default class Approval extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    head: PropTypes.string.isRequired,
    textValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEmitEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    textValue: '',
  }

  @autobind
  changeTextValue(value) {
    this.props.onEmitEvent(this.props.type, value);
  }

  render() {
    return (
      <div className={style.approval}>
        <InfoTitle head={this.props.head} />
        <TextareaComponent
          title="审批意见"
          value={this.props.textValue}
          onEmitEvent={this.changeTextValue}
        />
      </div>
    );
  }
}
