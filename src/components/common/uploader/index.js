/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-13 13:57:32
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-21 09:03:17
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Upload, message, Icon as antdIcon } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import confirm from '../../common/Confirm';
import Loading from '../../../layouts/Loading';
import Icon from '../../common/Icon';
import { emp } from '../../../helper';
import uploadRequest from '../../../utils/uploadRequest';
import './index.less';
import logable from '../../../decorators/logable';

const EMPTY_OBJECT = {};
const Dragger = Upload.Dragger;
const EMPTY_LIST = [];

export default class Uploader extends PureComponent {
  static propTypes = {
    attachModel: PropTypes.object,
    fileKey: PropTypes.string,
    onOperateFile: PropTypes.func,
    onHandleOverview: PropTypes.func,
    onDeleteFile: PropTypes.func,
    originFileName: PropTypes.string,
    custTotal: PropTypes.number,
    isNeedPreview: PropTypes.bool,
    isNeedDelete: PropTypes.bool,
    uploadTitle: PropTypes.string.isRequired,
    uploadTarget: PropTypes.string.isRequired,
    upData: PropTypes.object,
    beforeUpload: PropTypes.func,
    custUuid: PropTypes.string,
    isUploadFileManually: PropTypes.bool,
    isSupportUploadMultiple: PropTypes.bool,
    deleteFileResult: PropTypes.array,
    accept: PropTypes.string,
  }

  static defaultProps = {
    attachModel: {},
    fileKey: '',
    originFileName: '',
    custTotal: 0,
    onHandleOverview: () => { },
    onDeleteFile: () => { },
    onOperateFile: () => { },
    isNeedPreview: false,
    isNeedDelete: false,
    upData: {},
    beforeUpload: () => { },
    isUploadFileManually: false,
    custUuid: '',
    isSupportUploadMultiple: false,
    deleteFileResult: [],
    accept: '',
  }

  constructor(props) {
    super(props);
    const {
      attachModel = EMPTY_OBJECT,
      fileKey = '',
      originFileName = '',
      custTotal = 0,
      upData,
      custUuid,
    } = props;
    this.state = {
      lastFile: attachModel,
      fileList: [],
      uploadedFileKey: fileKey,
      upData: {
        empId: emp.getId(),
        attachment: custUuid,
      },
      isShowUpload: !(attachModel && fileKey),
      isShowError: false,
      originFileName,
      custTotal,
      showUploadList: true,
      originUpData: upData,
      custUuid,
      attaches: [],
      // 当前剩余的附件列表
      remainingAttachLists: [],
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachModel: nextFile = EMPTY_OBJECT, custUuid,
      deleteFileResult: nextResult = EMPTY_LIST } = nextProps;
    const { attachModel: prevFile = EMPTY_OBJECT, deleteFileResult = EMPTY_LIST,
      onOperateFile } = this.props;
    if (nextFile !== prevFile) {
      this.setState({
        lastFile: nextFile,
      });
    }

    // 当前剩余的附件列表
    if (deleteFileResult !== nextResult) {
      this.setState({
        remainingAttachLists: nextResult,
      }, () => {
        // 删除到最后一个的时候，将custUuid设置为空，不然查看服务记录的时候，会展示附件
        if (_.size(nextResult) <= 0) {
          this.setState({
            custUuid: '',
          }, () => {
            onOperateFile({
              ...this.state,
              custUuid: '',
            });
          });
        }
      });
    }

    this.setState({
      upData: {
        ...this.state.upData,
        attachment: custUuid,
      },
      custUuid,
    });
  }

  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$props.uploadTitle' } })
  handleFileChange(info) {
    const { onOperateFile, isSupportUploadMultiple } = this.props;
    const { upData, custUuid } = this.state;
    // 当前操作upload项
    const currentFile = info.file;
    // 当前列表
    let newFileList = info.fileList;

    const { status, response, name } = currentFile;
    const { resultData, msg } = response || {};

    if (status === 'removed') {
      if (!_.isEmpty(newFileList)) {
        // 过滤掉错误的fileList
        newFileList = newFileList.filter(file => file.status !== 'error');
      }
    }

    if (status === 'done') {
      const { fileName, totalCustNum, attachment = '', attaches = [] } = resultData;
      message.success('文件上传成功', 2);
      this.setState({
        lastFile: currentFile,
        uploadedFileKey: fileName,
        isShowError: false,
        originFileName: name,
        custTotal: totalCustNum,
        showUploadList: true,
        upData: {
          ...upData,
          attachment,
        },
        isShowUpload: isSupportUploadMultiple,
        // 上传成功共之后返回的attach列表
        attaches,
      });
      onOperateFile({
        currentFile,
        uploadedFileKey: fileName,
        originFileName: name,
        custTotal: totalCustNum,
        attachment,
        custUuid,
      });
    }

    if (status === 'error') {
      const errorMsg = _.isEmpty(msg) ? '文件上传失败' : msg;
      message.error(`${errorMsg}.`, 2);
      if (!_.isEmpty(newFileList)) {
        // 过滤掉错误的fileList
        newFileList = newFileList.filter(file => file.status !== 'error');
      }
      this.setState({
        isShowError: !isSupportUploadMultiple,
        showUploadList: false,
      });
    }

    this.setState({
      fileList: newFileList,
      isLoading: status === 'uploading',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '删除文件' } })
  handleFileRemove(file) {
    const { error } = file;
    this.currentfile = file;
    if (!error) {
      this.showConfirm();
    }

    return true;
  }

  @autobind
  showConfirm() {
    confirm({
      onOk: this.handleDeleteConfirm,
      onCancel: this.handleCancel,
    });
  }

  @autobind
  createUpload() {
    const { uploadTitle, uploadTarget, accept } = this.props;
    const { upData, fileList } = this.state;

    return (
      <Dragger
        name="file"
        data={upData}
        action={uploadTarget}
        onRemove={this.handleFileRemove}
        onChange={this.handleFileChange}
        customRequest={this.fileCustomRequest}
        showUploadList={false}
        fileList={fileList}
        listType={'text'}
        accept={accept}
      >
        <div className="upload_txt">
          + {uploadTitle}
        </div>
      </Dragger>
    );
  }

  @autobind
  handleDeleteConfirm() {
    const { onDeleteFile } = this.props;
    const { fileList, attaches = [], custUuid } = this.state;
    this.setState({
      lastFile: {},
      uploadedFileKey: '',
      isShowUpload: true,
      // 删除完毕之后，打开上传进度开关
      showUploadList: true,
      fileList: this.currentfile && _.filter(fileList, item => item.uid !== this.currentfile.uid
        && _.isEmpty(this.currentfile.error)),
    });

    if (this.currentfile) {
      const currentAttach = _.find(attaches, item => item.name === this.currentfile.name);
      if (currentAttach) {
        // 找到符合匹配要删除的文件
        const attachId = currentAttach.attachId;
        this.setState({
          currentDeleteAttachId: attachId,
        }, () => {
          onDeleteFile({
            attachId,
            attachment: custUuid,
          });
        });
      }
    } else {
      onDeleteFile();
    }
  }

  @autobind
  handleCancel() {
    console.log('cancel');
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '删除' } })
  handleDeleteFile() {
    confirm({
      onOk: this.handleDeleteConfirm,
      onCancel: this.handleCancel,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '预览' } })
  handlePreview() {
    const { onHandleOverview } = this.props;
    const { uploadedFileKey } = this.state;
    onHandleOverview(uploadedFileKey);
  }

  /**
   * 清除当前上传的文件列表和历史记录
   */
  @autobind
  clearUploadFile() {
    const { originUpData } = this.state;
    this.setState({
      lastFile: {},
      uploadedFileKey: '',
      isShowUpload: true,
      // 删除完毕之后，打开上传进度开关
      showUploadList: true,
      upData: originUpData,
      fileList: [],
    });
  }

  /**
   * 渲染文件的图标
   * @param {*} name 文件名称
   */
  @autobind
  renderIcon(name) {
    const fullName = name.split('.');
    const suffix = fullName[fullName.length - 1];
    let iconType = '';

    switch (true) {
      case /jpg|jpeg|png/.test(suffix):
        iconType = 'tupian-';
        break;
      case /docx?/.test(suffix):
        iconType = 'word';
        break;
      case /xlsx?/.test(suffix):
        iconType = 'excel2';
        break;
      case /pptx?/.test(suffix):
        iconType = 'ppt';
        break;
      case /mp3|wav/.test(suffix):
        iconType = 'yinpinwenjian';
        break;
      case /mov|mp4|avi|3gp|wmv/.test(suffix):
        iconType = 'shipinwenjian';
        break;
      case /txt/.test(suffix):
        iconType = 'txt';
        break;
      case /csv/.test(suffix):
        iconType = 'CSV';
        break;
      default:
        iconType = 'qitawenjian';
    }

    return iconType;
  }

  @autobind
  renderUploadedList() {
    const { fileList } = this.state;
    return (
      <div className="ant-upload-list ant-upload-list-text">
        {
          _.map(fileList, item => <div
            className="ant-upload-list-item ant-upload-list-item-done"
            key={`${item.uid}${item.name}`}
          >
            <div className="ant-upload-list-item-info">
              <span>
                <Icon
                  className={classnames({
                    uploadedFileIcon: true,
                    [this.renderIcon(item.name)]: true,
                  })}
                  type={this.renderIcon(item.name)}
                />
                <span className="ant-upload-list-item-name" title={item.name}>
                  {item.name}
                </span>
              </span>
            </div>
            <antdIcon title="删除文件" className="anticon anticon-cross" onClick={() => this.handleFileRemove(item)} />
          </div>,
          )
        }
      </div>
    );
  }

  render() {
    const { isNeedDelete, isNeedPreview, isSupportUploadMultiple } = this.props;
    const { isShowUpload, isShowError, originFileName, fileList, isLoading } = this.state;
    return (
      <div>
        <div className="uploadBox">
          {
            isShowUpload ? this.createUpload() : null
          }
          {
            !isShowUpload ? <div className="previewSection">
              <div className="uploadedFile">
                {
                  originFileName.indexOf('csv') !== -1 ?
                    <Icon className="csvIcon" type="CSV" /> :
                    <Icon className="excelIcon" type="excel" />
                }
                <span>{originFileName}</span>
              </div>
              {
                isNeedPreview ? <div
                  className="overview"
                  onClick={this.handlePreview}
                >预览</div>
                  : null
              }
              {
                isNeedDelete ? <div
                  className="delete"
                  onClick={this.handleDeleteFile}
                >删除</div> : null
              }
            </div> : null
          }
        </div>
        {
          (!_.isEmpty(fileList) && isSupportUploadMultiple) ? this.renderUploadedList() : null
        }
        {
          (isShowUpload && isShowError) ?
            <div className="errorInfo">导入数据失败，上传格式不正确！</div> : null
        }
        <Loading loading={isLoading} forceFull={false} />
      </div>
    );
  }
}
