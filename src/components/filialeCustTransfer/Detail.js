/**
 * @Author: hongguangqing
 * @Description: 开发关系认定的新开发团队页面
 * @Date: 2018-01-04 13:59:02
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-03-20 16:06:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import CommonTable from '../common/biz/CommonTable';
import ApprovalRecord from '../permission/ApprovalRecord';
import Pagination from '../common/Pagination';
import Icon from '../common/Icon';
import { request, seibelConfig } from '../../config';
import { emp } from '../../helper';
import config from './config';
import styles from './detail.less';
import logable from '../../decorators/logable';

// 表头
const { titleList } = seibelConfig.filialeCustTransfer;
const SINGLECUSTTRANSFER = '0701'; // 单客户人工划转
export default class Detail extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    // 客户表格的分页信息
    getPageAssignment: PropTypes.func.isRequired,
    pageAssignment: PropTypes.object,
  }

  static defaultProps = {
    pageAssignment: {},
  }

  constructor(props) {
    super(props);
    const { assignmentList, page } = props.data;
    this.state = {
      assignmentListData: assignmentList,
      pageData: page,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.setState({
        assignmentListData: data.assignmentList,
        pageData: data.page,
      });
    }
  }


  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { appId } = this.props.data;
    this.props.getPageAssignment({
      appId,
      pageNum: nextPage,
      pageSize: currentPageSize,
    }).then(() => {
      const { pageAssignment } = this.props;
      this.setState({
        assignmentListData: pageAssignment.assignmentList,
        pageData: pageAssignment.page,
      });
    });
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载报错信息' } })
  handleDownloadClick() {}

  render() {
    const {
      id,
      empId,
      empName,
      orgName,
      createTime,
      status,
      subType,
      subTypeDesc,
      currentApproval,
      workflowHistoryBeans,
      assignmentList,
      currentNodeName,
      errorDesc,
      appId: dataId,
    } = this.props.data;
    const {
      location: {
        query: {
          appId = '',
        },
      },
    } = this.props;
    const { pageData, assignmentListData } = this.state;
    if (_.isEmpty(this.props.data)) {
      return null;
    }
    const assignmentListValue = assignmentList[0];
    let custInfoValue;
    let empInfoValue;
    if (!_.isEmpty(assignmentListValue)) {
      // 客户信息
      custInfoValue = `${assignmentListValue.custName} (${assignmentListValue.brokerNumber})`;
      // 服务经理信息
      empInfoValue = `${assignmentListValue.newEmpName} (${assignmentListValue.newEmpId})`;
    }
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 分页
    const paginationOption = {
      current: pageData.curPageNum,
      total: pageData.totalRecordNum,
      pageSize: pageData.pageSize,
      onChange: this.handlePageNumberChange,
    };

    return (
      <div className={styles.detailBox}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div id="detailModule" className={styles.module}>
              <div className={styles.error}>
                {
                  errorDesc
                  ?
                    <p>
                      <Icon type="tishi" />
                      {config.tips[errorDesc]}
                    </p>
                  :
                    null
                }
                {
                  errorDesc === config.errorArray[0]
                  ?
                    <p>
                      <a
                        onClick={this.handleDownloadClick}
                        href={`${request.prefix}/excel/custTransfer/exportExcel?appId=${appId || dataId}&empId=${emp.getId()}`}
                        download
                      >
                        下载报错信息
                      </a>
                    </p>
                  :
                    null
                }
              </div>
              <InfoTitle head="基本信息" />
              <div className={styles.modContent}>
                <div className={styles.propertyList}>
                  <div className={styles.item}>
                    <InfoItem label="划转方式" value={subTypeDesc} />
                  </div>
                  {
                    subType !== SINGLECUSTTRANSFER ? null :
                    <div>
                      <div className={styles.item}>
                        <InfoItem label="选择客户" value={custInfoValue} />
                      </div>
                      <div className={styles.item}>
                        <InfoItem label="选择新服务经理" value={empInfoValue} />
                      </div>
                    </div>
                  }
                </div>
                <CommonTable
                  data={assignmentListData}
                  titleList={titleList}
                />
                {
                  subType !== SINGLECUSTTRANSFER ?
                    <Pagination
                      {...paginationOption}
                    />
                  :
                  null
                }
              </div>
            </div>
            <div id="nginformation_module" className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <InfoItem label="拟稿人" value={drafter} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="提请时间" value={createTime} />
                  </li>
                  <li className={styles.item}>
                    <InfoItem label="状态" value={status} />
                  </li>
                </ul>
              </div>
            </div>
            <div id="approvalRecord_module">
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
