/*
* @Description: 合作合约 附件上传
* @Author: XuWenKang
* @Date:   2017-09-26 10:51:52
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-18 14:39:49
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import style from './uploadFile.less';

export default class UploadFile extends PureComponent {
  static propTypes = {
    fileList: PropTypes.array,
    edit: PropTypes.bool,
    uploadAttachment: PropTypes.func,
    attachment: PropTypes.string,
  }

  static defaultProps = {
    fileList: [],
    edit: false,
    uploadAttachment: () => {},
    attachment: '',
  }

  render() {
    const { fileList, attachment, edit, uploadAttachment } = this.props;
    return (
      <div className={style.uploadFile}>
        <InfoTitle head="附件" />
        <CommonUpload
          attachmentList={fileList}
          edit={edit}
          uploadAttachment={uploadAttachment}
          attachment={attachment}
          needDefaultText={false}
        />
      </div>
    );
  }
}
