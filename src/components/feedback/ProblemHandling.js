/**
 * @file feedback/ProblemHandling.js
 *  问题反馈-解决弹窗
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Col, Input, Form, Modal, message, Upload } from 'antd';
import { createForm } from 'rc-form';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { emp } from '../../helper';
import Icon from '../common/Icon';
import uploadRequest from '../../utils/uploadRequest';
import { feedbackOptions, request } from '../../config';
import './problemHandling.less';
import logable from '../../decorators/logable';

let COUNT = 0;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Dragger = Upload.Dragger;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
@createForm()
export default class ProblemHandling extends PureComponent {
  static propTypes = {
    popContent: PropTypes.string,
    title: PropTypes.string,
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    width: PropTypes.string,
    problemDetails: PropTypes.object.isRequired,
    inforTxt: PropTypes.string,
  }
  static defaultProps = {
    popContent: ' ',
    title: '问题处理',
    inforTxt: '处理问题表示对此问题做出判断处理。',
    width: '620px',
  }
  constructor(props) {
    super(props);
    const questionTagOptions = feedbackOptions.questionTagOptions || EMPTY_LIST;
    const stateOptions = feedbackOptions.stateOptions || EMPTY_LIST;
    const { problemDetails = EMPTY_OBJECT } = props;
    this.state = {
      uploadKey: `uploadHandkey${COUNT++}`,
      newDetails: problemDetails,
      popQuestionTagOptions: questionTagOptions,
      stateOptions,
      uploadPops: {
        name: 'file',
        multiple: true,
        showUploadList: true,
        data: {
          empId: emp.getId(),
        },
        action: `${request.prefix}/file/feedbackFileUpload`,
        onChange: this.handleUploadFile,
        customRequest: this.fileCustomRequest,
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    const { problemDetails: preData = EMPTY_OBJECT } = this.props;
    const { problemDetails: nextData = EMPTY_OBJECT } = nextProps;
    if (nextData !== preData) {
      this.setState({
        newDetails: nextData,
        uploadKey: `uploadHandkey${COUNT++}`,
      });
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上传附件' } })
  handleUploadFile(info) {
    const file = info.file;
    const status = file.status;
    const response = file.response || {};
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (status === 'error') {
      const msg = _.isEmpty(response.msg) ? '文件上传失败' : response.msg;
      message.error(`${msg}.`);
    }
    return true;
  }

  // 数据提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubChange() {
    const { form, onCreate } = this.props;
    onCreate(form);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    this.props.onCancel();
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  render() {
    const {
      inforTxt,
      visible,
      title,
      width,
      form,
    } = this.props;
    const {
      popQuestionTagOptions,
      uploadPops,
      uploadKey,
      newDetails,
    } = this.state;
    const {
      processer,
      status,
      tag,
      id,
    } = newDetails;
    const { getFieldDecorator } = form;
    const getSelectOption = item => item.map(i =>
      <Option key={i.value} value={i.value}>{i.label}</Option>,
    );
    const allOperatorOptions = feedbackOptions.allOperatorOptions;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleSubChange}
        onCancel={this.handleCancel}
        width={width}
        className="problemwrap"
        key={uploadKey}
        okText="提交"
      >
        <div className="problembox react-app">
          <div className="pro_title">
            <Icon type="tishi" className="tishi" />
            {inforTxt}
          </div>
          <div className="list_box">
            <Form layout="vertical">
              <Row>
                <Col span="4"><div className="am_label">问题标签：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('tag', { initialValue: `${tag || '无'}` })(
                      <Select style={{ width: 220 }}>
                        {getSelectOption(popQuestionTagOptions)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="am_label">状态：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('status', { initialValue: `${title === '重新打开' ? 'PROCESSING' : status}` })(
                      <Select style={{ width: 220 }}>
                        <Option value="PROCESSING">解决中</Option>
                        <Option value="CLOSED">关闭</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="am_label">经办人：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('processer', {
                      initialValue: `${_.isEmpty(processer) ? '请选择' : processer}`,
                    })(
                      <Select style={{ width: 220 }}>
                        {getSelectOption(allOperatorOptions)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="am_label">处理意见：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('processSuggest')(
                      <TextArea rows={5} style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="4"><div className="am_label">附件：</div></Col>
                <Col span="19" offset={1}>
                  <FormItem>
                    {getFieldDecorator('uploadedFiles')(
                      <Dragger
                        {...uploadPops}
                      >
                        <div className="upload_txt">
                          + 上传附件
                        </div>
                      </Dragger>,
                    )},
                  </FormItem>
                </Col>
              </Row>
              <div style={{ display: 'none' }}>
                <FormItem>
                  {getFieldDecorator('id', { initialValue: `${id}` })(
                    <Input type="hidden" />,
                  )}
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

