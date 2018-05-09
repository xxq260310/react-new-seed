/**
 * @file feedback/ProblemDetail.js
 *  问题反馈-问题详情
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Select } from 'antd';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Icon from '../../components/common/Icon';
import { feedbackOptions } from '../../config';
import './problemDetails.less';
import logable from '../../decorators/logable';

const FormItem = Form.Item;
const EMPTY_OBJECT = {};
const feedbackChannel = feedbackOptions.feedbackChannel;
let OPTIONKEY = 0;

@createForm()
export default class ProblemDetail extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    problemDetails: PropTypes.object,
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    nowStatus: PropTypes.bool.isRequired,
    userId: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    userId: '002332',
    problemDetails: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const { problemDetails = EMPTY_OBJECT } = this.props.problemDetails || EMPTY_OBJECT;
    this.state = {
      editValue: true,
      qtab: false,
      qtabHV: false,
      jira: false,
      jiraHV: false,
      processerV: false,
      processerHV: false,
      data: problemDetails,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { problemDetails: preVisible } = this.props;
    const { problemDetails, nowStatus } = nextProps;
    if (problemDetails !== preVisible) {
      this.setState({
        data: preVisible,
        canBeEdited: nowStatus,
      });
      this.handleClose();
    }
  }

  /**
   * 解决状态
  */
  handleStatus = (pop) => {
    if (pop === 'PROCESSING') {
      return (
        <b className="toSolve">解决中</b>
      );
    } else if (pop === 'CLOSED') {
      return (
        <b className="react-close">关闭</b>
      );
    }
    return '--';
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '问题标签' } })
  handleProblemClick(event, type) {
    this.handleShowEdit(event, type);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'Jira编号' } })
  handleJiraNumClick(event, type) {
    this.handleShowEdit(event, type);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '经办人' } })
  handleProcesserClick(event, type) {
    this.handleShowEdit(event, type);
  }

  /**
   * 问题详情编辑
  */
  @autobind
  handleShowEdit(event, type) {
    this.handleClose();
    if (type === 'qt') {
      this.setState({
        qtab: true,
        qtabHV: true,
      });
      return true;
    } else if (type === 'jira') {
      this.setState({
        jira: true,
        jiraHV: true,
      });
      return true;
    } else if (type === 'processer') {
      this.setState({
        processerV: true,
        processerHV: true,
      });
      return true;
    }
    return true;
  }

  // 提交数据
  @autobind
  handleSub() {
    const { form, onCreate } = this.props;
    // this.handleClose();
    onCreate(form);
  }

  /**
   * 数据为空处理
  */
  dataNull(data) {
    if (!_.isEmpty(data) && data !== 'null') {
      return data;
    }
    return '无';
  }
  /**
   * value和label显示转换
  */
  changeDisplay(st, options) {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || EMPTY_OBJECT;
      return nowStatus.label || '无';
    }
    return '无';
  }
  /*
  * 时间截取
  */
  overflowTime(time) {
    if (!_.isEmpty(time) && time.length >= 19) {
      return time.substring(0, 16);
    }
    return time;
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '关闭图标' } })
  handleClose() {
    this.setState({
      qtab: false,
      qtabHV: false,
      jira: false,
      jiraHV: false,
      processerV: false,
      processerHV: false,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '提交图标' } })
  handleSubChange() {
    const { form, onCreate } = this.props;
    onCreate(form);
  }

  render() {
    const { form, problemDetails } = this.props;
    const {
      qtab,
      jira,
      qtabHV,
      jiraHV,
      editValue,
      processerV,
      processerHV,
      canBeEdited,
    } = this.state;

    const {
      functionName,
      createTime,
      processer,
      version,
      jiraId,
      status,
      tag,
    } = problemDetails || EMPTY_OBJECT;

    const { getFieldDecorator } = form;
    const value = true;
    const qtValue = classnames({
      value,
      editable_field: true,
      value_hide: qtab,
      editValue,
    });
    const qtHiddenValue = classnames({
      hidden_value: true,
      edit_show: qtabHV,
    });
    const jiraValue = classnames({
      value,
      editable_field: true,
      value_hide: jira,
    });
    const jiraHiddenValue = classnames({
      hidden_value: true,
      edit_show: jiraHV,
    });
    const processerValue = classnames({
      value,
      editable_field: true,
      value_hide: processerV,
    });
    const processerHiddenValue = classnames({
      hidden_value: true,
      edit_show: processerHV,
    });
    const valueIsVisibel = classnames({
      value,
      value_hide: canBeEdited,
    });
    const editIsVisibel = classnames({
      eitbox: true,
      edit_show: canBeEdited,
    });

    const allOperatorOptions = feedbackOptions.allOperatorOptions;
    const questionTagOptions = feedbackOptions.questionTagOptions;
    const getSelectOption = item => item.map(i =>
      <Option key={`optionKey${OPTIONKEY++}`} value={i.value}>{i.label}</Option>,
    );
    const channel = _.flattenDeep(_.map(feedbackChannel, obj => obj.children));

    return (
      <div>
        <Form layout="vertical">
          <ul className="property_list clearfix">
            <li className="item">
              <div className="wrap value_word">
                <strong className="name">模块：</strong>
                <span className="value">{this.changeDisplay(functionName, channel)}</span>
              </div>
            </li>
            <li className="item item-right">
              <div className="wrap value_word">
                <strong className="name">反馈时间：</strong>
                <span className="value tiem-orient">{this.dataNull(this.overflowTime(createTime))}</span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">系统版本号：</strong>
                <span className="value">{this.dataNull(version)}</span>
              </div>
            </li>
            <li className="item item-right">
              <div className="wrap value_word">
                <strong className="name">状态：</strong>
                <span className="value">
                  {this.dataNull(this.handleStatus(status))}
                </span>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">问题标签：</strong>
                <span className={valueIsVisibel}>
                  {this.changeDisplay(tag, questionTagOptions)}
                </span>
                <div className={editIsVisibel}>
                  <span className={qtValue} onClick={event => this.handleProblemClick(event, 'qt')} title="点击编辑">
                    {this.changeDisplay(tag, questionTagOptions)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={qtHiddenValue} id="select-tag">
                  <FormItem>
                    {getFieldDecorator('tag', { initialValue: `${this.dataNull(tag)}` })(
                      <Select style={{ width: 110 }} className="qtSelect" id="qtSelect" getPopupContainer={() => document.getElementById('select-tag')}>
                        {getSelectOption(questionTagOptions)}
                      </Select>,
                    )}
                    <div className="edit-btn">
                      <a onClick={this.handleSubChange}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
            <li className="item item-right">
              <div className="wrap">
                <strong className="name">Jira编号：</strong>
                <span className={valueIsVisibel}>
                  {this.dataNull(jiraId)}
                </span>
                <div className={editIsVisibel}>
                  <span className={jiraValue} onClick={event => this.handleJiraNumClick(event, 'jira')} title="点击编辑">
                    {this.dataNull(jiraId)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={jiraHiddenValue}>
                  <FormItem>
                    {getFieldDecorator('jiraId', { initialValue: `${jiraId || ''}` })(
                      <Input style={{ width: 120 }} />,
                    )}
                    <div className="edit-btn">
                      <a onClick={this.handleSubChange}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
            <li className="item">
              <div className="wrap">
                <strong className="name">经办人：</strong>
                <span className={valueIsVisibel}>
                  {this.changeDisplay(processer, allOperatorOptions)}
                </span>
                <div className={editIsVisibel}>
                  <span className={processerValue} onClick={event => this.handleProcesserClick(event, 'processer')} title="点击编辑">
                    {this.changeDisplay(processer, allOperatorOptions)}
                    <Icon type="edit" className="anticon-edit" />
                  </span>
                </div>
                <div className={processerHiddenValue} id="select-processer">
                  <FormItem>
                    {getFieldDecorator('processer', { initialValue: `${this.dataNull(processer)}` })(
                      <Select style={{ width: 110 }} className="qtSelect" getPopupContainer={() => document.getElementById('select-processer')}>
                        {getSelectOption(allOperatorOptions)}
                      </Select>,
                    )}
                    <div className="edit-btn">
                      <a onClick={this.handleSubChange}><Icon type="success" /></a>
                      <a onClick={this.handleClose}><Icon type="close" /></a>
                    </div>
                  </FormItem>
                </div>
              </div>
            </li>
          </ul>
        </Form>
      </div>
    );
  }
}

