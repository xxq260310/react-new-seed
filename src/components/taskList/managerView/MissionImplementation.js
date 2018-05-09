/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-04-12 10:37:49
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Tooltip, Mention } from 'antd';
import classNames from 'classnames';
import { stateFromHTML } from 'draft-js-import-html';
import Icon from '../../common/Icon';
import LabelInfo from '../common/LabelInfo';
import MissionProgress from './MissionProgress';
import CustFeedback from './CustFeedback';
import CustManagerDetailScope from './CustManagerDetailScope';
import TabsExtra from '../../customerPool/home/TabsExtra';
import { env, permission, emp } from '../../../helper';
import { ORG_LEVEL1, ORG_LEVEL2, ORG_LEVEL3 } from '../../../config/orgTreeLevel';
import { request } from '../../../config';
import styles from './missionImplementation.less';
import emptyImg from './img/empty.png';
import loadingImg from './img/loading.png';
import logable from '../../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const EMPTY_CONTENT = '本机构无服务客户';
const MAIN_MAGEGER_ID = 'msm';
const COLLAPSE_WIDTH = 672;
const MARGIN_LEFT = 16;
const { toString } = Mention;

export default class MissionImplementation extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationProgress: PropTypes.object,
    // 客户反馈结果
    custFeedback: PropTypes.array,
    isFold: PropTypes.bool,
    // 预览客户明细
    onPreviewCustDetail: PropTypes.func.isRequired,
    custRange: PropTypes.array,
    empInfo: PropTypes.object,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 获取任务实施进度
    countFlowStatus: PropTypes.func.isRequired,
    // 客户反馈饼图
    countFlowFeedBack: PropTypes.func.isRequired,
    exportExcel: PropTypes.func.isRequired,
    // 进度条字典
    missionProgressStatusDic: PropTypes.array.isRequired,
    // current taskId
    currentId: PropTypes.string,
    missionReport: PropTypes.object.isRequired,
    createMotReport: PropTypes.func.isRequired,
    queryMOTServeAndFeedBackExcel: PropTypes.func.isRequired,
    urlParams: PropTypes.object.isRequired,
    // 服务经理维度任务数据
    custManagerScopeData: PropTypes.object.isRequired,
    getCustManagerScope: PropTypes.func.isRequired,
  }

  static defaultProps = {
    missionImplementationProgress: EMPTY_OBJECT,
    custFeedback: EMPTY_LIST,
    isFold: false,
    custRange: EMPTY_LIST,
    empInfo: EMPTY_OBJECT,
    currentId: '',
    custManagerDetailScopeData: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const currentOrgId = emp.getOrgId();
    // 来自营业部
    let level = ORG_LEVEL3;
    // 判断是否是经纪总部
    if (emp.isManagementHeadquarters(currentOrgId)) {
      level = ORG_LEVEL1;
    } else if (emp.isFiliale(props.custRange, currentOrgId)) {
      // 判断是否是分公司
      level = ORG_LEVEL2;
    }

    this.state = {
      expandAll: false,
      currentOrgId: '',
      createCustRange: [],
      isDown: true,
      forceRender: true,
      // 当前组织机构树层级
      level,
    };
    // 首页指标查询,总部-营销活动管理岗,分公司-营销活动管理岗,营业部-营销活动管理岗权限
    this.isAuthorize = permission.hasCustomerPoolPermission();
  }

  componentDidMount() {
    const {
      custRange,
      empInfo: { empInfo = {}, empPostnList = {} },
    } = this.props;
    // 获取登录用户empId和occDivnNum
    const { occDivnNum = '' } = empInfo;

    // 登录用户orgId，默认在fsp中中取出来的当前用户岗位对应orgId，本地时取用户信息中的occDivnNum
    if (env.isInFsp()) {
      this.orgId = window.forReactPosition.orgId;
    } else {
      this.orgId = occDivnNum;
    }

    this.originOrgId = this.orgId;

    // 根据岗位orgId生成对应的组织机构树
    this.handleCreateCustRange({
      custRange,
      posOrgId: this.orgId,
      empPostnList,
    });
    window.addEventListener('resize', this.onResize);
    // fsp侧边菜单折叠按钮click事件处理
    window.onFspSidebarbtn(this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    const { currentId = '' } = this.props;
    const {
      currentId: nextCurrentId = '',
      custRange,
      empInfo: { empPostnList = EMPTY_OBJECT },
    } = nextProps;

    if (currentId !== nextCurrentId) {
      // 当任务切换的时候,清除组织机构树选择项
      this.orgId = this.originOrgId;
      // 根据岗位orgId生成对应的组织机构树
      this.handleCreateCustRange({
        custRange,
        posOrgId: this.orgId,
        empPostnList,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.offFspSidebarbtn(this.onResize);
  }

  /**
   * 为了解决flex-box布局在发生折叠时，两个相邻box之间的原有间距需要取消
   * 不然会产生对齐bug
   * 监听resize事件，为了性能考虑，只当flex容器宽度在设定的间断点左右跳跃时，才触发重新render
   */
  @autobind
  onResize() {
    const contentWidth = this.contentElem && this.contentElem.clientWidth;
    if (this.memeoryWidth) {
      if (this.memeoryWidth < COLLAPSE_WIDTH < contentWidth ||
        contentWidth < COLLAPSE_WIDTH < this.memeoryWidth) {
        this.setState({
          forceRender: !this.state.forceRender,
        });
      }
    } else {
      this.setState({
        forceRender: !this.state.forceRender,
      });
    }
    this.memeoryWidth = contentWidth;
  }

  @autobind
  getSourceSrc(source) {
    return source && source.fileName && `${request.prefix}/excel/custlist/excelExport?orgId=${source.orgId}&empId=${emp.getId()}&fileName=${window.encodeURIComponent(source.fileName)}`;
  }

  @autobind
  getPayload() {
    const {
      urlParams,
    } = this.props;
    const orgId = this.getCurrentOrgId();
    const {
      missionName,
      missionId,
      serviceTips,
      servicePolicy,
    } = urlParams;

    // 转换服务策略和任务提示格式
    const serviceTipsString = toString(stateFromHTML(serviceTips));
    const servicePolicyString = toString(stateFromHTML(servicePolicy));

    return {
      missionName,
      missionId,
      serviceTips: serviceTipsString,
      servicePolicy: servicePolicyString,
      orgId,
    };
  }

  @autobind
  getCurrentOrgId() {
    return this.state.currentOrgId || emp.getOrgId();
  }

  /**
   * 机构树的change回调
   */
  @autobind
  collectCustRange(value) {
    const { countFlowStatus, countFlowFeedBack, getCustManagerScope } = this.props;
    const { level } = value;
    this.setState({
      // 当前层级
      level,
    });
    countFlowStatus(value);
    countFlowFeedBack(value);
    getCustManagerScope(value);
    this.orgId = value;
  }

  /**
   * 创建客户范围组件的tree数据
   * @param {*} props 最新的props
   */
  @autobind
  handleCreateCustRange({
    custRange,
    posOrgId,
    empPostnList,
  }) {
    // 职责的普通用户，取值 '我的客户'
    if (!this.isAuthorize) {
      return;
    }

    // 只要不是我的客户，都展开组织机构树
    // 用户职位是经总
    if (posOrgId === (custRange[0] || {}).id) {
      this.setState({
        expandAll: true,
        createCustRange: custRange,
      });
      return;
    }
    // posOrgId 在机构树中所处的分公司位置
    const groupInCustRange = _.find(custRange, item => item.id === posOrgId);
    if (groupInCustRange) {
      this.setState({
        expandAll: true,
        createCustRange: [groupInCustRange],
      });
      return;
    }
    // posOrgId 在机构树的营业部位置
    let department;
    _.each(custRange, (obj) => {
      if (!_.isEmpty(obj.children)) {
        const targetValue = _.find(obj.children, o => o.id === posOrgId);
        if (targetValue) {
          department = [targetValue];
        }
      }
    });

    if (department) {
      this.setState({
        createCustRange: department,
      });
      return;
    }
    // 有权限，但是posOrgId不在empOrg（组织机构树）中，
    // 用posOrgId去empPostnList中匹配，找出对应岗位的信息显示出来
    const curJob = _.find(empPostnList, obj => obj.orgId === posOrgId);
    this.setState({
      createCustRange: [{
        id: curJob.orgId,
        name: curJob.orgName,
      }],
    });
  }

  @autobind
  handleExportExcel() {
    return this.props.exportExcel(this.state.currentOrgId || emp.getOrgId());
  }

  @autobind
  updateQueryState({ orgId }) {
    this.setState({
      currentOrgId: orgId,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '生成最新报告' } })
  createMissionReport() {
    const {
      createMotReport,
    } = this.props;
    const payload = this.getPayload();
    createMotReport(payload);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '正在生成最新报告' } })
  queryMOTServeAndFeedBackExcel() {
    const { queryMOTServeAndFeedBackExcel } = this.props;
    const payload = this.getPayload();
    queryMOTServeAndFeedBackExcel(payload);
  }

  @autobind
  handlePreview(params) {
    const { onPreviewCustDetail } = this.props;
    onPreviewCustDetail(params);
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载' } })
  handleDownloadClick() { }

  @logable({ type: 'Click', payload: { name: '报告' } })
  handleDownload() { }

  @autobind
  renderTabsExtra() {
    const { replace, location } = this.props;
    const {
      expandAll,
      isDown,
      createCustRange,
      cycleSelect,
    } = this.state;

    // curOrgId   客户范围回填
    // 当url中由 orgId 则使用orgId
    // 有权限时默认取所在岗位的orgId
    // 无权限取 MAIN_MAGEGER_ID
    let curOrgId = MAIN_MAGEGER_ID;

    if (this.orgId) {
      curOrgId = this.orgId;
    } else if (!this.isAuthorize) {
      curOrgId = MAIN_MAGEGER_ID;
    }
    const extraProps = {
      custRange: createCustRange,
      replace,
      collectCustRange: this.collectCustRange,
      expandAll,
      location,
      orgId: curOrgId,
      exportOrgId: cycleSelect,
      isDown,
      iconType: 'juxing23',
      exportExcel: this.handleExportExcel,
      updateQueryState: this.updateQueryState,
    };
    return (<TabsExtra {...extraProps} />);
  }

  @autobind
  renderCreateFileInfo(currentMissionReport) {
    const { isCreatingMotReport, createTime } = currentMissionReport;
    if (isCreatingMotReport) {
      const text = '生成报告需要一些时间，请稍后点击此处刷新状态'; // 提示文本(来自需求)；
      return (
        <div>
          <span className={styles.line}>|</span>
          <Tooltip placement="bottomLeft" title={text}>
            <span className={styles.creatingBtn} onClick={this.queryMOTServeAndFeedBackExcel}>
              <img src={loadingImg} alt="刷新" />
              <span>正在生成最新报告</span>
            </span>
          </Tooltip>
        </div>
      );
    } else if (createTime) {
      return (
        <div className={styles.downLoading}>
          <span className={styles.line}>|</span>
          <a
            onClick={this.handleDownloadClick}
            href={this.getSourceSrc(currentMissionReport)}
          >
            <Icon type="xiazai" className={`icon ${styles.icon_mr}`} />
          </a>
          <a
            onClick={this.handleDownload}
            href={this.getSourceSrc(currentMissionReport)}
          >
            <span>{createTime}报告</span>
          </a>
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      missionImplementationProgress = EMPTY_OBJECT,
      isFold,
      custFeedback = EMPTY_LIST,
      missionProgressStatusDic = EMPTY_LIST,
      missionReport,
      currentId,
      custManagerScopeData,
    } = this.props;
    const { level } = this.state;
    const currentMissionReport = currentId ? missionReport[currentId] || {} : {};
    const {
      isCreatingMotReport,
    } = currentMissionReport;
    /**
     * 下面三个变量是为了解决flex-box布局在发生折叠时，两个相邻box之间的原有间距需要取消
     * 不然会产生对齐bug
     * 这里一旦取消box之间的间距，需要考虑到flex的重新伸缩性问题
     */
    const contentWidth = this.contentElem && this.contentElem.clientWidth;
    const shouldnoMargin = (contentWidth && contentWidth < COLLAPSE_WIDTH);
    const shouldForceCollapse = shouldnoMargin && contentWidth > COLLAPSE_WIDTH - MARGIN_LEFT;

    const notMissionCust = _.isEmpty(missionImplementationProgress) && _.isEmpty(custFeedback);
    const canCreateReport = _.isBoolean(isCreatingMotReport) ?
      notMissionCust || isCreatingMotReport :
      true;
    return (
      <div className={styles.missionImplementationSection}>
        <div className={styles.title}>
          <div className={styles.leftSection}>
            <LabelInfo value={'任务实施简报'} />
          </div>
          <div className={styles.rightSection}>
            <div className={styles.report}>
              <span
                className={
                  classNames({
                    [styles.noCreateBtn]: canCreateReport,
                    [styles.createBtn]: !canCreateReport,
                  })
                }
                onClick={canCreateReport ? null : this.createMissionReport}
              >
                <Icon type="wenben" className={`icon ${styles.icon_mr}`} />
                生成最新报告
              </span>
              {
                this.renderCreateFileInfo(currentMissionReport)
              }
            </div>
          </div>
        </div>
        <div className={styles.orgTreeSection}>
          {this.renderTabsExtra()}
        </div>
        {
          notMissionCust ?
            <div className={styles.emptyContent}>
              <img src={emptyImg} alt={EMPTY_CONTENT} />
              <div className={styles.tip}>{EMPTY_CONTENT}</div>
            </div> :
            <div className={styles.content} ref={(ref) => { this.contentElem = ref; }}>
              <div
                className={classNames({
                  [styles.leftContent]: true,
                  [styles.noMargin]: shouldnoMargin,
                  [styles.forceCollapse]: shouldForceCollapse,
                })}
              >
                <MissionProgress
                  missionImplementationProgress={missionImplementationProgress}
                  onPreviewCustDetail={this.handlePreview}
                  missionProgressStatusDic={missionProgressStatusDic}
                />
              </div>
              <div className={styles.rightContent}>
                <CustFeedback
                  onPreviewCustDetail={this.handlePreview}
                  custFeedback={custFeedback}
                />
              </div>
            </div>
        }
        {
          !notMissionCust ?
            <div className={styles.custManagerDetailSection}>
              <CustManagerDetailScope
                detailData={custManagerScopeData}
                currentOrgLevel={level}
                isFold={isFold}
              />
            </div> : null
        }
      </div>
    );
  }
}
