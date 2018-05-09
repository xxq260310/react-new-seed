/*
 * @Description: 任务反馈新增问题表单
 * @Author: Wangjunjun
 * @path: src/components/taskFeedback/AddQuestionForm.js
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, Input, Select, Button, Icon } from 'antd';

import { questionType } from './config';
import logable from '../../../decorators/logable';
import styles from './addQuestionForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

// 主观题对应的code码
const subjectiveType = '3';

// 表单的布局
const formLayout = 'horizontal';
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 15 },
};
const formItemLayout2 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 5 },
};

// 添加答案按钮的样式
const addStyle = {
  width: '25%',
  fontSize: '12px',
  color: '#108ee9',
};

// 题目的校验规则
const questionTitleRules = [
  { required: true, message: '请输入问题' },
  { max: 30, message: '问题长度不能超过30' },
];
// 问题类型校验规则
const questionTypeRules = [{ required: true, message: '请选择问题类型' }];
// 问题描述校验规则
const questionDescriptionRules = [
  { required: true, message: '请输入问题描述' },
  { max: 200, message: '问题描述长度不能超过200' },
];
// 问题答案校验规则
const answerRules = [
  { required: true, message: '请输入问题答案' },
  { max: 30, message: '答案长度不能超过30' },
];

@Form.create()
export default class AddQuestionForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    ref: PropTypes.func,
  }

  static defaultProps = {
    ref: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      quesDescVisible: false,
    };
    this.uuid = 0;
  }

  componentDidMount() {
    this.props.ref(this.props.form);
    // 初始化增加两个答案输入框
    this.add();
    this.add();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加答案' } })
  add() {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    this.uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  @autobind
  remove(k) {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  /**
   * 问题类型改变
   * quesTypeCode = 3 时主观题描述， 1、 2显示选择题答案
   */
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '问题类型',
      value: '$args[0]',
    },
  })
  handleSelectChange(v) {
    this.setState({
      quesDescVisible: v === subjectiveType,
    });
  }

  /**
   * 生成选择题答案输入框
   */
  createAnswerNode() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    return _.map(keys, (k, index) => (
      <FormItem
        {...formItemLayout}
        label={index === 0 ? '答案' : ' '}
        colon={index === 0}
        required
        key={k}
      >
        {getFieldDecorator(`quesOptions[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: answerRules,
        })(
          <Input placeholder="请输入问题答案" />,
        )}
        {keys.length > 2 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 2}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </FormItem>
    ));
  }

  /**
   * 根据问题的类型判断，渲染选择题的答案或主观题的描述
   */
  @autobind
  renderAnswerNode() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    if (this.state.quesDescVisible) {
      return (
        <FormItem
          label="问题描述"
          {...formItemLayout}
        >
          {getFieldDecorator('quesDesp', {
            rules: questionDescriptionRules,
          })(
            <TextArea placeholder="请输入问题描述" autosize={{ minRows: 2, maxRows: 5 }} />,
          )}
        </FormItem>
      );
    }
    return (
      <div>
        {this.createAnswerNode()}
        <FormItem label=" " colon={false} {...formItemLayout}>
          <Button onClick={this.add} style={addStyle}>
            <Icon type="plus" />添加答案
          </Button>
        </FormItem>
      </div>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const selectOptions = _.map(questionType, obj => <Option
      key={obj.code}
      value={obj.code}
    >
      {obj.name}
    </Option>);
    return (
      <div className={styles.addQuestionForm}>
        <Form layout={formLayout}>
          <FormItem
            label="问题"
            {...formItemLayout}
          >
            {getFieldDecorator('quesValue', {
              rules: questionTitleRules,
            })(
              <Input placeholder="请输入问题" />,
              )}
          </FormItem>
          <FormItem
            label="问题类型"
            {...formItemLayout2}
          >
            {getFieldDecorator('quesTypeCode', {
              rules: questionTypeRules,
              initialValue: questionType[0].code,
            })(
              <Select
                placeholder="请选择问题类型"
                onChange={this.handleSelectChange}
              >
                {selectOptions}
              </Select>,
            )}
          </FormItem>
          {this.renderAnswerNode()}
        </Form>
      </div>
    );
  }
}
