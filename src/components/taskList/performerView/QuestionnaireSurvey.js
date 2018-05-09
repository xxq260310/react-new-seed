/**
 * @fileOverview components/customerPool/PerformerViewDetail.js
 * @author wangjunjun
 * @description 执行者视图右侧详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Button, Radio, Checkbox, Input, Form } from 'antd';
import _ from 'lodash';

import logable from '../../../decorators/logable';
import styles from './questionnaireSurvey.less';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const FormItem = Form.Item;

// 后台返回题目类型
const TYPE = {
  radioType: '1',
  checkboxType: '2',
  textAreaType: '3',
};
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

export default class QuestionnaireSurvey extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCheckChange: PropTypes.func.isRequired,
    onRadioChange: PropTypes.func.isRequired,
    onAreaText: PropTypes.func.isRequired,
    answersList: PropTypes.object,
    isShowErrorCheckbox: PropTypes.object.isRequired,
  }

  static defaultProps = {
    answersList: {},
    isShowErrorCheckbox: {},
  };

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handleRidoChange(event) {
    this.props.onRadioChange(event);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handleCheckChange(keyIndex, quesId) {
    this.props.onCheckChange(keyIndex, quesId);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleOk() {
    this.props.onOk();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleCancel() {
    this.props.onCancel();
  }

  // 根据返回的问题列表，判断不同类型显示
  @autobind
  renderOption() {
    const {
      form,
      answersList,
      onAreaText,
      isShowErrorCheckbox,
    } = this.props;
    const { quesInfoList = EMPTY_ARRAY, answerVOList = EMPTY_ARRAY } = answersList;
    const isDisabled = !_.isEmpty(answerVOList);
    const { getFieldDecorator } = form;
    let content = null;
    const itemForm = _.isEmpty(quesInfoList) ? null : _.map(quesInfoList, (item, key) => {
      const { quesId } = item;
      // 自定义多选题校验
      const CheckboxErrorProps = isShowErrorCheckbox[quesId] ? {
        validateStatus: 'error',
        help: '此答案不能为空，请选择你的选项',
      } : null;

      // 判断是否已回答问卷
      const answerData = _.find(answerVOList, o => o.quesId === quesId) || EMPTY_OBJECT;

      // 已回答则查询该问题答案
      if (item.quesTypeCode === TYPE.radioType) {
        // 设置该问题默认值
        const defaultData = answerData.answerdIds || EMPTY_ARRAY;

        content = (<FormItem key={quesId}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData[0] || '',
            rules: [{ required: true, message: '此答案不能为空，请选择你的选项' }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <RadioGroup
                name={item.quesTypeCode}
                className={styles.radioGroup}
                onChange={this.handleRidoChange}
                defaultValue={defaultData[0] || ''}
              >
                {
                  item.optionInfoList.map(childItem =>
                    <Radio
                      value={childItem.optionId}
                      dataVale={childItem.optionValue}
                      className={styles.radioOption}
                      dataQuesId={quesId}
                      key={childItem.optionId}
                      disabled={isDisabled}
                    >
                      {childItem.optionValue}
                    </Radio>)
                }
              </RadioGroup>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.checkboxType) {
        const defaultData = _.map(answerData.answerdIds, (childVal) => {
          // 拼接字符串
          const checkedData = _.find(item.optionInfoList, count => count.optionId === childVal);
          const values = `${checkedData.optionValue}+-+${childVal}+-+${quesId}`;
          return values;
        }) || [];
        content = (<FormItem key={quesId} {...CheckboxErrorProps}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData,
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <CheckboxGroup
                style={{ width: '100%' }}
                className={styles.radioGroup}
                onChange={keyIndex => this.handleCheckChange(keyIndex, quesId)}
                defaultValue={defaultData}
              >
                {
                  item.optionInfoList.map(childItem => <Checkbox
                    value={`${childItem.optionValue}+-+${childItem.optionId}+-+${quesId}`}
                    className={styles.radioOption}
                    key={childItem.optionId}
                    disabled={isDisabled}
                  >
                    {childItem.optionValue}
                  </Checkbox>)
                }
              </CheckboxGroup>
            </div>,
          )}
        </FormItem>);
      } else if (item.quesTypeCode === TYPE.textAreaType) {
        const defaultData = answerData.answertext || '';

        content = (<FormItem key={quesId}>
          {getFieldDecorator(String(quesId), {
            initialValue: defaultData,
            rules: [{
              required: true, max: 250, min: 10, message: '问题答案不能小于10个字符，最多250个字符',
            }],
          })(
            <div className={styles.radioContent}>
              <p>{key + 1}.{item.quesValue}</p>
              <TextArea
                rows={4}
                className={styles.radioGroup}
                onChange={onAreaText}
                data={quesId}
                defaultValue={defaultData}
                placeholder={item.quesDesp}
                disabled={isDisabled}
                maxLength={250}
                minLength={10}
              />
            </div>,
          )}
        </FormItem>);
      }
      return content;
    });
    return itemForm;
  }

  render() {
    const {
      visible,
      answersList,
    } = this.props;
    const { answerVOList } = answersList;
    // 已回答则显示确定按钮，否则显示提交
    const showBtn = _.isEmpty(answerVOList) ?
      (<Button key="submit" type="primary" onClick={_.debounce(this.handleOk, 300, { leading: true })}>
        提交
      </Button>) :
      (<Button key="ok" type="primary" onClick={this.handleCancel}>
        确定
      </Button>);
    return (
      <div>
        <Modal
          title="问卷调查"
          visible={visible}
          onCancel={this.handleCancel}
          width={650}
          className={styles.question}
          footer={[showBtn]}
        >
          <Form layout="vertical">
            {this.renderOption()}
          </Form>
        </Modal>
      </div>
    );
  }
}
