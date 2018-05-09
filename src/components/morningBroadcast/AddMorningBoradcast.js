/**
 * Created By K0170179 on 2018/1/16
 * 新增晨报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Upload, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { request } from '../../config/index';
import { emp } from '../../helper/index';
import logable from '../../decorators/logable';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
// 新建晨报时标记晨报id为-1
const createNewsId = -1;

/**
 * 日志：表单提交类型
 * @param ctx AddMorningBoradcast 组件实例
 * @returns {string} 提交表格描述
 */
// function submitTypeName(ctx) {
//   const { newsId } = ctx.props;
//   if (newsId !== createNewsId) {
//     return '修改晨报详情';
//   }
//   return '新建晨报';
// }

@Form.create()
export default class AddMorningBoradcast extends PureComponent {
  static propTypes = {
    creator: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    newsId: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    boradcastDetail: PropTypes.object.isRequired,
    saveboradcastInfo: PropTypes.object.isRequired,
    delSourceFile: PropTypes.object.isRequired,
    newUuid: PropTypes.array.isRequired,
    handleOk: PropTypes.func.isRequired,
    onHandleGetList: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    saveBoradcast: PropTypes.func.isRequired,
    getUuid: PropTypes.func.isRequired,
    delCeFile: PropTypes.func.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    uploaderFile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      audioFileList: [],
      audioError: true, // audioFile 校验
      otherFileList: [],
      finalNewUuid: [],
      isUpdateFile: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { saveboradcastInfo,
      handleOk,
      onHandleGetList,
      visible,
      delSourceFile,
      newUuid,
    } = this.props;
    const { newsId, boradcastDetail, getBoradcastDetail } = nextProps;
    const nextInfo = nextProps.saveboradcastInfo;
    const { finalNewUuid } = this.state;
    const { resetFields } = this.props.form;
    // 打开模态框
    if (!visible && nextProps.visible) {
      // 打开模态框即初始化表单
      this.resetState();
      resetFields();
      if (newsId !== createNewsId) {
        const itemDetail = boradcastDetail[newsId];
        if (!itemDetail) {
          getBoradcastDetail({ newsId });
        } else {
          this.setSourceValue(itemDetail);
        }
      } else {
        // 新建时参数
        this.setState({ finalNewUuid: newUuid });
      }
    }
    // 获取晨报详情
    if (boradcastDetail[newsId] && boradcastDetail !== this.props.boradcastDetail) {
      const itemDetail = boradcastDetail[newsId];
      this.setSourceValue(itemDetail);
    }
    // 新增或修改晨报
    if (saveboradcastInfo !== nextInfo) {
      if (nextInfo.resultData === 'success') {
        this.resetState();
        if (this.formWrapRef) {
          this.formWrapRef.scrollTop = 0;
        }
        handleOk(resetFields);
        message.success('操作成功', 1);
        onHandleGetList(null, true);
      }
    }
    // 删除文件
    if (delSourceFile !== nextProps.delSourceFile) {
      const audioSource = nextProps.delSourceFile[finalNewUuid[0]];
      const otherSource = nextProps.delSourceFile[finalNewUuid[1]];
      if (audioSource) {
        this.setState({
          audioFileList: this.resourceToUpload(audioSource, finalNewUuid[0]),
        });
      } else if (otherSource) {
        message.info('删除文件成功');
        this.setState({
          otherFileList: this.resourceToUpload(otherSource, finalNewUuid[1]),
          isUpdateFile: true,
        });
      }
    }
  }

  @autobind()
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  onHandleCancel() {
    const { handleCancel, newsId, uploaderFile, getUuid } = this.props;
    const { isUpdateFile } = this.state;
    if (this.formWrapRef) {
      this.formWrapRef.scrollTop = 0;
    }
    if (isUpdateFile) {
      uploaderFile({ newsId });
    }
    if (newsId === createNewsId) {
      getUuid();
    }
    handleCancel();
  }

  // audio upload --> start
  onAudioUploading(fileList) {
    const audioFileList = fileList.filter((fileItem) => {
      if (fileItem.response) {
        return fileItem.response.code === '0';
      }
      return true;
    });
    this.setState({ audioFileList });
  }

  @autobind
  onOtherUploading(fileList) {
    const otherFileList = fileList.filter((fileItem) => {
      if (fileItem.response) {
        return fileItem.response.code === '0';
      }
      return true;
    });
    this.setState({ otherFileList });
  }

  @autobind
  onDone(file) {
    const { finalNewUuid } = this.state;
    const sourceState = ['fileAudioList', 'otherFileList'];
    const attachment = file.response.attachment;
    const fileState = sourceState[finalNewUuid.indexOf(attachment)];
    const resFileList = file.response.resultData.attaches;
    const finalFileAudioList = this.resourceToUpload(resFileList, attachment);
    this.setState({ [fileState]: finalFileAudioList });
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '更新晨报音频文件',
    },
  })
  onAudioChange({ fileList, file }) {
    if (file.status === 'uploading') {
      this.onAudioUploading(fileList);
    }
    if (file.status === 'done') {
      const res = file.response;
      if (res.code !== '0') {
        const fileErrorList = {
          ...file,
          status: 'error',
        };
        this.setState({
          audioFileList: [fileErrorList],
        });
      } else {
        const resFileList = file.response.resultData.attaches;
        const attachment = file.response.resultData.attachment;
        const finalFileAudioList = this.resourceToUpload(resFileList, attachment);
        this.setState({
          audioFileList: finalFileAudioList,
          audioError: finalFileAudioList.length,
          isUpdateFile: true,
        });
      }
    }
    if (file.status === 'error') {
      this.setState({ fileAudioList: fileList });
    }
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '更新晨报其他文件',
    },
  })
  onOtherChange({ fileList, file }) {
    if (file.status === 'uploading') {
      this.onOtherUploading(fileList);
    }
    if (file.status === 'done') {
      const res = file.response;
      if (res.code !== '0') {
        const fileErrorList = {
          ...file,
          status: 'error',
        };
        this.setState({
          otherFileList: [fileErrorList],
        });
      } else {
        const attachment = file.response.resultData.attachment;
        const resFileList = file.response.resultData.attaches;
        const finalFileOtherList = this.resourceToUpload(resFileList, attachment);
        message.info('上传文件成功');
        this.setState({
          otherFileList: finalFileOtherList,
          isUpdateFile: true,
        });
      }
    }
    if (file.status === 'error') {
      this.setState({ otherFileList: fileList });
    }
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '删除其他文件',
    },
  })
  onRemove(file) {
    const { delCeFile } = this.props;
    if (file.status === 'removed') {
      const query = {
        attachment: file.attachment,
        empId: emp.getId(),
        type: 'audio',
        attachId: file.uid,
      };
      delCeFile(query);
    }
    return false;
  }

  @autobind
  onBeforeUpload(file) {
    const audioType = this.getInitDate('newsTypeCode');
    // 音频文件格式限制为MP3
    const audioTypeReg = /(\.mp3|\.m4a)$/;
    if (!audioTypeReg.test(file.name)) {
      message.info('资讯晨报音频文件仅支持mp3及m4a格式');
      return false;
    }
    // 财经V2晨报定制大小
    if (audioType === 'V2_MORNING_NEWS') {
      const isOver = file.size / 1024 / 1024 < 16;
      if (!isOver) {
        message.info('财经V2晨报音频文件小于16兆');
        return false;
      }
      // 产品销售晨报定制大小
    } else if (audioType === 'PROD_SALES_MORNING_NEWS') {
      const isOver = file.size / 1024 / 1024 < 20;
      if (!isOver) {
        message.info('产品销售晨报音频文件小于20兆');
        return false;
      }
    }
    return true;
  }
  // audio upload --> end

  setSourceValue(itemDetail) {
    const { resourceToUpload } = this;
    const { audioFileList, audioFileId, otherFileList, otherFileId } = itemDetail;
    if (itemDetail) {
      this.setState({
        audioFileList: resourceToUpload(audioFileList, audioFileId),
        otherFileList: resourceToUpload(otherFileList, otherFileId),
        finalNewUuid: [audioFileId, otherFileId],
      });
    }
  }

  @autobind()
  getInitDate(type) {
    const { newsId, boradcastDetail } = this.props;
    const itemDetail = boradcastDetail[newsId];
    if (!itemDetail) return '';
    const { updatedBy } = itemDetail;
    if (type === 'createdBy') return updatedBy || itemDetail[type];
    return itemDetail[type];
  }

  @autobind
  resourceToUpload(resource, attachment) {
    if (Array.isArray(resource)) {
      return resource.map((item) => {
        const audioItem = {
          status: 'done',
          uid: item.attachId,
          name: item.name,
          response: { code: '0' },
          attachment,
        };
        return audioItem;
      });
    }
    return [];
  }

  @autobind()
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '提交',
    },
  })
  handleSubmit() {
    const { saveBoradcast, newsId } = this.props;
    const { audioFileList, finalNewUuid } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!audioFileList.length) {
        this.setState({ audioError: false });
        return;
      }
      this.setState({ audioError: true });
      let query = values;
      if (!err) {
        query = {
          ...query,
          audioFileId: finalNewUuid[0],
          otherFileId: finalNewUuid[1],
        };
        if (newsId !== createNewsId) {
          query = {
            ...query,
            newsId,
            updatedBy: values.createdBy,
            createdBy: null,
          };
        }
        saveBoradcast(query);
      }
    });
  }

  //  初始化state
  @autobind
  resetState() {
    this.setState({
      audioFileList: [],
      audioError: true, // audioFile 校验
      otherFileList: [],
      finalNewUuid: [],
    });
  }

  render() {
    const {
      audioFileList,
      audioError,
      otherFileList,
      finalNewUuid,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { getInitDate } = this;
    const { newsId, dict, creator } = this.props;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16, offset: 1 },
    };
    const sourceProps = {
      action: `${request.prefix}/file/ceFileUpload`,
      onRemove: this.onRemove,
    };
    const audioProps = {
      ...sourceProps,
      action: `${request.prefix}/file/ceFileReplaceUpload `,
      accept: 'audio/*',
      data: {
        attachment: finalNewUuid[0],
        empId: emp.getId(),
      },
      showUploadList: {
        showRemoveIcon: false,
      },
      beforeUpload: this.onBeforeUpload,
      onChange: this.onAudioChange,
    };
    const otherProps = {
      ...sourceProps,
      accept: '*/*',
      data: {
        attachment: finalNewUuid[1],
        empId: emp.getId(),
      },
      onChange: this.onOtherChange,
    };
    const morningBoradcastType = dict.newsTypeDictList || [];
    return (
      <Modal
        title={`${newsId !== createNewsId ? '修改' : '新建'}晨间播报`}
        width="650px"
        maskClosable={false}
        wrapClassName="addMorningBoradcast"
        bodyStyle={{
          padding: 0,
        }}
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.onHandleCancel}
        cancelText="取消"
        okText="确定"
      >
        <div
          ref={(c) => { this.formWrapRef = c; }}
          style={{
            height: '400px',
            overflowY: 'scroll',
            padding: '16px',
          }}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="类型"
              wrapperCol={{ span: 8, offset: 1 }}
            >
              {getFieldDecorator('typeCode', {
                initialValue: getInitDate('newsTypeCode'),
                rules: [
                  { required: true, message: '请选择晨报类型' },
                ],
              })(
                <Select placeholder="晨报类型">
                  {
                    morningBoradcastType.map(item =>
                      <Option key={item.key} value={item.key}>{item.value}</Option>,
                    )
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="作者"
              wrapperCol={{ span: 8, offset: 1 }}
            >
              {getFieldDecorator('createdBy', {
                initialValue: newsId === createNewsId ? creator : getInitDate('createdBy'),
                rules: [{ required: true, message: '请输入晨报作者' }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                initialValue: getInitDate('title'),
                rules: [{ required: true, message: '请输入标题' }, { max: 200, message: '字数最多为200' }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="摘要"
            >
              {getFieldDecorator('summary', {
                initialValue: getInitDate('summary'),
                rules: [{ required: true, message: '请输入摘要' }, { max: 200, message: '字数最多为200' }],
              })(
                <TextArea placeholder="请输入摘要内容..." autosize={{ minRows: 2, maxRows: 6 }} />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="正文"
            >
              {getFieldDecorator('content', {
                initialValue: getInitDate('content'),
                rules: [{ required: true, message: '请输入正文' }, { max: 1000, message: '字数最多为1000' }],
              })(
                <TextArea placeholder="请输入正文内容..." autosize={{ minRows: 6, maxRows: 10 }} />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="添加音频"
            >
              <Upload {...audioProps} fileList={audioFileList} >
                <div>
                  <i
                    className="icon iconfont icon-yinpinwenjian"
                    style={{ color: '#ac8ce0' }}
                  />
                  <span
                    className="audioDesc"
                    style={{ color: '#2782d7', cursor: 'pointer' }}
                  >
                    {`${audioFileList.length ? '更新音频文件' : '上传音频文件'}`}
                  </span>
                </div>
              </Upload>
              { audioError ? null : (<div style={{ color: 'red' }}>请上传一首音频文件</div>) }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="其他文件"
            >
              <Upload {...otherProps} fileList={otherFileList}>
                <Button type="primary" icon="plus" >
                  添加文件
                </Button>
              </Upload>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
