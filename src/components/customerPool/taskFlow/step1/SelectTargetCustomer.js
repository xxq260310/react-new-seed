/**
 * @file customerPool/taskFlow/steps/SelectTargetCustomer.js
 *  客户池-自建任务表单-选择客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import Entry from './Entry';
import ImportCustomers from './ImportCustomers';
import SightingTelescope from './SightingTelescope';
import Header from './Header';
import RestoreScrollTop from '../../../../decorators/restoreScrollTop';
import { fsp, emp } from '../../../../helper';
import logable from '../../../../decorators/logable';

import styles from './selectTargetCustomer.less';

@RestoreScrollTop
export default class SelectTargetCustomer extends PureComponent {
  static propTypes = {
    currentEntry: PropTypes.number,
    dict: PropTypes.object.isRequired,
    isShowTitle: PropTypes.bool,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    switchBottomFromHeader: PropTypes.func.isRequired,
    switchBottomFromSearch: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    orgId: PropTypes.string.isRequired,
    isAuthorize: PropTypes.bool,
    filterModalvisible: PropTypes.bool,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    // 设置下一步按钮可点击状态
    setNextStepBtnDisabled: PropTypes.func.isRequired,
    changeCurrentEntry: PropTypes.func.isRequired,
    nextStepBtnIsDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    // 默认不展示入口
    currentEntry: -1,
    isShowTitle: false,
    isAuthorize: false,
    filterModalvisible: false,
  }

  constructor(props) {
    super(props);
    const { currentEntry } = props;
    this.state = {
      // -1不展示入口
      showEntry: currentEntry === -1,
      // 展示入口1，导入客户
      showImportCustomers: currentEntry === 0,
      // 展示入口2，瞄准镜标签
      showSightingTelescope: currentEntry === 1,
      isFirstTimeChange: true, // 是否是第一次点击切换视图
    };
  }

  getData() {
    const { showSightingTelescope } = this.state;
    // current为0 时 表示当前是导入客户
    // 为1 时 表示当前是瞄准镜
    return {
      currentEntry: +showSightingTelescope,
      importCustomers: this.importCustRef.getFileData(),
      sightingTelescope: this.sightingTelescopeRef.getData(),
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '导入客户' } })
  importCustomers() {
    this.setState({
      showEntry: false,
      showImportCustomers: true,
      showSightingTelescope: false,
    });
    const currentEntry = 0;
    this.props.changeCurrentEntry(currentEntry);
    // 恢复Fsp滚动条
    fsp.scrollToTop();
  }

  // 选中瞄准镜圈人入口时，拉取瞄准镜圈人默认标签列表进行展示
  @autobind
  @logable({ type: 'Click', payload: { name: '瞄准镜圈人' } })
  findPeople() {
    this.setState({
      showEntry: false,
      showImportCustomers: false,
      showSightingTelescope: true,
    });
    const { getLabelInfo, isAuthorize, orgId } = this.props;
    const param = {
      condition: '',
    };
    if (isAuthorize) {
      // 有首页绩效指标查看权限
      getLabelInfo({
        ...param,
        orgId,
      });
    } else {
      getLabelInfo({
        ...param,
        ptyMngId: emp.getId(),
      });
    }
    const currentEntry = 1;
    this.props.changeCurrentEntry(currentEntry);
    // 恢复Fsp滚动条
    fsp.scrollToTop();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '切换至 瞄准镜圈人/导入客户' } })
  changeView() {
    const showImportCustomers = !this.state.showImportCustomers;
    const showSightingTelescope = !this.state.showSightingTelescope;
    this.setState({
      showEntry: false,
      showImportCustomers,
      showSightingTelescope,
      isFirstTimeChange: false,
    });
    /* this.props.switchBottomFromHeader(showImportCustomers); */
    let currentEntry = -1;
    if (showImportCustomers) {
      currentEntry = 0;
    }

    if (showSightingTelescope) {
      currentEntry = 1;
    }
    this.props.changeCurrentEntry(currentEntry);

    if (showSightingTelescope && this.state.isFirstTimeChange &&
      _.isEmpty(this.props.circlePeopleData)) {
      const { getLabelInfo, isAuthorize, orgId } = this.props;
      const param = {
        condition: '',
      };
      if (isAuthorize) {
        // 有首页绩效指标查看权限
        getLabelInfo({
          ...param,
          orgId,
        });
      } else {
        getLabelInfo({
          ...param,
          ptyMngId: emp.getId(),
        });
      }
    }
    // 恢复Fsp滚动条
    fsp.scrollToTop();
  }

  render() {
    const {
      dict,
      isShowTitle,
      onPreview,
      priviewCustFileData,
      storedTaskFlowData,
      onChange,
      switchBottomFromSearch,
      onCancel,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      circlePeopleData,
      getLabelInfo,
      peopleOfLabelData,
      getLabelPeople,
      orgId,
      isAuthorize,
      filterModalvisible,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      setNextStepBtnDisabled,
      nextStepBtnIsDisabled,
    } = this.props;
    const {
      showEntry,
      showImportCustomers,
      showSightingTelescope,
    } = this.state;
    const cls = classnames({
      [styles.hide]: showEntry,
      [styles.header]: true,
    });
    return (
      <div className={styles.customerContent}>
        {isShowTitle && <div className={styles.title}>选择目标客户</div>}
        {
          <div className={cls}>
            <Header
              switchTarget={showImportCustomers ? '瞄准镜圈人' : '导入客户'}
              onClick={this.changeView}
              style={{ fontSize: '15px' }}
            />
          </div>
        }
        <Entry
          visible={showEntry}
          importCustomers={this.importCustomers}
          findPeople={this.findPeople}
        />
        <ImportCustomers
          ref={inst => this.importCustRef = inst}
          visible={showImportCustomers}
          onPreview={onPreview}
          priviewCustFileData={priviewCustFileData}
          storedTaskFlowData={storedTaskFlowData}
          setNextStepBtnDisabled={setNextStepBtnDisabled}
          nextStepBtnIsDisabled={nextStepBtnIsDisabled}
        />
        <SightingTelescope
          ref={r => this.sightingTelescopeRef = r}
          dict={dict}
          visible={showSightingTelescope}
          onCancel={onCancel}
          onChange={onChange}
          switchBottomFromSearch={switchBottomFromSearch}
          isLoadingEnd={isLoadingEnd}
          isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
          circlePeopleData={circlePeopleData}
          getLabelInfo={getLabelInfo}
          peopleOfLabelData={peopleOfLabelData}
          getLabelPeople={getLabelPeople}
          storedTaskFlowData={storedTaskFlowData}
          orgId={orgId}
          isAuthorize={isAuthorize}
          filterModalvisible={filterModalvisible}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
          setNextStepBtnDisabled={setNextStepBtnDisabled}
          nextStepBtnIsDisabled={nextStepBtnIsDisabled}
        />
      </div>
    );
  }
}
