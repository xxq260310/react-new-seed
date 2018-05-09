/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 10:29:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-13 14:10:18
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import CustomerSegment from './CustomerSegment';
import SelectLabelCust from './SelectLabelCust';
import styles from './pickTargetCustomer.less';
import logable from '../../../decorators/logable';

const TabPane = Tabs.TabPane;

@RestoreScrollTop
export default class PickTargetCustomer extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    currentTab: PropTypes.string.isRequired,
    saveCurrentTab: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    orgId: PropTypes.string,
    isLoadingEnd: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isHasAuthorize: PropTypes.bool,
  };

  static defaultProps = {
    orgId: null,
    isHasAuthorize: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentKey: '1',
    };
  }

  @autobind
  getData() {
    let custData = {
      custSegment: {},
    };
    let labelCustData = {
      labelCust: {},
    };
    if (this.customerSegmentRef) {
      custData = this.customerSegmentRef.getData();
    }
    if (this.selectLabelCustRef) {
      labelCustData = this.selectLabelCustRef.getData();
    }
    return _.merge(custData, labelCustData);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab:客户细分/标签圈人' } })
  handleTabChange(key) {
    const { saveCurrentTab } = this.props;
    this.setState({
      currentKey: key,
    });
    saveCurrentTab(key);
  }

  render() {
    const {
      onPreview,
      priviewCustFileData,
      currentTab,
      storedTaskFlowData,
      getLabelInfo,
      circlePeopleData,
      getLabelPeople,
      peopleOfLabelData,
      orgId,
      isLoadingEnd,
      onCancel,
      isHasAuthorize,
      visible,
    } = this.props;
    const { currentKey } = this.state;

    // 当前激活的tab
    // 根据缓存数据或者默认初始化数据，恢复tab
    const currentActiveKey = currentTab || currentKey;
    return (
      <div className={styles.pickCustomerSection}>
        <div className={styles.title}>目标客户</div>
        <div className={styles.divider} />
        <div className={styles.tabsSection}>
          <Tabs defaultActiveKey={currentActiveKey} onChange={this.handleTabChange} type="card">
            <TabPane tab="客户细分" key="1">
              <CustomerSegment
                ref={ref => (this.customerSegmentRef = ref)}
                onPreview={onPreview}
                priviewCustFileData={priviewCustFileData}
                storedData={storedTaskFlowData}
              />
            </TabPane>
            <TabPane tab="标签圈人" key="2">
              <SelectLabelCust
                onCancel={onCancel}
                isLoadingEnd={isLoadingEnd}
                visible={visible}
                circlePeopleData={circlePeopleData}
                getLabelInfo={getLabelInfo}
                peopleOfLabelData={peopleOfLabelData}
                getLabelPeople={getLabelPeople}
                storedData={storedTaskFlowData}
                ref={ref => (this.selectLabelCustRef = ref)}
                orgId={orgId}
                isHasAuthorize={isHasAuthorize}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
