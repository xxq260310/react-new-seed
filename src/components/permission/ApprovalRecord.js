import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import style from './approvalrecord.less';

export default function ApprovalRecord(props) {
  const historyList = !_.isEmpty(props.info) ? props.info : [];
  const currentStepObj = props.currentApproval;
  const currentStepNode = props.currentNodeName;
  const mapElementList = () => {
    if (!historyList || _.isEmpty(historyList)) {
      return null;
    }
    return historyList.map((item, index) => {
      const mapElementClass = classnames([style.approvalRecordList, {
        [style.approvalRecordListEven]: index % 2 === 0,
        [style.approvalRecordListOdd]: index % 2 !== 0,
      }]);
      const key = `record-${index}`;
      return (
        <div
          className={mapElementClass}
          key={key}
        >
          <p className={style.arlistContentOne}>
            审批人： {item.handler}于{item.handleTime}，步骤名称：{item.stepName}
          </p>
          <p className={style.arlistContentTwo}>
            {item.comment}
          </p>
        </div>
      );
    });
  };
  const stepElement = () => {
    const stepElementClass = classnames([style.approvalRecordStep,
      { hide: props.statusType !== 'ready' },
    ]);
    return (
      <div className={stepElementClass}>
        {
          _.isEmpty(currentStepObj) ? (
            <p className={style.notFoundApprovalList}>暂无当前审批人记录</p>
            ) : (
              <div>
                <span>当前步骤：</span>
                <span className={style.occupation}>
                  {
                    _.isEmpty(currentStepNode) ? currentStepObj.occupation : currentStepNode
                  }
                </span>
                <span className={style.curStepObjTitle}>当前审批人：</span>
                <span className={style.curStepObjperson}>
                  {currentStepObj.empName}({currentStepObj.empNum})
                </span>
              </div>
          )
        }
      </div>
    );
  };
  return (
    <div className={style.approvalRecord}>
      <InfoTitle head={props.head} />
      {stepElement()}
      {mapElementList()}
    </div>
  );
}

ApprovalRecord.propTypes = {
  head: PropTypes.string.isRequired,
  info: PropTypes.array,
  currentApproval: PropTypes.object,
  statusType: PropTypes.string.isRequired,
  currentNodeName: PropTypes.string,
};

ApprovalRecord.defaultProps = {
  info: [],
  currentApproval: {},
  currentNodeName: '',
};
