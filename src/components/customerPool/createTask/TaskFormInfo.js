/**
 * @file customerPool/TaskFormInfo.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input, Mention, InputNumber } from 'antd';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { stateToHTML } from 'draft-js-export-html';
import { autobind } from 'core-decorators';
import { regxp } from '../../../helper';
import styles from './createTaskForm.less';
import logable from '../../../decorators/logable';

const FormItem = Form.Item;
const Option = Select.Option;
const { toContentState, toString } = Mention;
const Nav = Mention.Nav;

const PREFIX = ['$'];
const mentionTextStyle = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};
// 字数限制，最大长度和最小长度
const MAX_LENGTH = 1000;

@createForm()
export default class TaskFormInfo extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    defaultMissionName: PropTypes.string.isRequired,
    defaultMissionType: PropTypes.string.isRequired,
    defaultExecutionType: PropTypes.string,
    defaultMissionDesc: PropTypes.string.isRequired,
    defaultServiceStrategySuggestion: PropTypes.string,
    defaultInitialValue: PropTypes.number,
    defaultTaskSubType: PropTypes.string,
    users: PropTypes.array.isRequired,
    taskTypes: PropTypes.array,
    executeTypes: PropTypes.array,
    isShowErrorInfo: PropTypes.bool,
    isShowErrorTaskType: PropTypes.bool,
    isShowErrorExcuteType: PropTypes.bool,
    isShowErrorTaskSubType: PropTypes.bool,
    isShowErrorIntervalValue: PropTypes.bool,
    isShowErrorStrategySuggestion: PropTypes.bool,
    isShowErrorTaskName: PropTypes.bool,
  }

  static defaultProps = {
    taskTypes: [],
    executeTypes: [],
    defaultServiceStrategySuggestion: '',
    defaultInitialValue: null,
    defaultTaskSubType: '',
    isShowErrorInfo: false,
    isShowErrorTaskType: false,
    isShowErrorExcuteType: false,
    isShowErrorTaskSubType: false,
    defaultExecutionType: '',
    isShowErrorIntervalValue: false,
    isShowErrorStrategySuggestion: false,
    isShowErrorTaskName: false,
  }

  constructor(props) {
    super(props);
    // 用来处理页面一进来会触发mentionChange事件
    this.isFirstLoad = true;
    this.isServiceFirstLoad = true;
    // 找到默认任务类型的子类型集合
    const currentTaskSubTypeCollection = this.getCurrentTaskSubTypes(props.defaultMissionType);
    const {
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorInfo,
      isShowErrorTaskSubType,
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
     } = props;
    this.state = {
      suggestions: [],
      inputValue: '',
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorTaskSubType,
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
      taskSubTypes: currentTaskSubTypeCollection,
      currentMention: toContentState(props.defaultMissionDesc || ''),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isShowErrorInfo: nextError,
      isShowErrorExcuteType: nextExcuteTypeError,
      isShowErrorTaskType: nextTaskTypeError,
      isShowErrorTaskSubType: nextTaskSubTypeError,
      isShowErrorIntervalValue: nextErrorIntervalValue,
      isShowErrorTaskName: nextErrorTaskName,
      isShowErrorStrategySuggestion: nextErrorStrategySuggestion,
    } = nextProps;
    const {
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorTaskSubType,
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
     } = this.props;

    if (nextError !== isShowErrorInfo) {
      this.setState({
        isShowErrorInfo: nextError,
      });
    }
    if (nextExcuteTypeError !== isShowErrorExcuteType) {
      this.setState({
        isShowErrorExcuteType: nextExcuteTypeError,
      });
    }
    if (nextTaskTypeError !== isShowErrorTaskType) {
      this.setState({
        isShowErrorTaskType: nextTaskTypeError,
      });
    }
    if (nextTaskSubTypeError !== isShowErrorTaskSubType) {
      this.setState({
        isShowErrorTaskSubType: nextTaskSubTypeError,
      });
    }
    if (nextErrorIntervalValue !== isShowErrorIntervalValue) {
      this.setState({
        isShowErrorIntervalValue: nextErrorIntervalValue,
      });
    }
    if (nextErrorStrategySuggestion !== isShowErrorStrategySuggestion) {
      this.setState({
        isShowErrorStrategySuggestion: nextErrorStrategySuggestion,
      });
    }
    if (nextErrorTaskName !== isShowErrorTaskName) {
      this.setState({
        isShowErrorTaskName: nextErrorTaskName,
      });
    }
  }

  getCurrentTaskSubTypes(currentMissionType) {
    const { taskTypes } = this.props;
    const currentTaskTypeCollection = _.find(taskTypes, item =>
      item.key === currentMissionType) || {};
    let currentTaskSubTypeCollection = [{}];
    if (!_.isEmpty(currentTaskTypeCollection) && !_.isEmpty(currentTaskTypeCollection.children)) {
      currentTaskSubTypeCollection = currentTaskTypeCollection.children;
    }
    return currentTaskSubTypeCollection;
  }

  @autobind
  getData(isStateData) {
    if (isStateData) {
      return this.state.currentMention;
    }
    return toString(this.state.currentMention);
  }

  @autobind
  handleMentionChange(contentState) {
    if (!this.isFirstLoad) {
      let isShowErrorInfo = false;
      const content = stateToHTML(contentState);
      // content即使是空字符串经过stateToHTML方法也会变成带有标签的字符串，所以得用转成字符串之后的值来进行非空判断
      const contentString = toString(contentState);
      // 这边判断长度是用经过stateToHTML方法的字符串进行判断，是带有标签的，所以实际长度和看到的长度会有出入，测试提问的时候需要注意
      if (_.isEmpty(contentString)
          || content.length > MAX_LENGTH) {
        isShowErrorInfo = true;
      }

      this.setState({
        currentMention: contentState,
        isShowErrorInfo,
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '任务类型:',
      value: '$args[0]',
    },
  })
  handleTaskTypeChange(value) {
    if (!_.isEmpty(value) && value !== '请选择' && value !== '暂无数据') {
      const currentTaskSubTypeCollection = this.getCurrentTaskSubTypes(value);
      this.setState({
        isShowErrorTaskType: false,
        taskSubTypes: currentTaskSubTypeCollection,
      });
    } else {
      this.setState({
        isShowErrorTaskType: true,
        taskSubTypes: [{
          key: '请选择任务子类型',
          value: '请选择任务子类型',
        }],
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '执行方式',
      value: '$args[0]',
    },
  })
  handleExcuteTypeChange(value) {
    this.setState({
      isShowErrorExcuteType: _.isEmpty(value) || value === '请选择' || value === '暂无数据',
    });
  }

  @autobind
  handleTaskSubTypeChange(value) {
    this.setState({
      isShowErrorTaskSubType: _.isEmpty(value) || value === '请选择' || value === '暂无数据',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '任务提示' } })
  handleSearchChange(value, trigger) {
    const { users } = this.props;
    const searchValue = value.toLowerCase();
    const dataSource = _.includes(PREFIX, trigger) ? users : {};
    const filtered = dataSource.filter(item =>
      item.name.toLowerCase().indexOf(searchValue) !== -1,
    );
    const suggestions = filtered.map(suggestion => (
      <Nav
        value={suggestion.type}
        data={suggestion}
      >
        <span>{suggestion.name}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  @autobind
  handleMentionBlur() {
    this.isFirstLoad = false;
  }

  @autobind
  handleServiceMentionBlur() {
    this.isServiceFirstLoad = false;
  }

  @autobind
  handleIntervalValueChange(value) {
    const isShowErrorIntervalValue = !regxp.positiveInteger.test(value)
      || Number(value) <= 0
      || Number(value) > 365;
    this.setState({
      isShowErrorIntervalValue,
    });
  }

  @autobind
  handleMissionNameChange(e) {
    const value = e.target.value;
    this.setState({
      isShowErrorTaskName: _.isEmpty(value) || value.length > 30,
    });
  }

  @autobind
  handleStrategySuggestionChange(contentState) {
    if (!this.isServiceFirstLoad) {
      const content = toString(contentState);
      const value = stateToHTML(contentState);
      this.setState({
        isShowErrorStrategySuggestion: _.isEmpty(content)
        || value.length > MAX_LENGTH,
      });
    }
  }

  handleCreatOptions(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }

  handleCreateTaskSubType(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`subTask_${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }

  renderMention() {
    const { defaultMissionDesc } = this.props;
    const { suggestions } = this.state;

    return (
      <div className={styles.wrapper}>
        <Mention
          mentionStyle={mentionTextStyle}
          style={{ width: '100%', height: 100 }}
          placeholder="请在描述客户经理联系客户前需要了解的客户相关信息，比如持仓情况。"
          prefix={PREFIX}
          onSearchChange={this.handleSearchChange}
          suggestions={suggestions}
          getSuggestionContainer={() => this.fatherMention}
          multiLines
          defaultValue={toContentState(defaultMissionDesc)}
          onChange={this.handleMentionChange}
          onBlur={this.handleMentionBlur}
        />
        {/* <span className={styles.insert}>插入参数</span> */}
      </div>
    );
  }

  renderTipSection() {
    return (
      <div className={styles.info}>
        如果要在任务提示中包含对应每个客户的属性数值，可以用 $xx 插入参数，比如 $已开通业务。注意“ $ ”前要有空格。
      </div>
    );
  }

  render() {
    const {
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      // isShowErrorTaskSubType,
      // taskSubTypes,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
    } = this.state;
    const {
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultServiceStrategySuggestion,
      defaultInitialValue,
      taskTypes,
      executeTypes,
      form,
      // defaultTaskSubType,
    } = this.props;

    const { getFieldDecorator } = form;

    const errorProps = isShowErrorInfo ? {
      validateStatus: 'error',
      help: `任务提示不能为空，最多${MAX_LENGTH}个汉字`,
    } : null;

    const taskTypeErrorSelectProps = isShowErrorTaskType ? {
      validateStatus: 'error',
      help: '请选择任务类型',
    } : null;

    // const taskSubTypeErrorSelectProps = isShowErrorTaskSubType ? {
    //   hasFeedback: true,
    //   validateStatus: 'error',
    //   help: '请选择任务子类型',
    // } : null;

    const excuteTypeErrorSelectProps = isShowErrorExcuteType ? {
      validateStatus: 'error',
      help: '请选择执行方式',
    } : null;

    const taskNameErrorProps = isShowErrorTaskName ? {
      validateStatus: 'error',
      help: '任务名称不能为空，最多30个字符',
    } : null;

    const timelyIntervalValueErrorProps = isShowErrorIntervalValue ? {
      validateStatus: 'error',
      help: '有效期只能为正整数，不能超过365天',
    } : null;

    const serviceStrategySuggestionErrorProps = isShowErrorStrategySuggestion ? {
      validateStatus: 'error',
      help: `服务策略不能为空，最多${MAX_LENGTH}个汉字`,

    } : null;

    return (
      <Form>
        <ul className={styles.task_selectList}>
          {/**
           * 任务名称
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务名称:</label>
            <FormItem
              wrapperCol={{ span: 12 }}
              {...taskNameErrorProps}
            >
              {getFieldDecorator('taskName',
                {
                  initialValue: defaultMissionName,
                })(<Input
                  placeholder="请输入任务名称"
                  onChange={this.handleMissionNameChange}
                />)}
            </FormItem>
          </li>
          {/**
           * 任务类型
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务类型:</label>
            {
              !_.isEmpty(taskTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskTypeErrorSelectProps}
                >
                  {getFieldDecorator('taskType',
                    {
                      initialValue: defaultMissionType,
                    })(<Select
                      onChange={this.handleTaskTypeChange}
                    >
                      {this.handleCreatOptions(taskTypes)}
                    </Select>,
                  )}
                </FormItem>
                :
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskTypeErrorSelectProps}
                >
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0">暂无数据</Option>
                  </Select>
                </FormItem>
            }
          </li>
          {/**
           * 任务子类型
           */}
          {/* <li>
            <label htmlFor="dd" className={styles.task_label}>
            <i className={styles.required_i}>*</i>任务子类型</label>
            {
              !_.isEmpty(taskSubTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskSubTypeErrorSelectProps}
                >
                  {getFieldDecorator('taskSubType',
                    {
                      initialValue: defaultTaskSubType,
                    })(<Select onChange={this.handleTaskSubTypeChange}>
                      {this.handleCreateTaskSubType(taskSubTypes)}
                    </Select>,
                  )}
                </FormItem>
                :
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskSubTypeErrorSelectProps}
                >
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0">暂无数据</Option>
                  </Select>
                </FormItem>
            }
          </li> */}
          {/**
           * 执行方式
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>执行方式:</label>
            {
              !_.isEmpty(executeTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...excuteTypeErrorSelectProps}
                >
                  {getFieldDecorator('executionType',
                    {
                      initialValue: defaultExecutionType,
                    })(<Select onChange={this.handleExcuteTypeChange}>
                      {this.handleCreatOptions(executeTypes)}
                    </Select>,
                  )}
                </FormItem>
                :
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...excuteTypeErrorSelectProps}
                >
                  <Select defaultValue="暂无数据">
                    <Option key="null" value="0">暂无数据</Option>
                  </Select>
                </FormItem>
            }
          </li>
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>有效期(天):</label>
            <FormItem
              wrapperCol={{ span: 12 }}
              className={styles.timelyIntervalValueItem}
              {...timelyIntervalValueErrorProps}
            >
              {getFieldDecorator('timelyIntervalValue',
                {
                  initialValue: defaultInitialValue,
                })(<InputNumber
                  step={1}
                  min={0}
                  max={365}
                  style={{ width: '100%' }}
                  onChange={this.handleIntervalValueChange}
                />)}
            </FormItem>
            {/* <div className={styles.tip}>有效期自任务审批通过后开始计算</div> */}
          </li>
        </ul>
        <div className={styles.task_textArea}>
          <p>
            <label htmlFor="desc"><i>*</i>服务策略:<br />（适用于所有客户）</label>
          </p>
          <FormItem
            {...serviceStrategySuggestionErrorProps}
          >
            {getFieldDecorator('serviceStrategySuggestion', {
              initialValue: toContentState(defaultServiceStrategySuggestion),
            })(
              <Mention
                mentionStyle={mentionTextStyle}
                style={{ width: '100%', height: 100 }}
                placeholder="请在此介绍该新建任务的服务策略，以指导客户经理或投顾实施任务。"
                multiLines
                onChange={this.handleStrategySuggestionChange}
                onBlur={this.handleServiceMentionBlur}  // 处理首次进入触发onChange
              />,
            )}
          </FormItem>
        </div>
        <div
          className={styles.task_textArea}
          ref={
            (ref) => {
              // ref多次重绘可能是null, 这里要判断一下
              if (!this.fatherMention && ref) {
                this.fatherMention = ref;
              }
            }
          }
        >
          <p>
            <label htmlFor="desc"><i>*</i>任务提示:</label>
          </p>
          <FormItem
            {...errorProps}
          >
            {
              this.renderMention()
            }
            {
              this.renderTipSection()
            }
          </FormItem>
        </div>
      </Form >
    );
  }
}

