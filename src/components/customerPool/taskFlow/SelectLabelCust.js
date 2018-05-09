import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input } from 'antd';
import TaskSearchRow from './TaskSearchRow';
import { emp, fsp } from '../../../helper';
import styles from './selectLabelCust.less';
import logable from '../../../decorators/logable';

const EMPTY_OBJECT = {};
const Search = Input.Search;

// 是否是瞄准镜标签
const isSightLabel = source => source === 'jzyx';

export default class SelectLabelCust extends PureComponent {
  static propTypes = {
    dict: PropTypes.object.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    orgId: PropTypes.string.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    isSightTelescopeLoadingEnd: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    isAuthorize: PropTypes.bool,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    switchBottomFromSearch: PropTypes.func.isRequired,
    // 设置下一步按钮可点击状态
    setNextStepBtnDisabled: PropTypes.func.isRequired,
    nextStepBtnIsDisabled: PropTypes.bool.isRequired,
    // 是否显示瞄准镜圈人组件
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    storedData: {},
    isAuthorize: false,
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { labelCust = EMPTY_OBJECT } = storedData;
    const {
      condition = '',
      labelId = '',
      shouldclearBottomLabel = true,
      currentSelectLabelName = null,
      currentFilterNum = 0,
    } = labelCust || EMPTY_OBJECT;

    this.state = {
      current: 0,
      labelCust,
      condition,
      currentSelectLabel: labelId,
      labelId,
      tipsSize: this.props.circlePeopleData.length,
      shouldclearBottomLabel,
      currentFilterNum,
      currentSelectLabelName,
    };
    this.bigBtn = true;
  }

  componentDidMount() {
    // 在初始化的时候，回滚fsp滚动条到顶部
    fsp.scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    const {
      circlePeopleData,
      visible,
      setNextStepBtnDisabled,
      nextStepBtnIsDisabled,
    } = nextProps;
    const { currentFilterNum, labelId } = this.state;
    const hasCust = currentFilterNum > 0 && !_.isEmpty(labelId);
    const { circlePeopleData: prevCirclePeopleData } = this.props;
    if (circlePeopleData !== prevCirclePeopleData) {
      this.setState({
        tipsSize: _.size(circlePeopleData),
      });
    }
    // 从导入客户切换到瞄准镜圈人时
    if (visible) {
      // 如果当前选择客户数量不为0，并且“下一步”按钮状态是不可点击状态，将按钮状态修改为可点击
      if (hasCust && nextStepBtnIsDisabled) {
        setNextStepBtnDisabled(false);
      }
      // 如果当前选择客户数量为0，并且“下一步”按钮状态是可点击状态，将按钮状态修改为不可点击
      if (!hasCust && !nextStepBtnIsDisabled) {
        setNextStepBtnDisabled(true);
      }
    }
  }

  @autobind
  getData() {
    const { labelId = '', condition, tipsSize } = this.state;

    const {
      filterNumObject = {},
      argsOfQueryCustomer = {},
      currentFilterObject = {},
      currentAllFilterState = {},
      allFiltersCloseIconState = {},
    } = this.taskSearchRowRef.getSelectFilters();

    // 以后circlePeopleData分页这个地方的代码需要调整
    // 先标记一下
    const { circlePeopleData } = this.props;
    const { shouldclearBottomLabel, currentFilterNum, currentSelectLabelName } = this.state;
    const matchedData = _.find(circlePeopleData, item => item.id === labelId);
    const { labelDesc = '', labelMapping, labelName = '', customNum = 0, source } = matchedData || EMPTY_OBJECT;

    const labelCust = {
      labelId,
      labelMapping,
      labelDesc,
      condition,
      custNum: `${labelId}` in filterNumObject ? filterNumObject[labelId] : customNum,
      customNum,
      tipsSize,
      labelName,
      custSource: '瞄准镜标签',
      argsOfQueryCustomer,
      currentFilterObject,
      currentAllFilterState,
      allFiltersCloseIconState,
      filterNumObject,
      shouldclearBottomLabel,
      currentFilterNum,
      currentSelectLabelName,
      // 任务提示
      // 来自瞄准镜标签，则展示变量任务提示
      // 来自普通标签，则展示普通任务提示
      missionDesc: isSightLabel(source) ? `该客户筛选自$瞄准镜标签#${labelId}#` : `该客户筛选自${labelName},`,
    };

    return {
      labelCust,
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索标签名称' } })
  handleSearchClick(value) {
    const {
      getLabelInfo,
      isAuthorize,
      orgId,
      setNextStepBtnDisabled,
    } = this.props;
    const param = {
      condition: value,
    };
    this.setState({
      shouldclearBottomLabel: true,
      condition: value,
      labelId: '',
      labelDesc: '',
      custNum: 0,
      currentSelectLabel: '',
      currentSelectLabelName: '',
    }, () => {
      // 点击搜索时会清空当前选择的客户，所以将下一步按钮设置不可点
      setNextStepBtnDisabled(true);
    });
    const clearFromSearch = true;
    this.props.switchBottomFromSearch(clearFromSearch); // 隐藏底部标签文字
    if (_.isEmpty(value)) {
      this.setState({
        tipsSize: 0,
      });
    }
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

  @autobind
  handleRadioChange({ currentLabelId, filterNumObject, currentSelectLabelName }) {
    const currentFilterNum = filterNumObject && filterNumObject[currentLabelId];
    const { setNextStepBtnDisabled } = this.props;
    const state = {
      labelId: currentLabelId || this.state.labelId,
      currentSelectLabel: currentLabelId || this.state.labelId,
      currentSelectLabelName: currentSelectLabelName || this.state.currentSelectLabelName,
      currentFilterNum:
      currentFilterNum !== undefined ? currentFilterNum : this.state.currentFilterNum,
      clearFromSearch: false,
    };

    this.setState({
      ...state,
    }, () => {
      // 如果选择的客户数量大于0 将下一步按钮状态修改为可点击
      setNextStepBtnDisabled(!state.currentFilterNum > 0);
    });
    // 将标签列表项的全部状态信息暴露出去
    this.props.onChange({
      ...state,
    });
  }


  render() {
    const {
      getLabelPeople,
      circlePeopleData,
      peopleOfLabelData,
      orgId,
      isLoadingEnd,
      isSightTelescopeLoadingEnd,
      onCancel,
      isAuthorize,
      dict,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
      storedData,
    } = this.props;
    const { condition, currentSelectLabel, tipsSize } = this.state;
    return (
      <div className={styles.searchContact}>
        <Search
          placeholder="标签名称"
          onSearch={this.handleSearchClick}
          style={{
            height: '28px',
            width: '186px',
          }}
          defaultValue={condition}
          enterButton
        />
        <h4 className={styles.tipsWord}>共有<span>{tipsSize}</span>条可选标签</h4>
        <TaskSearchRow
          ref={(ref) => {
            if (ref) {
              this.taskSearchRowRef = ref;
            }
          }}
          dict={dict}
          onCancel={onCancel}
          isLoadingEnd={isLoadingEnd}
          isSightTelescopeLoadingEnd={isSightTelescopeLoadingEnd}
          onChange={this.handleRadioChange}
          circlePeopleData={circlePeopleData}
          getLabelPeople={getLabelPeople}
          peopleOfLabelData={peopleOfLabelData}
          condition={condition}
          currentSelectLabel={currentSelectLabel}
          orgId={orgId}
          isAuthorize={isAuthorize}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
          getFilterNumberList={this.getFilterNumberList}
          storedData={storedData}
        />
      </div>
    );
  }
}

