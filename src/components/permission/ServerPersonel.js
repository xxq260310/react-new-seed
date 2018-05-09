import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import Button from '../common/Button';
import TableList from '../common/TableList';
import style from './serverpersonel.less';
import AutoComplete from '../common/similarAutoComplete';
import logable from '../../decorators/logable';

// 私密客户取消
const PERMISSION_CUST_CANCLE = '0102';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    info: PropTypes.array,
    statusType: PropTypes.string.isRequired,
    subType: PropTypes.string,
    onEmitEvent: PropTypes.func,
    type: PropTypes.string.isRequired,
    searchServerPersonList: PropTypes.array,
    custId: PropTypes.string,
  }

  static defaultProps = {
    info: [],
    searchServerPersonList: [],
    onEmitEvent: () => {},
    subType: '',
    custId: '',
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 服务人员信息
      serverInfo: [],
      // 选中作为 添加项 添加到table列表中
      addSelectedValue: {},
      // 选中table列表中的某一项 作为 即将要移除
      removeSelectedValue: {},
    };
  }
  componentWillMount() {
    this.setState({ serverInfo: this.props.info });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.info !== this.props.info) {
      this.setState({ serverInfo: newProps.info });
    }
    if (!_.isEqual(this.props.custId, newProps.custId)) {
      this.setState({ serverInfo: [] });
    }
  }

  // 能修改服务经理
  @autobind
  canModify() {
    const { statusType, subType } = this.props;
    return (statusType === 'modify' && subType !== PERMISSION_CUST_CANCLE && subType !== '');
  }

  get modifyDom() { // 只读或者编辑状态下所对应的操作状态
    let result;
    if (this.canModify()) {
      result = (
        <div className={style.spBtnGroup}>
          <span className={style.spAddServerPerson}>新增服务人员：</span>
          <div className={style.spAddDropdownSelect}>
            <AutoComplete
              placeholder="请输入姓名或工号"
              searchList={this.props.searchServerPersonList}
              showObjKey="ptyMngName"
              objId="ptyMngId"
              isImmediatelySearch
              width={200}
              onSelect={this.dropdownSelectedItem}
              onSearch={this.dropdownToSearchInfo}
            />
          </div>
          {
            !_.isEmpty(this.state.addSelectedValue) ?
              <Button
                type="primary"
                onClick={this.addServerPerson}
                className={style.spAddBtn}
              >
              添加
            </Button>
            :
              <Button
                type="primary"
                disabled
                className={style.spAddBtn}
              >
              添加
            </Button>
          }
        </div>
      );
    } else {
      result = (
        <div
          className={style.spAlerts}
        >
          <span className={style.spAlertsCircle}>&nbsp;</span>
          <span className={style.spAlertsCon}>
            私密客户交易权限分配、私密客户设置 在下面客户服务团队视图中编辑；
          </span>
          <span className={style.spAlertsCon}>
            仅具有柜台系统交易信息查询权限的A类员工才能通过柜台查询该客户交易信息。
          </span>
        </div>
      );
    }
    return result;
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '新增服务人员',
      value: '$args[0]',
    },
  })
  dropdownSelectedItem(item) {
    // 下拉菜单添加选中对象
    this.setState({ addSelectedValue: { ...item, isMain: 'false' } });
  }

  @autobind
  dropdownToSearchInfo(value) {
    // 下拉菜单搜错查询关键字
    this.context.getSearchServerPersonList(value);
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '$props.head表的删除',
    },
  })
  updateDeleteValue(item) {
    // 更新table列表的选中值
    this.setState({ removeSelectedValue: item }, () => {
      this.removeServerPerson();
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加' } })
  addServerPerson() {
    // 添加服务人员按钮
    // 不能重复添加
    if (_.isEmpty(_.find(this.state.serverInfo, this.state.addSelectedValue))) {
      if (!_.isEmpty(this.state.addSelectedValue)) {
        this.setState(prevState => ({
          serverInfo: _.concat(prevState.serverInfo, this.state.addSelectedValue),
        }), () => {
          this.props.onEmitEvent(this.props.type, this.state.serverInfo);
        });
      }
    } else {
      message.error('服务经理不能重复添加');
    }
  }

  @autobind
  removeServerPerson() { // 移除服务人员按钮
    const { removeSelectedValue } = this.state;
    if (removeSelectedValue.isMain === 'true') {
      message.error('主服务经理不能删除');
    } else if (!_.isEmpty(this.state.removeSelectedValue)) {
      this.setState(prevState => ({
        serverInfo: prevState.serverInfo.filter(
          item => item.ptyMngId !== removeSelectedValue.ptyMngId,
        ),
      }), () => {
        this.props.onEmitEvent(this.props.type, this.state.serverInfo);
        this.setState({ removeSelectedValue: {} });
      });
    }
  }

  @autobind
  updateSearchListValue(data) {
    this.setState({ searchList: data });
  }

  render() {
    return (
      <div className={style.serverPersonel}>
        <InfoTitle head={this.props.head} />
        {this.modifyDom}
        <TableList
          info={this.state.serverInfo}
          statusType={this.props.statusType}
          onEmitUpdateValue={this.updateDeleteValue}
          subType={this.props.subType}
        />
      </div>
    );
  }
}
