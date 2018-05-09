/**
 * @file components/feedback/UploadFiles.js
 * 上传附件
 * @author yangquanjian
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Upload, message, Modal } from 'antd';
import { autobind } from 'core-decorators';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { request } from '../../config';
import { emp } from '../../helper';
import uploadRequest from '../../utils/uploadRequest';
import styles from './uploadFiles.less';
import logable from '../../decorators/logable';

let COUNT = 0;
const EMPTY_LIST = [];
const confirm = Modal.confirm;
const Dragger = Upload.Dragger;

@createForm()
export default class UploadFiles extends PureComponent {
  static propTypes = {
    attachModelList: PropTypes.array,
    form: PropTypes.object.isRequired,
    onCreate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachModelList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      fList: [],
      upData: {
        empId: emp.getId(),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachModelList: nextFileList = EMPTY_LIST } = nextProps;
    const { attachModelList: prevFileList = EMPTY_LIST } = this.props;
    if (nextFileList !== prevFileList) {
      let fileList = [];
      if (nextFileList && nextFileList.length > 0) {
        /* eslint-disable */
        const removeEmpty = (obj) => {
          const objs = obj;
          Object.keys(objs).forEach(key => (_.isEmpty(objs[key]) || objs[key] === 'undefined') && delete objs[key]);
          return objs;
        };
        const filesList = removeEmpty(nextFileList);
        fileList = filesList.map((item, i) => ({
          uid: `${item.attachUploader || ''}afiles${i}`,
          name: item.attachName,
          status: 'done',
          url: `${request.prefix}/file/${item.attachUrl}`,
          thumbUrl: item.attachUrl,
        }));
      }
      this.setState({
        formKey: `formKey${COUNT++}`,
        fList: fileList,
      });
    }
  }
  @autobind
  fileCustomRequest(option) {
    return uploadRequest(option);
  }

  @autobind
  fileOnChange({ file }) {
    // {
    //    uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //    name: 'xx.png'   // 文件名
    //    status: 'done', // 状态有：uploading done error removed
    //    response: '{"status": "success"}', // 服务端响应内容
    // }
    const status = file.status;
    const response = file.response || {};
    const { onCreate } = this.props;
    if (status === 'done') {
      onCreate(response.resultData, 'ADD');
    } else if (status === 'error') {
      const msg = _.isEmpty(response.msg) ? '文件上传失败' : response.msg;
      message.error(`${msg}.`);
    }
    return true;
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '移除附件' } })
  fileOnRemove(file) {
    const { onCreate } = this.props;
    const nowUserId = emp.getId();
    const uids = file.uid || '';
    let uid = uids.split('a');
    uid = uid.length > 1 ? uid[0] : '';
    if (!_.isEmpty(uid) && uid === nowUserId) {
      let delData = {};
      delData = {
        attachName: file.name,
        attachUrl: file.thumbUrl,
      };
      confirm({
        okText: '确定',
        cancelText: '取消',
        title: '您确定删除该文件?',
        content: '点击确定删除文件',
        onOk() {
          onCreate(delData, 'DELETE');
        },
      });
    } else if (_.isEmpty(uid) || uid === 'rc-uplo') {
      // message.error(`${file.name} 并未上传成功`);
      return true;
    } else {
      message.warning(`您无权限删除文件${file.name}`);
    }
    return false;
  }

  @autobind
  createUpload() {
    const { fList = EMPTY_LIST, upData } = this.state;
    const uploadKey = `uploadKey${COUNT++}`;
    return (
      <Dragger
        key={uploadKey}
        name="file"
        data={upData}
        action={`${request.prefix}/file/feedbackFileUpload`}
        defaultFileList={fList}
        onRemove={this.fileOnRemove}
        onChange={this.fileOnChange}
        customRequest={this.fileCustomRequest}
      >
        <div className="upload_txt">
          + 上传附件
        </div>
      </Dragger>);
  }
  render() {
    return (
      <div className={styles.uploadBoxWrapper}>
        <div className="uploadBox">
          {this.createUpload()}
        </div>
      </div>
    );
  }
}
