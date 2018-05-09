/**
 * @file components/customerPool/TaskSearchRow.js
 *  客户列表项中的快捷菜单
 * @author zhushengnan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button, Tooltip } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { emp, number } from '../../../helper';
import Loading from '../../../layouts/Loading';
import styles from './taskSearchRow.less';
import { isSightingScope } from '../helper';
import { fspContainer } from '../../../config';
import { getCustomerListFilters } from '../../../helper/page/customerPool';
import FilterModal from './FilterModal';
import logable from '../../../decorators/logable';

const RadioGroup = Radio.Group;
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 10;

function transformNumber(num) {
  return `${number.thousandFormat(num)}人`;
}

function transformDate(date) { // 2017-01-31 12:33:55.0
  if (date) {
    const dateStr = date.split(' ')[0]; // 2017-01-31
    const dateArray = dateStr.split('-'); // ['2017', '01', '31']
    return `${dateArray[0]}年${dateArray[1]}月${dateArray[2]}日`; // 2017年01月31日
  }

  return '--';
}

export default class TaskSearchRow extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    condition: PropTypes.string,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    currentSelectLabel: PropTypes.string.isRequired,
    orgId: PropTypes.string,
    isLoadingEnd: PropTypes.bool.isRequired,
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAuthorize: PropTypes.bool.isRequired,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    storedData: PropTypes.object.isRequired,
  }
  static defaultProps = {
    condition: '',
    orgId: null,
  };

  constructor(props) {
    super(props);
    const {
      storedData: { labelCust = {} },
      // currentSelectLabel = '',
    } = props;

    const {
      argsOfQueryCustomer = {},
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      filterNumObject,
    } = labelCust || {};

    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      // totalRecordNum: 0,
      totalCustNums: 0,
      labelId: '',
      modalVisible: false,
      shouldrenderModal: false,
      title: '',
      currentFilterObject: _.isEmpty(currentFilterObject) ? {} : currentFilterObject,
      currentAllFilterState: _.isEmpty(currentAllFilterState) ? {} : currentAllFilterState,
      allFiltersCloseIconState: _.isEmpty(allFiltersCloseIconState) ? {} : allFiltersCloseIconState,
      filterNumObject: _.isEmpty(filterNumObject) ? {} : filterNumObject,
      // 当前筛选条件
      argsOfQueryCustomer,
      currentSelectLabelName: '',
      currentModalKey: '',
      currentSource: '',
    };
    this.visible = false;
  }

  @autobind
  onAccpeptFilter({
    filterNumObject,
    argsOfQueryCustomer,
    currentFilterObject,
    currentAllFilterState,
    allFiltersCloseIconState,
  }) {
    const { labelId } = this.state;
    this.setState({
      filterNumObject,
      argsOfQueryCustomer,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
    });
    this.props.onChange({
      currentLabelId: labelId,
      filterNumObject,
    });
  }

  // 获取已筛选客户数
  // 获取当前过滤条件
  // 获取当前筛选客户查询条件
  @autobind
  getSelectFilters() {
    return _.pick(this.state, [
      'filterNumObject',
      'argsOfQueryCustomer',
      'currentFilterObject',
      'currentAllFilterState',
      'allFiltersCloseIconState',
    ]);
  }

  @autobind
  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

 /*  @autobind
  getFilterInfo(filters) {
    const stringArray = _.map(filters, (filterObj) => {
      if (!_.isEmpty(filterObj.valueArray) && filterObj.valueArray[0] !== '不限') {
        return `${filterObj.filterLabel}：${filterObj.valueArray.join('，')}`;
      }
      return null;
    });
    return _.compact(stringArray).join(' ； ');
  } */

  @autobind
  getSelectFiltersInfo(filters) {
    if (filters) {
      const title = this.renderFilterTooltip(filters);
      if (title) {
        return (
          <Tooltip
            title={title}
            overlayClassName={styles.filtersTooltip}
            getPopupContainer={this.getPopupContainer}
            placement="bottomRight"
            trigger="hover"
          >
            <div className={styles.selectFiltersInfoActive}>
              查看筛选条件
          </div>
          </Tooltip>
        );
      }
    }
    return (
      <div className={styles.selectFiltersInfo}>
        无筛选条件
      </div>
    );
  }

  @autobind
  changeModalVisible({ modalVisible }) {
    this.setState({
      modalVisible,
    });
  }

  /**
 * 查询标签下客户
 * @param {*} labelId 标签Id
 * @param {*} curPageNum 当前页
 * @param {*} pageSize 当前页条目
 */
  @autobind
  queryPeopleOfLabel({ labelId, curPageNum = 1, pageSize = 10, filter = [] }) {
    const { isAuthorize, orgId, getLabelPeople, onChange } = this.props;
    const { argsOfQueryCustomer } = this.state;
    let payload = {
      curPageNum,
      pageSize,
      enterType: 'labelSearchCustPool',
      labels: [labelId],
    };
    if (!_.isEmpty(argsOfQueryCustomer[`${labelId}`])) {
      // 如果data里面存在payload，就恢复数据，不然就取默认数据
      // 查询客户列表时必传的参数
      const { labels: remberLabels } = argsOfQueryCustomer[`${labelId}`];
      payload = { ...payload, labels: remberLabels };
    }
    // 有权限传orgId，没有权限传ptyMngId
    if (isAuthorize) {
      payload.orgId = orgId;
    } else {
      payload.ptyMngId = emp.getId();
    }

    if (!_.isEmpty(filter)) {
      const { filters, labels } = getCustomerListFilters(filter, labelId);
      payload.filtersReq = filters;
      payload.labels = labels;
    }

    // 获取客户列表
    getLabelPeople(payload).then(() => {
      const { filterNumObject } = this.state;
      // 数据回来后，显示弹框
      this.setState({
        modalVisible: true,
        // 以当前labelId作为key，在第二次打开modal的时候，如果是同一个label，则保留filter数据，否则清空
        currentModalKey: `${labelId}_modalKey`,
      });
      this.visible = true;
      const { peopleOfLabelData, isLoadingEnd, isSightTelescopeLoadingEnd } = this.props;
      const showStatus = this.visible && isLoadingEnd && isSightTelescopeLoadingEnd;
      // 是否展示筛查客户的modal
      if (showStatus) {
        const { custList = [] } = peopleOfLabelData || {};
        const list = _.map(custList, item => ({
          ...item,
          brok_id: item.brokId,
          brok_org_id: item.brokOrgId,
          contact_flag: item.contactFlag,
          lever_code: item.levelName,
          cust_type: item.custType === 'N' ? '高净值' : '零售',
        }));
        let finalFilterNumObject = filterNumObject;
        // 只有点击了筛查客户，才需要替换filterNumObject
        if (!_.isEmpty(labelId) && showStatus) {
          finalFilterNumObject = {
            [labelId]: _.isEmpty(peopleOfLabelData) ? 0 : peopleOfLabelData.totalCount,
          };
        }

        this.filterModal.setFilterTableData({
          list,
          filterNumObject: {
            ...filterNumObject,
            ...finalFilterNumObject,
          },
        });

        this.setState({
          filterNumObject: {
            ...filterNumObject,
            ...finalFilterNumObject,
          },
        });
        onChange({
          currentLabelId: labelId,
          filterNumObject: {
            ...filterNumObject,
            ...finalFilterNumObject,
          },
        });
      }
    });

    this.setState({
      argsOfQueryCustomer: {
        ...argsOfQueryCustomer,
        [labelId]: {
          ...payload,
        },
      },
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  change(e) {
    const { onChange, circlePeopleData } = this.props;
    const { filterNumObject } = this.state;
    const currentLabelId = e.target.value;
    const currentLabelInfo = _.find(circlePeopleData, item => item.id === currentLabelId
      || item.labelMapping === currentLabelId) || {};
    let finalFilterNumObject = filterNumObject;
    if (!(`${currentLabelId}` in finalFilterNumObject)) {
      finalFilterNumObject = {
        [currentLabelId]: currentLabelInfo.customNum,
      };
    }
    this.setState({
      labelId: currentLabelId,
      filterNumObject: {
        ...filterNumObject,
        ...finalFilterNumObject,
      },
      currentSelectLabelName: currentLabelInfo.labelName,
    });

    onChange({
      currentLabelId,
      filterNumObject: {
        ...filterNumObject,
        ...finalFilterNumObject,
      },
      currentSelectLabelName: currentLabelInfo.labelName,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '筛查客户' } })
  handleSeeCust(value = {}) {
    const { currentFilterObject, shouldrenderModal } = this.state;
    const { getFiltersOfSightingTelescope } = this.props;
    // 瞄准镜的label 时取获取对应的筛选条件
    if (isSightingScope(value.source)) {
      getFiltersOfSightingTelescope({
        prodId: value.labelMapping || '',
      });
    }
    this.queryPeopleOfLabel({
      labelId: value.labelMapping,
      curPageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
      filter: currentFilterObject[value.labelMapping] || [],
    });
    this.setState({
      shouldrenderModal: !shouldrenderModal,
      title: value.labelName,
      totalCustNums: value.customNum,
      labelId: value.labelMapping,
      currentSource: value.source,
      curPageNum: INITIAL_PAGE_NUM,
      currentSelectLabelName: value.labelName,
    });
    // 点击筛查客户，将当前标签选中
    this.props.onChange({
      currentLabelId: value.id,
      currentSelectLabelName: value.labelName,
    });
  }


  // Y为高净值、N为非高净值
  @autobind
  renderRadioSection() {
    const { condition, circlePeopleData, currentSelectLabel } = this.props;
    const { filterNumObject, currentAllFilterState } = this.state;
    return _.map(circlePeopleData,
      (item, index) => {
        const currentFilterNum = (`${item.id}` in filterNumObject ?
          filterNumObject[item.id] : item.customNum) || 0;
        const currentSelectFilters = currentAllFilterState[item.id];
        let newDesc = item.labelDesc;
        let newTitle = item.labelName;
        if (!_.isEmpty(condition)) {
          newDesc = _.isEmpty(newDesc)
            ? '--'
            : newDesc.replace(condition, `<span class=${styles.keyword}>${condition}</span>`);
          newTitle = _.isEmpty(newTitle)
            ? '--'
            : newTitle.replace(condition, `<span class=${styles.keyword}>${condition}</span>`);
        }
        const cls = classnames({
          [styles.divRows]: true,
          [styles.active]: currentSelectLabel === item.id,
          [styles.clearBorder]: index === circlePeopleData.length - 1, // 最后一个item清除border
        });

        const btncls = classnames({
          [styles.seeCust]: true,
          [styles.disabled]: item.customNum === 0, // 最后一个item清除border
        });


        return (
          <div
            className={cls}
            key={item.id || item.labelMapping}
          >
            <div className={styles.titleContent}>
              <Radio
                value={item.id}
                key={item.tagNumId || item.labelMapping}
              >
                <span
                  className={styles.title}
                  title={item.labelName}
                  dangerouslySetInnerHTML={{ __html: newTitle }} // eslint-disable-line
                />
                <span className={styles.titExp}>
                  <span>由</span><i>{item.createrName || '--'}</i><span>创建于</span><i>{transformDate(item.createDate)}</i><span>- 客户总数：</span><i>{transformNumber(item.customNum)}</i>
                </span>
              </Radio>
            </div>
            <div className={styles.leftContent}>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: newDesc }} // eslint-disable-line
              />
            </div>
            <div className={styles.divider} />
            <div className={styles.filterCount}>
              已选客户数：<i>{transformNumber(currentFilterNum)}</i>
            </div>
            {this.getSelectFiltersInfo(currentSelectFilters)}
            {
              <Button
                className={btncls}
                disabled={item.customNum === 0}
                onClick={() => this.handleSeeCust(item)}
              >
                筛查客户
              </Button>
            }
          </div>
        );
      });
  }

  @autobind
  renderBottomButton() {
    return (<div>
      <Button
        className={styles.modalButton}
        key="back"
        size="large"
        onClick={this.handleCancel}
      >
        取消
      </Button>
      <Button
        className={styles.modalButton}
        key="back"
        size="large"
        type="primary"
        onClick={this.handleAccept}
      >
        确定
      </Button>
    </div>);
  }

  @autobind
  renderFilterTooltip(filters) {
    let stringArray = _.map(filters, (filterObj) => {
      if (!_.isEmpty(filterObj.valueArray) && filterObj.valueArray[0] !== '不限') {
        return {
          title: filterObj.filterLabel,
          value: filterObj.valueArray.join('，'),
        };
      }
      return null;
    });
    stringArray = _.compact(stringArray);
    if (_.isEmpty(stringArray)) {
      return null;
    }
    return (
      <div className={styles.filterTooltip}>
        {
          _.map(stringArray, (filter, index) => (
            <div className={styles.toolTipItem} key={index}>
              <span className={styles.title}>{`${filter.title}：`}</span>
              <span className={styles.tipsContent}>{filter.value}</span>
            </div>))
        }
      </div>
    );
  }

  render() {
    const {
      currentFilterObject,
      currentAllFilterState,
      currentSelectLabelName,
      allFiltersCloseIconState,
      filterNumObject,
      argsOfQueryCustomer,
      labelId,
      modalVisible,
      shouldrenderModal,
      currentModalKey,
      curPageNum,
      currentSource,
    } = this.state;

    const {
      currentSelectLabel,
      dict,
      sightingTelescopeFilters,
      circlePeopleData,
      peopleOfLabelData,
      getLabelPeople,
      onChange,
      orgId,
      onCancel,
      isAuthorize,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
    } = this.props;

    const cls = classnames({
      [styles.divContent]: true,
      [styles.clearBorder]: circlePeopleData.length === 0, // 没有item清除border
      [styles.hidden]: circlePeopleData.length === 0, // 没有item隐藏
    });

    const filterModalProps = {
      dict,
      circlePeopleData,
      peopleOfLabelData,
      getLabelPeople,
      onChange,
      orgId,
      onCancel,
      isAuthorize,
      sightingTelescopeFilters,
      argsOfQueryCustomer,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      currentSelectLabelName,
      filterNumObject,
      onAccpeptFilter: this.onAccpeptFilter,
      labelId,
      modalVisible,
      changeModalVisible: this.changeModalVisible,
      shouldrenderModal,
      currentModalKey,
      curPageNum,
      currentSource,
    };

    return (
      <div className={cls}>
        <RadioGroup
          name="radiogroup"
          onChange={this.change}
          value={currentSelectLabel}
        >
          {
            this.renderRadioSection()
          }
        </RadioGroup>
        <FilterModal {...filterModalProps} ref={ref => this.filterModal = ref} />
        {
          <Loading loading={!isLoadingEnd || !isSightTelescopeLoadingEnd} />
        }
      </div>
    );
  }
}
