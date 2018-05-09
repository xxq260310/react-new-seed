/**
 * @description 类穿梭框组件，统一样式
 * @author zhangjunli
 * Usage:
 * <Transfer
    subscribeData={array}
    unsubscribeData={array}
    subscribeColumns={array}
    unsubscribeColumns={array}
    rowKey={string}
  />
 * subscribeColumns：必要，第一表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * unsubscribeColumns：必要，第二个表的表头定义，需要指定 column 的 width 属性，否则列头和内容可能不对齐。
 * rowKey： 必要，唯一的标识,用于生成row时内部做唯一的key使用
 * firstTitle: 不必要，有默认值（‘当前订阅服务’），第一个表的title
 * secondTitle： 不必要，有默认值（‘退订服务’），第二个表的title
 * subscribeData：不必要，有默认值（空数据），第一个表的数据源
 * unsubscribeData：不必要，有默认值（空数据），第二个表的数据源
 * checkChange： 不必要，向组件外传递信息，返回此父元素(children：仅为选中的child)
 * transferChange： 不必要，向组件外传递信息，返回第二个table的数据源
 * defaultCheckKey: 不必要，标识子项的默认选中key
 * placeholder： 不必要，搜索框的提示文字
 * showSearch： 不必要，是否显示search框,内部根据传入的属性supportSearchKey值，在现有的数据（除右边表中的）进行搜索
 * pagination： 不必要，页码（不需要页码时，值为false，要页码时，值为对象）
 * supportSearchKey: 不必要,支持通过搜索的key（筛选用），时一个二维数组。
 *                  二维数组（匹配分：模糊和精准），数据顺序固定，第一个是精准匹配数组，第二个是模糊匹配数组
 * aboutRate: 不必要, 长度，内容顺序 固定,第一个是目标佣金率（string类型），第二个是拿到表中对象佣金率的key（string类型）
 * scrollX：不必要，表x方向滑动时，设置的最大宽度。
 *          要考虑到，操作栏的宽度40px，虽然是组件内部添加的，用户传入的scrollX时，需要考虑在内。
 * isNeedTransfer: 不必要，默认值为true。是否有操作列，实现穿梭功能
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, Checkbox } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';

import { dom } from '../../../helper';
import Icon from '../../common/Icon';
import styles from './tableTransfer.less';

const Search = Input.Search;
const actionColumns = (type, isScrollX, handleAction) => {
  function handleClick(flag, item) {
    if (_.isFunction(handleAction)) {
      handleAction(flag, item);
    }
  }
  const param = isScrollX ? (
    { fixed: 'right', width: 40 }
  ) : ({});
  return {
    ...param,
    title: '操作',
    key: 'action',
    render: (item) => {
      if (_.isEmpty(item.parentKey)) {
        return (
          <Icon
            type={type === 'first' ? 'new' : 'shanchu'}
            className={styles.actionIcon}
            onClick={() => { handleClick(type, item); }}
          />
        );
      }
      return (<div className={styles.actionTip}>{item.tip}</div>);
    },
  };
};

const checkColumns = (column, defaultCheckKey, disableCheckKey, handleAction) => {
  function handleClick(item, event) {
    if (_.isFunction(handleAction)) {
      handleAction(item, event);
    }
  }
  return {
    ...column,
    render: (item) => {
      const { key } = column;
      if (!_.isEmpty(item.parentKey)) {
        return (
          <Checkbox
            onChange={event => handleClick(item, event)}
            defaultChecked={item[defaultCheckKey] === 'Y'}
            disabled={item[disableCheckKey] === 'Y'}
          >
            {item[key]}
          </Checkbox>
        );
      }
      return <span>{item[key]}</span>;
    },
  };
};

// 浮点数转换到整数的倍数
const times = 100;

function float2Integer(v) {
  return v * times;
}

function int2Float(v) {
  return Number.parseFloat(v / times);
}

// 浮点数误差
function withinErrorRange(left, right) {
  // 下面注释的发现不好用
  // return Math.abs(left - right) < Number.EPSILON * 4;
  return Math.abs(left - right) < 0.000000001;
}

export default class TableTransfer extends Component {
  static propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstData: PropTypes.array,
    secondData: PropTypes.array,
    transferChange: PropTypes.func,
    checkChange: PropTypes.func,
    placeholder: PropTypes.string,
    showSearch: PropTypes.bool,
    pagination: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    firstColumns: PropTypes.array.isRequired,
    secondColumns: PropTypes.array.isRequired,
    rowKey: PropTypes.string.isRequired,
    defaultCheckKey: PropTypes.string,
    disableCheckKey: PropTypes.string,
    supportSearchKey: PropTypes.array,
    aboutRate: PropTypes.array,
    scrollX: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    isNeedTransfer: PropTypes.bool,
  }

  static defaultProps = {
    firstData: [],
    secondData: [],
    firstTitle: '可选佣金调整',
    secondTitle: '已选产品',
    transferChange: () => {},
    checkChange: () => {},
    placeholder: '',
    showSearch: true,
    defaultCheckKey: '',
    disableCheckKey: '',
    supportSearchKey: [],
    aboutRate: [],
    scrollX: '',
    isNeedTransfer: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      ...this.resetDataSource(),
      sortInfo: null,
    };
    // 含有sort的第一个表头的index值
    this.firstSortIndexs = [];
    // 含有sort的第二个表头的index值
    this.secondSortIndexs = [];
    // firstTable表头的CSS选择器前缀
    this.firstPrefix = `.${styles.leftContent} .ant-table .ant-table-content .ant-table-thead > tr`;
    // secondTable表头的CSS选择器前缀
    this.secondPrefix = `.${styles.rightContent} .ant-table .ant-table-content .ant-table-thead > tr`;
  }

  componentDidMount() {
    const { firstColumns, secondColumns } = this.props;
    // 找出两个表头中那个字段需要sort的，并保留其index值
    this.firstSortIndexs = this.fetchSortIndex(firstColumns);
    this.secondSortIndexs = this.fetchSortIndex(secondColumns);
    // 给每一个含有sort的表头添加一个class类
    // 本组件使用antd的Table组件
    this.addClassForTableHead(this.firstSortIndexs, this.firstPrefix, 'first');
    this.addClassForTableHead(this.secondSortIndexs, this.secondPrefix, 'second');
  }

  componentWillReceiveProps(nextProps) {
    const { firstData: nextData, secondData: nextSecondData } = nextProps;
    const { firstData: prevData, secondData: prevSecondData } = this.props;
    if (!_.isEqual(prevData, nextData) || !_.isEqual(prevSecondData, nextSecondData)) {
      this.setState(this.resetDataSource(nextProps));
    }
  }

  // 获取所有默认选中
  getAllDefaultCheck(dataArray, rowKey, defaultCheckKey) {
    let defaultCheck = {};
    _.forEach(
      dataArray,
      (item) => {
        if (!_.isEmpty(item.children)) {
          const defaultChildCheck = _.filter(
            item.children,
            child => child[defaultCheckKey] === 'Y', // 真实数据源字段为 'Y'
          );
          defaultCheck = { ...defaultCheck, [item[rowKey]]: defaultChildCheck };
        }
      },
    );
    return defaultCheck;
  }

  // 获取右表所有的佣金率
  @autobind
  getTotalRate(param) {
    const { aboutRate, secondData } = param;
    if (_.isEmpty(aboutRate)) {
      return 0;
    }
    const rateKey = _.last(aboutRate);
    let totalRate = 0;
    secondData.forEach(
      (item) => {
        totalRate += float2Integer(_.toNumber(item[rateKey]));
      },
    );
    return int2Float(totalRate);
  }

  // firfox浏览器上，table设置scroll的y属性时，无论是否上下滑动，竖向滚动条的位置始终存在。
  // 选择性的设置scroll的y属性，只有在数据有children时，设置，其他，不设置。
  @autobind
  getTableScroll(data) {
    const { scrollX } = this.props;
    const hasChildren = this.isHasChildren(data);
    let x = 0;
    let y = 0;
    if (scrollX === '' && hasChildren) {
      y = 248; // 245 groogle
    }
    if (scrollX !== '') {
      x = scrollX;
      if (hasChildren) {
        y = 248;
      }
    }
    return { y, x };
  }

  @autobind
  handleSortClick(which, key) {
    return () => {
      const { sortInfo } = this.state;
      let orderText = 'descend';
      if (!_.isEmpty(sortInfo)) {
        // 如果有值则取反
        const { order } = sortInfo;
        if (order === 'descend') orderText = 'ascend';
        if (order === 'ascend') orderText = 'descend';
      }
      this.setState({
        sortInfo: {
          which,
          key,
          order: orderText,
        },
      });
    };
  }

  @autobind
  fetchSortIndex(columns) {
    const sortIndexs = [];
    _.each(columns, (column, index) => {
      if (column.sorter) sortIndexs.push({ index, key: column.key });
    });
    return sortIndexs;
  }

  @autobind
  addActionColumn(isNeed, type, scrollX) {
    return (
      isNeed ? (
        actionColumns(type, scrollX !== '', this.handleClick) // scrollX 的默认值为 ''
      ) : {}
    );
  }

  @autobind
  addClassForTableHead(sortIndexs, prefix, which) {
    if (_.isEmpty(sortIndexs)) return;
    _.each(sortIndexs, (item) => {
      const ele = document.querySelector(`${prefix}>th:nth-child(${item.index + 1})`);
      dom.setAttribute(ele, 'data-transferSort', true);
      // 给dom添加点击事件
      ele.addEventListener('click', this.handleSortClick(which, item.key), false);
    });
  }

  // 重置数据源
  @autobind
  resetDataSource(nextProps) {
    const {
      firstData,
      secondData,
      firstColumns,
      secondColumns,
      rowKey,
      defaultCheckKey,
      disableCheckKey,
      aboutRate,
      scrollX,
      isNeedTransfer,
    } = nextProps || this.props;
    // 第一步，添加方便操作的key
    const initFirstArray = this.initTableData(firstData, rowKey, defaultCheckKey);
    const initSecondArray = this.initTableData(secondData, rowKey, defaultCheckKey);
    // 第二步，是否为右表首列子项添加 check 框
    const totalData = [...firstData, ...secondData];
    const checkFlag = this.isHasChildren(totalData);
    // check column 和 用户自定义 column，因都操作了render，故是互斥的。
    const initSecondColumns = checkFlag ? (
      this.initTableColumn(secondColumns, defaultCheckKey, disableCheckKey)
    ) : secondColumns;
    // 第三步，佣金率相关
    const totalRate = this.getTotalRate({ aboutRate, secondData });
    const rateFlag = !_.isEmpty(aboutRate);
    let differenceRate = 0;
    if (rateFlag) {
      differenceRate = float2Integer(totalRate) - float2Integer(_.toNumber(_.head(aboutRate)));
    }
    // 第四步，返回组合对象
    return {
      totalData,
      checked: this.getAllDefaultCheck(initSecondArray, rowKey, defaultCheckKey),
      firstArray: this.hiddenChildren(initFirstArray),
      secondArray: initSecondArray,
      firstColumns: [
        ...firstColumns,
        this.addActionColumn(isNeedTransfer, 'first', scrollX),
      ],
      secondColumns: [
        ...initSecondColumns,
        this.addActionColumn(isNeedTransfer, 'second', scrollX),
      ],
      rate: {
        rateFlag, // 是否计算佣金率
        differenceRate: int2Float(differenceRate),  // 差值：右表totalRate-目标佣金率
        totalRate,   // 右表totalRate
        tip: { type: '', content: '' }, // 佣金率提示
      },
    };
    /*
     tip 有且只出现一条
         有三种情况（等于，高于，低于)
         两种类型（finish(等于时出现)，warning(高于，低于时出现)）
    */
  }

  // 添加属性，方便操作.初始操作为show children状态
  // parentKey:辨识子元素挂在哪个父元素上
  // tip属性，显示子项勾选框对应的提示，（对用户是透明的）
  initTableData(dataArray, rowKey, defaultCheckKey) {
    const newDatatArray = _.cloneDeep(dataArray);
    const newData = newDatatArray.map(
      (item) => {
        // TODO sunweibin 首先判断它有children这个key不
        if (Array.isArray(item.children) && !_.isEmpty(item.children)) {
          const newChildren = item.children.map(
            (child) => {
              const checkFlag = child[defaultCheckKey] === 'Y';
              const newChild = {
                ...child,
                parentKey: item[rowKey],
                tip: checkFlag ? '取消可选产品' : '标记可选产品',
              };
              return _.isEmpty(defaultCheckKey) ?
                newChild : { ...newChild };
            },
          );
          return { ...item, children: newChildren };
        }
        return _.head(this.hiddenChildren([item]));
      },
    );
    return newData;
  }

  // 判断是否children，可展开。
  isHasChildren(data) {
    const newData = _.filter(
      data,
      item => item.children,
    );
    return !_.isEmpty(newData);
  }

  // 为child行，第一列增加check框
  @autobind
  initTableColumn(columnArray, defaultCheckKey, disableCheckKey) {
    return columnArray.map(
      (item, index) => {
        if (index === 0) {
          return checkColumns(_.omit(item, 'dataIndex'), defaultCheckKey, disableCheckKey, this.handleCheck);
        }
        return item;
      },
    );
  }

  replaceKeyOfObject(item, oldKey, newKey) {
    let newItem = {};
    const keys = Object.keys(item);
    keys.forEach(
      (key) => {
        if (key === oldKey) {
          // newKey 存在，为替换key操作
          // newKey 不存在，为移除key操作
          if (!_.isEmpty(newKey)) {
            newItem = { ...newItem, [newKey]: item[key] };
          }
        } else {
          newItem = { ...newItem, [key]: item[key] };
        }
      },
    );
    return newItem;
  }

  // hidden:table不显示树形数据结构
  @autobind
  hiddenChildren(dataArray) {
    const newDataArray = dataArray.map(
      (item) => {
        if (item.children) {
          return this.replaceKeyOfObject(item, 'children', 'hidden');
        }
        return item;
      },
    );
    return newDataArray;
  }

  // children:table显示树形数据结构
  @autobind
  showChildren(dataArray) {
    const newDataArray = dataArray.map(
      (item) => {
        if (item.hidden) {
          return this.replaceKeyOfObject(item, 'hidden', 'children');
        }
        return item;
      },
    );
    return newDataArray;
  }

  // 去除右表未选中的child
  @autobind
  filterSecondData(secondArray, newCheck) {
    const { rowKey } = this.props;
    return _.map(
      secondArray,
      (item) => {
        if (!_.isEmpty(item.children)) {
          const itemChecked = newCheck[item[rowKey]] || {};
          return { ...item, children: itemChecked };
        }
        return item;
      },
    );
  }


  // 更新数据源，触发render
  @autobind
  updateAllData(
    modifyrate,
    flag,
    newSelect,
    newChecked,
    modifyRemoveArray,
    modifyAddArray,
    currentTableType,
  ) {
    const { transferChange } = this.props;
    const { rate, rate: { rateFlag } } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const updateFirstArray = isOperateFirstTable ? modifyRemoveArray : modifyAddArray;
    const updateSecondArray = isOperateFirstTable ? modifyAddArray : modifyRemoveArray;
    const changeSecondArray = this.filterSecondData(updateSecondArray, newChecked);
    this.setState({
      checked: newChecked,
      firstArray: updateFirstArray,
      secondArray: updateSecondArray,
      rate: { ...rate, ...modifyrate },
    }, transferChange(
      flag,
      newSelect,
      changeSecondArray,
      (rateFlag ? modifyrate.differenceRate : undefined),
    ));
  }

  // 子项勾选和取消勾选，为显示不同的提示，需要更新所在的数据源
  @autobind
  updateSecondData(selected) {
    const { secondArray } = this.state;
    const { rowKey } = this.props;
    return secondArray.map(
      (item) => {
        if (item[rowKey] === selected.parentKey) {
          const { children } = item;
          const newChildren = [];
          children.forEach(
            (child) => {
              if (child[rowKey] === selected[rowKey]) {
                newChildren.push(selected);
              } else {
                newChildren.push(child);
              }
            },
          );
          return { ...item, children: newChildren };
        }
        return item;
      },
    );
  }

  // 点击check框触发事件，此父元素下选中所有child，所有选中的child
  @autobind
  handleCheck(selected, event) {
    const { checked, secondArray } = this.state;
    const { checkChange, rowKey } = this.props;
    const selectChildren = checked[selected.parentKey] || [];
    const parentItem = _.head(_.filter(
      secondArray,
      item => item[rowKey] === selected.parentKey,
    ));
    // 根据check的状态，添加或移除
    let newSelectChildren = [];
    if (event.target.checked) {
      // 添加
      newSelectChildren = [...selectChildren, { ...selected, tip: '取消可选产品' }];
    } else {
      // 移除
      newSelectChildren = _.filter(
        selectChildren,
        selectedChild => selectedChild[rowKey] !== selected[rowKey],
      );
    }
    // 更新对应的数据源，更改子项勾选对应的提示
    const newSecondData = this.updateSecondData({
      ...selected,
      tip: `${event.target.checked ? '取消可选产品' : '标记可选产品'}`,
    });
    // 更新选中的项
    const selectAll = { ...checked, [selected.parentKey]: newSelectChildren };
    const newParentItem = { ...parentItem, children: newSelectChildren };
    const changeSecondData = this.filterSecondData(newSecondData, selectAll);
    this.setState({
      checked: selectAll,
      secondArray: newSecondData,
    }, checkChange(newParentItem, changeSecondData));
  }

  // 佣金率相关
  @autobind
  updateAboutRates(selected, state) {
    const { aboutRate } = this.props;
    const { rate: { rateFlag, totalRate } } = this.state;
    if (!rateFlag) {
      return {
        rateFlag: false, // 是否计算佣金率
        differenceRate: 0,  // 差值：右表totalRate-目标佣金率
        totalRate: 0,   // 右表totalRate
        tip: { type: '', content: '' }, // 佣金率提示
      };
    }

    const rateKey = _.last(aboutRate);
    const targetRate = _.head(aboutRate);
    let modifyTotalRate = 0;
    let modifyDifferenceRate = 0;
    let modifyTip = {};
    // JS浮点数精度问题修改
    if (state === 'add') {
      modifyTotalRate = float2Integer(totalRate) + float2Integer(_.toNumber(selected[rateKey]));
    } else {
      modifyTotalRate = float2Integer(totalRate) - float2Integer(_.toNumber(selected[rateKey]));
    }
    modifyDifferenceRate = modifyTotalRate - float2Integer(_.toNumber(targetRate));
    if (withinErrorRange(modifyDifferenceRate, 0)) {
      modifyTip = { type: 'finish', content: '产品组合等于目标佣金率' };
    } else if (modifyDifferenceRate > 0) {
      modifyTip = {
        type: 'warning',
        content: `产品组合比目标佣金率高${(Math.abs(int2Float(modifyDifferenceRate))).toFixed(2)}‰`,
      };
    } else {
      modifyTip = {
        type: 'warning',
        content: `产品组合离目标佣金率还差${(Math.abs(int2Float(modifyDifferenceRate))).toFixed(2)}‰`,
      };
    }
    return {
      totalRate: int2Float(modifyTotalRate),
      differenceRate: int2Float(modifyDifferenceRate),
      tip: modifyTip,
    };
  }

  @autobind
  handleClick(currentTableType, selected) {
    const { rowKey, defaultCheckKey } = this.props;
    const {
      secondArray,
      firstArray,
      checked,
      totalData,
    } = this.state;
    const isOperateFirstTable = currentTableType === 'first';
    const needAddArray = isOperateFirstTable ? secondArray : firstArray;
    const needRemoveArray = isOperateFirstTable ? firstArray : secondArray;
    let modifyRate = {};
    // 更新操作表格的数据源。remove要移动的元素
    const modifyRemoveArray = _.filter(
      needRemoveArray,
      item => item[rowKey] !== selected[rowKey],
    );

    // 更新当前对象
    let modifySelected = {};
    let flag = 'add';
    let newSelect = selected;
    let currentChecked = { [selected[rowKey]]: [] };
    if (isOperateFirstTable) {
      modifySelected = _.head(
        this.initTableData(
          this.showChildren([selected]),
          rowKey,
          defaultCheckKey,
        ),
      );
      if (!_.isEmpty(modifySelected.children)) {
        currentChecked = this.getAllDefaultCheck([modifySelected], rowKey, defaultCheckKey);
        newSelect = { ...modifySelected, children: currentChecked[selected[rowKey]] };
      } else {
        newSelect = modifySelected;
      }
      // 更新佣金率相关项
      modifyRate = this.updateAboutRates(modifySelected, 'add');
    } else {
      flag = 'remove';
      const recoverSelect = _.head(_.filter(
        totalData,
        item => item[rowKey] === selected[rowKey],
      ));
      modifySelected = _.head(this.hiddenChildren([recoverSelect]));
      // 更新佣金率相关项
      modifyRate = this.updateAboutRates(modifySelected, 'remove');
    }
    // 更新选中的数组
    const newChecked = { ...checked, ...currentChecked };
    // 更新数据源，添加要移动的元素
    const modifyAddArray = [modifySelected, ...needAddArray];
    // 更新数据源
    this.updateAllData(
      modifyRate,
      flag,
      newSelect,
      newChecked,
      modifyRemoveArray,
      modifyAddArray,
      currentTableType,
    );
  }

  @autobind
  handleSearch(keyword) {
    const { supportSearchKey, rowKey, defaultCheckKey } = this.props;
    const { secondArray, totalData } = this.state;
    // 左边表中数据，不能展开
    const initFistData = this.hiddenChildren(
      this.initTableData(totalData, rowKey, defaultCheckKey),
    );
    // 搜索的数据源为未被选的数据 = 原始数据源 - 被选中的数据源
    const searchDataSource = _.differenceBy(initFistData, secondArray, `${rowKey}`);
    // 无筛选key时，筛选功能不能使用
    if (_.isEmpty(supportSearchKey)) {
      return;
    }
    // 关键字为 空字符串时，展示全部未被选中数据
    if (keyword === '') {
      this.setState({ firstArray: searchDataSource });
    }
    // 根据key，执行筛选功能
    const newFirstArray = _.filter(
      searchDataSource,
      (item) => {
        const resultArray = _.filter(
          supportSearchKey,
          (keys, index) => {
            // 精准匹配
            if (index === 0) {
              return !_.isEmpty(_.filter(keys, key =>
                (_.isEmpty(item[key]) ? false : (item[key] === keyword))));
            }
            // 模糊匹配
            return !_.isEmpty(_.filter(keys, key =>
              (_.isEmpty(item[key]) ? false : (item[key].indexOf(keyword) !== -1))));
          },
        );
        return !_.isEmpty(resultArray);
      },
    );
    // 更新数据源
    this.setState({ firstArray: newFirstArray });
  }

  @autobind
  renderTips() {
    const { rate: { tip } } = this.state;
    if (_.isEmpty(tip.type)) {
      return null;
    }
    const isWarning = tip.type === 'warning';
    const iconType = isWarning ? 'tixing' : 'duihao';
    return (
      <div className={styles.tipRow}>
        <div className={styles.iconColumns}>
          <Icon
            type={iconType}
            className={classnames(
              styles.icon,
              { [styles.warningIcon]: isWarning },
            )}
          />
        </div>
        <div
          className={classnames(
            styles.tip,
            { [styles.warningTip]: isWarning },
          )}
        >
          {tip.content}
        </div>
      </div>
    );
  }

  render() {
    const {
      firstTitle,
      secondTitle,
      placeholder,
      showSearch,
      pagination,
      rowKey,
    } = this.props;
    const {
      firstArray,
      secondArray,
      firstColumns,
      secondColumns,
      sortInfo,
    } = this.state;
    // 修改firstColumns
    const newFirstColumn = firstColumns.map((column) => {
      const { sorter, key } = column;
      if (sorter) {
        return {
          ...column,
          sortOrder: !_.isEmpty(sortInfo)
            && sortInfo.which === 'first'
            && sortInfo.key === key
            && sortInfo.order,
        };
      }
      return column;
    });
    const newSecondColumn = secondColumns.map((column) => {
      const { sorter, key } = column;
      if (sorter) {
        return {
          ...column,
          sortOrder: !_.isEmpty(sortInfo)
            && sortInfo.which === 'second'
            && sortInfo.key === key
            && sortInfo.order,
        };
      }
      return column;
    });

    const firstScroll = this.getTableScroll(firstArray);
    const secondScroll = this.getTableScroll(secondArray);

    // 默认文案配置
    const locale = {
      // 空数据时的文案
      emptyText: '暂无数据',
    };
    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={classnames(styles.header, styles.leftHeader)}>
            <div className={styles.titleLabel}>{firstTitle}</div>
            {
              showSearch ? (
                <div>
                  <Search
                    placeholder={placeholder}
                    onSearch={(value) => { this.handleSearch(value); }}
                    enterButton
                  />
                </div>
              ) : (null)
            }
          </div>
          <Table
            rowKey={record => record[rowKey]}
            columns={newFirstColumn}
            dataSource={firstArray}
            pagination={pagination}
            scroll={firstScroll}
            locale={locale}
          />
        </div>
        <div className={styles.rightContent}>
          <div className={classnames(styles.header, styles.rightHeader)}>
            <div className={styles.titleLabel}>{secondTitle}</div>
            <div className={styles.tipContainer}>
              {this.renderTips()}
            </div>
          </div>
          <Table
            rowKey={record => record[rowKey]}
            columns={newSecondColumn}
            dataSource={secondArray}
            pagination={pagination}
            scroll={secondScroll}
            locale={locale}
          />
        </div>
      </div>
    );
  }
}
