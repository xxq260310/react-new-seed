/**
 * @fileOverview components/customerPool/TargetCustomer.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import _ from 'lodash';

import TargetCustomerRight from './TargetCustomerRight';
import TargetCustomerRow from './TargetCustomerRow';
import logable from '../../../decorators/logable';
import styles from './targetCustomer.less';

// // 当前分页条目
// const CURRENT_PAGE_SIZE = 10;

export default class TargetCustomer extends PureComponent {

  static propTypes = {
    // 当前任务的id
    currentId: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    isFold: PropTypes.bool.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    dict: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
    getCustIncome: PropTypes.func.isRequired,
    monthlyProfits: PropTypes.object.isRequired,
    custIncomeReqState: PropTypes.bool.isRequired,
    targetCustDetail: PropTypes.object.isRequired,
    changeParameter: PropTypes.func.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
    currentMissionFlowId: PropTypes.string,
  }

  static defaultProps = {
    dict: {},
    serviceRecordData: {},
    filesList: [],
    currentMissionFlowId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { queryCustUuid } = this.props;
    queryCustUuid();
  }

  // 查询客户列表项对应的详情
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '客户列表项',
      type: '$props.location.query.type',
      subType: '$props.location.query.subType',
    },
  })
  handleRowClick({ id, missionFlowId }) {
    const {
      currentId,
      changeParameter,
      queryCustUuid,
      getCustDetail,
    } = this.props;
    changeParameter({
      targetCustId: id,
      targetMissionFlowId: missionFlowId,
    });
    getCustDetail({
      custId: id,
      missionId: currentId,
      missionFlowId,
    });
    // 前置请求
    // 因为上传附件需要前置请求一个custUuid
    queryCustUuid();
  }

  @autobind
  renderList() {
    const {
      list,
      isFold,
      currentMissionFlowId,
    } = this.props;
    if (_.isEmpty(list)) {
      return null;
    }
    return list.map(item => <TargetCustomerRow
      key={`${item.custId}-${item.missionFlowId}`}
      item={item}
      isFold={isFold}
      currentMissionFlowId={currentMissionFlowId}
      onClick={this.handleRowClick}
    />);
  }

  render() {
    const {
      isFold,
      dict,
      list,
      handleCollapseClick,
      getServiceRecord,
      serviceRecordData,
      getCustIncome,
      custIncomeReqState,
      monthlyProfits,
      targetCustDetail,
      getCeFileList,
      filesList,
    } = this.props;
    if (_.isEmpty(list)) {
      return null;
    }
    const { executeTypes, serveWay } = dict;
    return (
      <div className={styles.targetCustomer}>
        <div className={styles.listBox}>
          <Row>
            <Col span={12}>
              <div className={styles.list}>
                {this.renderList()}
              </div>
            </Col>
            <Col span={12}>
              {
                !_.isEmpty(targetCustDetail) ?
                  <TargetCustomerRight
                    isFold={isFold}
                    itemData={targetCustDetail}
                    handleCollapseClick={handleCollapseClick}
                    serveWay={serveWay}
                    executeTypes={executeTypes}
                    getServiceRecord={getServiceRecord}
                    serviceRecordData={serviceRecordData}
                    getCustIncome={getCustIncome}
                    monthlyProfits={monthlyProfits}
                    custIncomeReqState={custIncomeReqState}
                    getCeFileList={getCeFileList}
                    filesList={filesList}
                  /> : null
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
