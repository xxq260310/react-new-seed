/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-29 14:32:54
 * 只读状态下，显示静态服务记录
 */


import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const EMPTY_OBJECT = {};

export default function StaticRecordContent(props) {
  const { data } = props;
  const {
    serviceContent,
    serviceWay,
    serviceStatusText,
    feedbackTypeL1Text,
    feedbackTypeL2Text,
    feedbackDateTime,
    serviceDateTime,
    renderFileList,
  } = data;

  return (
    <div className={styles.serviceRecordContent}>
      <div className={styles.gridWrapper}>
        <div className={styles.serveWay}>
          <div className={styles.title}>
            服务方式:
            </div>
          <div className={styles.readOnlyText}>
            {serviceWay}
          </div>
        </div>

        <div className={styles.serveStatus}>
          <div className={styles.title}>
            服务状态:
          </div>
          <div className={styles.readOnlyText}>
            {serviceStatusText}
          </div>
        </div>

        <div className={styles.serveTime}>
          <div className={styles.title}>
            服务时间:
            </div>
          <div className={styles.readOnlyText}>
            {serviceDateTime}
          </div>
        </div>

        <div className={styles.serveRecord}>
          <div className={styles.title}>服务记录:</div>
          <div className={styles.readOnlyText}>{serviceContent}</div>
        </div>

        <div className={styles.divider} />

        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>
              客户反馈:
            </div>
            <div className={styles.readOnlyText}>
              <span className={styles.feedbackTypeL1}>{feedbackTypeL1Text}</span>
              {/**
               * 二级和一级一样，不展示二级
               */}
              {
                feedbackTypeL2Text !== feedbackTypeL1Text ?
                  <span className={styles.feedbackTypeL2}>{feedbackTypeL2Text}</span>
                  : null
              }
            </div>
          </div>

          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.readOnlyText}>
              {feedbackDateTime}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.uploadSection}>
        {renderFileList()}
      </div>
    </div>
  );
}

StaticRecordContent.propTypes = {
  data: PropTypes.object,
};

StaticRecordContent.defaultProps = {
  data: EMPTY_OBJECT,
};
