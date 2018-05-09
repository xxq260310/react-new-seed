/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-22 16:05:54
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 20:21:53
 * 服务记录表单
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ServiceRecordContent from '../../common/serviceRecordContent';
import Button from '../../common/Button';
import styles from './serviceRecordForm.less';
import logable from '../../../decorators/logable';

export default class ServiceRecordForm extends PureComponent {
  static propTypes = {
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    isFold: PropTypes.bool.isRequired,
    custUuid: PropTypes.string.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
    addMotServeRecordSuccess: PropTypes.bool.isRequired,
    getCeFileList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    isEntranceFromPerformerView: false,
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleSubmit() {
    const data = this.serviceRecordContentRef.getData();
    if (!data) {
      return;
    }

    const {
      serviceWay,
      serviceType,
      serviceDate,
      serviceTime,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      serviceStatus,
      serviceContent,
      currentFile,
    } = data;

    const {
      formData: { custId = '', missionFlowId = '' },
      addServeRecord,
      custUuid,
    } = this.props;
    const postBody = {
      // 经纪客户号
      custId,
      serveWay: serviceWay,
      serveType: serviceType,
      type: serviceType,
      serveTime: `${serviceDate.replace(/\//g, '-')} ${serviceTime}`,
      serveContentDesc: serviceContent,
      feedBackTime: feedbackDate.replace(/\//g, '-'),
      serveCustFeedBack: feedbackType,
      serveCustFeedBack2: feedbackTypeChild || '',
      missionFlowId,
      flowStatus: serviceStatus,
      // 只有上传了附件才需要将custUuid传给后台，不然传空字符串
      uuid: (custUuid && !_.isEmpty(currentFile)) ? custUuid : '',
    };

    // 添加服务记录
    addServeRecord(postBody, this.handleCancel);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '取消' } })
  handleCancel() {
    if (this.serviceRecordContentRef) {
      this.serviceRecordContentRef.resetField();
    }
  }

  render() {
    const {
      dict,
      isEntranceFromPerformerView,
      isFold,
      formData,
      formData: { serviceTips },
      custUuid,
      isReadOnly,
      deleteFileResult,
      ceFileDelete,
    } = this.props;

    if (!dict) {
      return null;
    }
    return (
      <div className={styles.serviceRecordWrapper}>
        <div className={styles.title}>
          服务记录
        </div>
        <div className={styles.serveTip}>
          <div className={styles.title}>
            任务提示:
          </div>
          {/**
           * 不要去掉dangerouslySetInnerHTML，瞄准镜标签作为变量塞入任务提示，返回时可能带有<br/>
           * 标签，需要格式化展示出来
           */}
          <div className={styles.content}>
            <div dangerouslySetInnerHTML={{ __html: serviceTips || '--' }} />
          </div>
        </div>

        <ServiceRecordContent
          ref={ref => (this.serviceRecordContentRef = ref)}
          isReadOnly={isReadOnly}
          dict={dict}
          // 是否是执行者视图页面
          isEntranceFromPerformerView={isEntranceFromPerformerView}
          // 表单数据
          formData={formData}
          isFold={isFold}
          custUuid={custUuid}
          onDeleteFile={ceFileDelete}
          deleteFileResult={deleteFileResult}
        />

        {
          !isReadOnly ?
            <div className={styles.operationSection}>
              <Button
                className={styles.submitBtn}
                onClick={_.debounce(this.handleSubmit, 300)}
                type="primary"
              >
                提交</Button>
              <Button
                className={styles.cancelBtn}
                onClick={this.handleCancel}
              >取消</Button>
            </div> : null
        }
      </div>
    );
  }
}
