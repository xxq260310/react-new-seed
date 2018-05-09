/**
 * @file customerPool/taskFlow/SightingTelescope.js
 *  客户池-自建任务表单-瞄准镜圈人
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SelectLabelCust from '../SelectLabelCust';
import { fsp } from '../../../../helper';

import styles from './sightingTelescope.less';

export default class SightingTelescope extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    switchBottomFromSearch: PropTypes.func.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    orgId: PropTypes.string.isRequired,
    isAuthorize: PropTypes.bool,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    // 设置下一步按钮可点击状态
    setNextStepBtnDisabled: PropTypes.func.isRequired,
    nextStepBtnIsDisabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    visible: false,
    isAuthorize: false,
  }

  componentDidMount() {
    // 在初始化的时候，回滚fsp滚动条到顶部
    fsp.scrollToTop();
  }

  getData() {
    return this.selectLabelCustRef.getData();
  }

  render() {
    const {
      dict,
      visible,
      onCancel,
      onChange,
      switchBottomFromSearch,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      circlePeopleData,
      getLabelInfo,
      peopleOfLabelData,
      getLabelPeople,
      storedTaskFlowData,
      orgId,
      isAuthorize,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      setNextStepBtnDisabled,
      nextStepBtnIsDisabled,
    } = this.props;
    const cls = classnames({
      [styles.hide]: !visible,
    });
    return (
      <div className={cls}>
        <div>
          <SelectLabelCust
            dict={dict}
            onCancel={onCancel}
            onChange={onChange}
            switchBottomFromSearch={switchBottomFromSearch}
            isLoadingEnd={isLoadingEnd}
            isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
            visible={visible}
            circlePeopleData={circlePeopleData}
            getLabelInfo={getLabelInfo}
            peopleOfLabelData={peopleOfLabelData}
            getLabelPeople={getLabelPeople}
            storedData={storedTaskFlowData}
            ref={ref => (this.selectLabelCustRef = ref)}
            orgId={orgId}
            isAuthorize={isAuthorize}
            getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
            sightingTelescopeFilters={sightingTelescopeFilters}
            setNextStepBtnDisabled={setNextStepBtnDisabled}
            nextStepBtnIsDisabled={nextStepBtnIsDisabled}
          />
        </div>
      </div>
    );
  }
}
