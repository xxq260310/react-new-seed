/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 14:08:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-29 09:07:42
 * 管理者视图详情
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import classnames from 'classnames';

import MissionImplementation from './MissionImplementation';
import MissionFeedback from './MissionFeedback';
import CustDetail from './CustDetail';
import Button from '../../common/Button';
import GroupModal from '../../customerPool/groupManage/CustomerGroupUpdateModal';
import { openRctTab } from '../../../utils';
import { request } from '../../../config';
import { PIE_ENTRY, PROGRESS_ENTRY } from '../../../config/createTaskEntry';
import { emp, url as urlHelper } from '../../../helper';
import styles from './managerViewDetail.less';
import InfoArea from './InfoArea';
import logable from '../../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;
// const CONTROLLER = 'controller';

// 1代表是自建任务类型
const TASK_TYPE_SELF = '1';
const falseValue = false;

// 任务进度条下钻
const SERVE_CUSTS = 'SERVE_CUSTS';
// 客户反馈饼图下钻
const MOT_FEEDBACK_CUSTS = 'MOT_FEEDBACK_CUSTS';

export default class ManagerViewDetail extends PureComponent {

  static propTypes = {
    // 视图是否处于折叠状态
    isFold: PropTypes.bool,
    // 预览客户明细
    previewCustDetail: PropTypes.func.isRequired,
    // 预览客户明细结果
    custDetailResult: PropTypes.object.isRequired,
    // 获取客户反馈结果
    onGetCustFeedback: PropTypes.func.isRequired,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    // 客户池用户范围
    custRange: PropTypes.array.isRequired,
    // 职位信息
    empInfo: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 任务实施进度
    missionImplementationDetail: PropTypes.object.isRequired,
    // 获取任务实施进度
    countFlowStatus: PropTypes.func.isRequired,
    // 任务基本信息
    mngrMissionDetailInfo: PropTypes.object.isRequired,
    // 发起新任务
    launchNewTask: PropTypes.func.isRequired,
    // 当前任务Id
    currentId: PropTypes.string,
    // push
    push: PropTypes.func.isRequired,
    // clearCreateTaskData
    clearCreateTaskData: PropTypes.func.isRequired,
    // 任务类型
    missionType: PropTypes.string.isRequired,
    // 反馈饼图数据
    countFlowFeedBack: PropTypes.func.isRequired,
    // 任务类型字典
    missionTypeDict: PropTypes.array,
    exportExcel: PropTypes.func.isRequired,
    missionProgressStatusDic: PropTypes.array.isRequired,
    missionFeedbackData: PropTypes.array.isRequired,
    missionFeedbackCount: PropTypes.number.isRequired,
    serveManagerCount: PropTypes.number.isRequired,
    custServedByPostnResult: PropTypes.bool.isRequired,
    missionReport: PropTypes.object.isRequired,
    createMotReport: PropTypes.func.isRequired,
    queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
    queryDistinctCustomerCount: PropTypes.func.isRequired,
    distinctCustomerCount: PropTypes.number.isRequired,
    // 服务经理维度任务数据
    custManagerScopeData: PropTypes.object.isRequired,
    getCustManagerScope: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isFold: false,
    mngrMissionDetailInfo: EMPTY_OBJECT,
    currentId: '',
    custFeedback: EMPTY_LIST,
    missionTypeDict: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCustDetailModal: false,
      missionProgressStatus: '',
      progressFlag: '',
      canLaunchTask: false,
      isEntryFromProgressDetail: false,
      isEntryFromCustTotal: false,
      isEntryFromPie: false,
      currentFeedback: EMPTY_LIST,
      feedbackIdL1: '',
      destroyOnClose: false,
      feedbackIdL2: '',
      isEntryFromResultStatisfy: false,
    };
  }

  @autobind
  getCurrentOrgId() {
    if (this.missionImplementationElem) {
      return this.missionImplementationElem.getCurrentOrgId() || emp.getOrgId();
    }
    return emp.getOrgId();
  }

  @autobind
  handleExport() {
    const {
      currentId,
      mngrMissionDetailInfo,
    } = this.props;
    const { missionProgressStatus = null, progressFlag = null } = this.state;
    const params = {
      missionProgressStatus,
      progressFlag,
      missionName: mngrMissionDetailInfo.missionName,
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
      serviceTips: _.isEmpty(mngrMissionDetailInfo.missionDesc) ? ' ' : mngrMissionDetailInfo.missionDesc,
      servicePolicy: mngrMissionDetailInfo.servicePolicy,
    };
    return params;
  }

  @autobind
  hideCustDetailModal() {
    this.setState({
      isShowCustDetailModal: false,
      destroyOnClose: true,
    });
  }

  /**
   * 关闭弹出框
   */
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '取消',
    },
  })
  handleCloseModal() {
    this.scrollModalBodyToTop();
    this.hideCustDetailModal();
  }

  /**
   * 预览客户明细
   */
  @autobind
  handlePreview(params = {}) {
    const {
      // 一二级客户反馈
      currentFeedback,
      // 当前选中的一级客户反馈
      feedbackIdL1 = '',
      // 当前选中的二级客户反馈
      feedbackIdL2 = '',
      pageNum = INITIAL_PAGE_NUM,
      pageSize = INITIAL_PAGE_SIZE,
      missionProgressStatus = '',
      progressFlag = '',
      canLaunchTask = false,
      // 当前入口是从客户总数来的
      isEntryFromCustTotal = false,
      // 当前入口是否从进度条过来
      isEntryFromProgressDetail = false,
      // 当前入口是否从饼图过来
      isEntryFromPie = false,
      // 当前入口是从进度条的结果达标过来的
      isEntryFromResultStatisfy = false,
    } = params;
    const { previewCustDetail, currentId, queryDistinctCustomerCount } = this.props;

    let postBody = {
      pageNum,
      pageSize,
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
    };

    // 进度条下钻的入参
    const progressParam = {
      missionProgressStatus,
      progressFlag,
      queryType: SERVE_CUSTS,
    };

    // 饼下钻图的入参
    const pieParam = {
      // 后端字母拼错了
      feedBackIdL1: feedbackIdL1,
      feedBackIdL2: feedbackIdL2,
      queryType: MOT_FEEDBACK_CUSTS,
    };

    // 客户总数下钻的入参
    const totalCustParam = {
      queryType: SERVE_CUSTS,
      // 客户总数一进来，默认一二级客户反馈都是空
      feedBackIdL1: feedbackIdL1,
      feedBackIdL2: feedbackIdL2,
    };

    if (isEntryFromProgressDetail) {
      postBody = {
        ...postBody,
        ...progressParam,
      };
    }

    if (isEntryFromPie) {
      postBody = {
        ...postBody,
        ...pieParam,
      };
    }

    if (isEntryFromCustTotal) {
      postBody = {
        ...postBody,
        ...totalCustParam,
      };
    }

    this.setState({
      ...progressParam,
      ...pieParam,
      ...totalCustParam,
      isEntryFromProgressDetail,
      isEntryFromPie,
      isEntryFromCustTotal,
      isEntryFromResultStatisfy,
      canLaunchTask,
      feedbackIdL1,
      feedbackIdL2,
      // 所有一级二级反馈
      // 添加客户反馈，所有反馈
      currentFeedback,
    });

    // 查询去重后的客户数量
    queryDistinctCustomerCount(postBody);

    previewCustDetail({
      ...postBody,
    }).then(() => {
      this.setState({
        isShowCustDetailModal: true,
        destroyOnClose: false,
      });
    });
  }

  /**
   * 发起新任务
   */
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发起新任务' } })
  handleLaunchTask() {
    const { clearCreateTaskData } = this.props;
    const {
      isEntryFromProgressDetail,
      isEntryFromPie,
    } = this.state;
    let currentEntryName = '';
    let currentEntryId = '';
    let currentRoute = '';
    if (isEntryFromPie) {
      currentEntryName = PIE_ENTRY;
      currentEntryId = 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PIE';
      currentRoute = '/customerPool/createTaskFromPie';
    } else if (isEntryFromProgressDetail) {
      currentEntryName = PROGRESS_ENTRY;
      currentEntryId = 'RCT_FSP_CREATE_TASK_FROM_MANAGERVIEW_CUSTFEEDBACK_PROGRESS';
      currentRoute = '/customerPool/createTaskFromProgress';
    }
    // 发起新的任务之前，先清除数据
    clearCreateTaskData(currentEntryName);
    this.openByAllSelect(currentRoute, currentEntryId, '自建任务');
  }

  // 发起任务
  @autobind
  openByAllSelect(url, id, title) {
    const {
      currentId,
      push,
      missionType,
      missionTypeDict,
      distinctCustomerCount,
    } = this.props;
    const {
      missionProgressStatus,
      progressFlag,
      isEntryFromProgressDetail,
      isEntryFromPie,
      feedbackIdL1,
      feedbackIdL2,
    } = this.state;
    const { descText } = _.find(missionTypeDict, item => item.key === missionType) || {};
    let missionTypeObject = {};
    // 只有自建任务才需要传给自建任务流程
    if (descText === TASK_TYPE_SELF) {
      missionTypeObject = {
        missionType,
      };
    }

    // 如果是来自进度条，则发起任务时，需要将类型传给后台
    let progressParam = {};
    let newProgressFlag = progressFlag;
    if (isEntryFromProgressDetail) {
      progressParam = {
        missionProgressStatus,
      };
      // 针对进度条发起的任务需要将Y和N标记替换成DONE和NOT_DONE标记，后台需要这么干
      if (newProgressFlag) {
        newProgressFlag = progressFlag === 'Y' ? 'DONE' : 'NOT_DONE';
      }
      progressParam = {
        ...progressParam,
        progressFlag: newProgressFlag,
        // 来自不同的入口，entrance和source不一样
        entrance: PROGRESS_ENTRY,
        source: PROGRESS_ENTRY,
      };
    }

    let pieParam = {};
    // 如果是来自客户反馈饼图
    if (isEntryFromPie) {
      pieParam = {
        feedBackIdL1: feedbackIdL1,
        feedBackIdL2: feedbackIdL2,
        // 来自不同的入口，entrance和source不一样
        entrance: PIE_ENTRY,
        source: PIE_ENTRY,
      };
    }

    const urlParam = {
      orgId: this.getCurrentOrgId(),
      missionId: currentId,
      count: distinctCustomerCount,
      // 任务类型
      ...missionTypeObject,
      // 进度条入参
      ...progressParam,
      // 饼图入参
      ...pieParam,
    };
    const condition = encodeURIComponent(JSON.stringify(urlParam));
    const query = {
      condition,
      ...urlParam,
    };
    const finalUrl = `${url}?${urlHelper.stringify(query)}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id,
      title,
    };
    openRctTab({
      routerAction: push,
      url: finalUrl,
      param,
      pathname: '/taskCenter/selfbuildTask/createTask',
      query,
    });
  }

  @autobind
  scrollModalBodyToTop() {
    // 翻页之后，恢复当前页面表格的滚动，在小屏的情况下
    const custDetailContainer = document.querySelector('.custDetailContainer .ant-modal-body');
    if (custDetailContainer) {
      custDetailContainer.scrollTop = 0;
    }
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '导出' } })
  handleDownloadClick() { }

  @autobind
  renderTotalCust() {
    const { mngrMissionDetailInfo = {}, custFeedback } = this.props;
    const { custNumbers = 0 } = mngrMissionDetailInfo;
    // 构造一二级客户反馈
    let currentFeedback = _.map(custFeedback, item => ({
      feedbackIdL1: item.key,
      feedbackName: item.name,
      childList: _.map(item.children, child => ({
        feedbackIdL2: child.key,
        feedbackName: child.name,
      })),
    }));

    // 添加默认选中项，所有
    currentFeedback = _.concat([{
      feedbackIdL1: '',
      feedbackName: '所有反馈',
      childList: [{
        feedbackIdL2: '',
        feedbackName: '所有反馈',
      }],
    }], currentFeedback);

    return (
      <div
        className={styles.custValue}
        onClick={() => this.handlePreview({
          isEntryFromCustTotal: true,
          canLaunchTask: false,
          currentFeedback,
        })}
      >
        <div
          className={styles.totalNum}
        >
          {custNumbers}
        </div>
      </div>
    );
  }

  render() {
    const {
      isFold,
      mngrMissionDetailInfo = EMPTY_OBJECT,
      custDetailResult,
      custFeedback,
      missionImplementationDetail,
      custRange,
      empInfo,
      location,
      replace,
      countFlowStatus,
      countFlowFeedBack,
      exportExcel,
      missionProgressStatusDic,
      missionFeedbackData,
      missionFeedbackCount,
      serveManagerCount,
      push,
      custServedByPostnResult,
      currentId,
      missionReport,
      createMotReport,
      queryMOTServeAndFeedBackExcel,
      getCustManagerScope,
      custManagerScopeData,
    } = this.props;

    const {
      isShowCustDetailModal,
      canLaunchTask,
      isEntryFromProgressDetail,
      isEntryFromPie,
      isEntryFromCustTotal,
      currentFeedback,
      feedbackIdL1,
      destroyOnClose,
      missionProgressStatus,
      progressFlag,
      feedbackIdL2,
      isEntryFromResultStatisfy,
    } = this.state;

    const {
      missionName,
      missionStatusName,
      triggerTime,
      endTime,
      missionTarget,
      servicePolicy,
      custSource,
      // 客户总数
      // custNumbers = 0,
      // 客户来源说明
      custSourceDesc,
      // 任务描述
      missionDesc,
      // 当前机构名
      // orgName,
      templateId,
    } = mngrMissionDetailInfo;

    const {
      // 已服务客户
      servedNums = 0,
    } = missionImplementationDetail || EMPTY_OBJECT;

    const { list = EMPTY_LIST } = custDetailResult || EMPTY_OBJECT;
    const isDisabled = _.isEmpty(list);
    const basicInfoData = [{
      id: 'id',
      key: '任务编号 :',
      value: currentId || '--',
    }, {
      id: 'date',
      key: '任务有效期 :',
      value: `${triggerTime || '--'} ~ ${endTime || '--'}`,
    },
    {
      id: 'target',
      key: '任务目标 :',
      value: missionTarget || '--',
    },
    {
      id: 'policy',
      key: '服务策略 :',
      value: servicePolicy || '--',
    }, {
      id: 'tip',
      key: '任务提示 :',
      value: missionDesc || '--',
    }];

    let targetCustInfoData = [{
      id: 'total',
      key: '客户数 :',
      value: this.renderTotalCust(),
    },
    {
      id: 'source',
      key: '客户来源 :',
      value: custSource || '--',
    }];
    if (!_.isEmpty(custSourceDesc)) {
      targetCustInfoData = [
        ...targetCustInfoData,
        {
          id: 'custDesc',
          key: '客户来源说明 :',
          value: custSourceDesc,
        },
      ];
    }

    const urlParams = this.handleExport();
    return (
      <div className={styles.managerViewDetail}>
        <div className={styles.titleSection}>
          <div className={styles.taskTitle}>
            {`${missionName || '--'}: ${missionStatusName || '--'}`}
          </div>
        </div>
        <div className={styles.detailContent}>
          <div className={styles.basicInfoSection}>
            <InfoArea
              data={basicInfoData}
              headLine={'基本信息'}
            />
            <InfoArea
              data={targetCustInfoData}
              headLine={'目标客户'}
            />
            {/**
             * close时destory弹框
             */}
            {
              !destroyOnClose ?
                <GroupModal
                  wrapperClass={`${styles.custDetailContainer} custDetailContainer`}
                  closable
                  visible={isShowCustDetailModal}
                  title={'客户明细'}
                  onCancelHandler={this.handleCloseModal}
                  footer={
                    <div className={styles.operationBtnSection}>
                      <Button
                        className={styles.cancel}
                        onClick={this.handleCloseModal}
                      >
                        取消
                      </Button>
                      {/**
                       * 暂时隐藏导出按钮,等后台性能恢复，再放开
                       */}
                      {
                        falseValue ? (
                          <Button className={styles.export}>
                            <a
                              onClick={this.handleDownloadClick}
                              href={`${request.prefix}/excel/custlist/exportExcel?orgId=${urlParams.orgId}&missionName=${urlParams.missionName}&missionId=${urlParams.missionId}&serviceTips=${urlParams.serviceTips}&servicePolicy=${urlParams.servicePolicy}`}
                            >导出</a>
                          </Button>
                        ) : null
                      }
                      {
                        canLaunchTask ? (
                          <Button
                            className={styles.launchTask}
                            type="default"
                            disabled={isDisabled}
                            onClick={this.handleLaunchTask}
                          >
                            发起新任务
                          </Button>
                        ) : null
                      }
                    </div>
                  }
                  modalContent={
                    <CustDetail
                      ref={ref => (this.custDetailRef = ref)}
                      getCustDetailData={this.handlePreview}
                      data={custDetailResult}
                      onClose={this.handleCloseModal}
                      hideCustDetailModal={this.hideCustDetailModal}
                      push={push}
                      custServedByPostnResult={custServedByPostnResult}
                      // 代表是否是从进度条点击的
                      isEntryFromProgressDetail={isEntryFromProgressDetail}
                      // 代表是否是从饼图过来的
                      isEntryFromPie={isEntryFromPie}
                      // scrollTop恢复
                      scrollModalBodyToTop={this.scrollModalBodyToTop}
                      // 当前一级二级反馈
                      currentFeedback={currentFeedback}
                      // 当前选中的一级反馈条件
                      feedbackIdL1={feedbackIdL1}
                      // 当前选中的二级级反馈条件
                      feedbackIdL2={feedbackIdL2}
                      // 代表是从客户总数过来的
                      isEntryFromCustTotal={isEntryFromCustTotal}
                      // 是否可以发起任务
                      canLaunchTask={canLaunchTask}
                      missionProgressStatus={missionProgressStatus}
                      progressFlag={progressFlag}
                      // 是否显示客户反馈筛选，只有已服务客户总数大于0，才需要展示客户反馈
                      isShowFeedbackFilter={servedNums > 0}
                      // 结果达标进度条下钻标记
                      isEntryFromResultStatisfy={isEntryFromResultStatisfy}
                    />
                  }
                  modalStyle={{
                    maxWidth: 1165,
                    minWidth: 700,
                  }}
                  modalWidth={'auto'}
                />
                : null
            }
          </div>
          <div className={styles.missionImplementationSection}>
            <MissionImplementation
              isFold={isFold}
              custFeedback={custFeedback}
              onPreviewCustDetail={this.handlePreview}
              missionImplementationProgress={missionImplementationDetail}
              custRange={custRange}
              empInfo={empInfo}
              location={location}
              replace={replace}
              countFlowStatus={countFlowStatus}
              countFlowFeedBack={countFlowFeedBack}
              exportExcel={exportExcel}
              missionProgressStatusDic={missionProgressStatusDic}
              ref={ref => (this.missionImplementationElem = ref)}
              currentId={currentId}
              urlParams={urlParams}
              missionReport={missionReport}
              createMotReport={createMotReport}
              queryMOTServeAndFeedBackExcel={queryMOTServeAndFeedBackExcel}
              custManagerScopeData={custManagerScopeData}
              getCustManagerScope={getCustManagerScope}
            />
          </div>
          <div className={styles.missionFeedbackSection}>
            <MissionFeedback
              missionFeedbackData={missionFeedbackData}
              isFold={isFold}
              missionFeedbackCount={missionFeedbackCount}
              serveManagerCount={serveManagerCount}
              templateId={templateId}
              ref={ref => (this.missionFeedbackElem = ref)}
            />
          </div>
        </div>
      </div>
    );
  }
}
