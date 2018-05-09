/**
 * @description 编辑弹框，统一样式
 * @author zhangjunli
 * Usage:
 * <EditModal
 *  visible={bool}
 *  onOk={func}
 *  onCancel={func}
 *  onSearch={func}
 *  modalKey={string}
 *  list={array}
 *  modalType={string}
 * />
 * visible：必需的，用于控制弹框是否显示
 * onOk：必须，按钮的回调事件
 * onCancel：必须，按钮的回调事件
 * onSearch: 必须，下拉控件中搜索事件
 * list：必须，下拉框列表
 * modalKey： 必须，容器组件用来控制modal出现和隐藏的key
 * modalType：非必须，值有，'manager', 'member', 'team'。默认值为manager
 * okText：有默认值：确定，按钮的title
 * cancelText: 有默认值：取消，按钮的title
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Modal, message } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import Button from '../common/Button';
import AutoComplete from '../common/similarAutoComplete';
import styles from './editModal.less';
import logable from '../../decorators/logable';

const titleArray = {
  manager: ['编辑负责人', '负责人:'],
  member: ['添加成员', '成员:'],
  team: ['添加团队/更新团队', '团队负责人:', '团队名称:'],
};
// editModal 组件的弹框类型
const TEAM_MODAL = 'team';

export default class EditModal extends Component {
  static propTypes = {
    list: PropTypes.array,
    modalType: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    defultItem: PropTypes.object,
  }

  static defaultProps = {
    okText: '确定',
    cancelText: '取消',
    list: [],
    modalType: '',
    defultItem: {},
  }

  constructor(props) {
    super(props);
    const { defultItem } = props;
    this.state = this.getDefultValue(defultItem);
  }
  // 弹框的默认显示
  getDefultValue(defultItem) {
    let select = {};
    const { loginName = '', postnDesc = '', login = '' } = defultItem || {};
    if (!_.isEmpty(loginName) || !_.isEmpty(login)) {
      select = { name: loginName, code: login };
    } else {
      select = {};
    }
    return { select, teamName: postnDesc };
  }
  // 校验数据
  @autobind
  vetifyData() {
    let result = true;
    const { modalType } = this.props;
    const { select, teamName } = this.state;
    const titles = _.isEmpty(modalType) ? titleArray.manager : titleArray[modalType];
    if (_.isEmpty(select)) {
      message.error(`${titles[1]}不能为空`);
      result = false;
    }
    if (modalType === 'team' && _.isEmpty(teamName)) {
      message.error(`${titles[2]}不能为空`);
      result = false;
    }
    return result;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.okText' } })
  handleOk() {
    // 校验必填数据
    if (!this.vetifyData()) {
      return;
    }
    const { onOk, modalType, defultItem } = this.props;
    const { select, select: { name: curName, code: curCode }, teamName } = this.state;
    const {
      select: { name: defaultName, code: defaultCode },
      teamName: defaultTeamName,
    } = this.getDefultValue(defultItem);
    // 去重
    const isSameSelect = curName === defaultName && curCode === defaultCode;
    const isSameTeamName = defaultTeamName === teamName;
    let isUpdate = true; // 是否有更新
    if (modalType === TEAM_MODAL && isSameSelect && isSameTeamName) {
      isUpdate = false;
    } else if (modalType !== TEAM_MODAL && isSameSelect) {
      isUpdate = false;
    }
    onOk({ select, teamName, modalType, isUpdate });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$props.cancelText' } })
  handleClose() {
    this.props.onCancel();
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '负责人',
      value: '$args[0].ptyMngName',
    },
  })
  handleSelect(obj) {
    if (_.isEmpty(obj)) {
      this.setState({ select: {}, teamName: '' });
      return;
    }
    const { ptyMngName, ptyMngId } = obj;
    this.setState({
      select: { name: ptyMngName, code: ptyMngId, ...obj },
      teamName: `${ptyMngName}(${ptyMngId})团队`,
    });
  }

  @autobind
  handleSearch(keyword) {
    this.props.onSearch(keyword);
  }

  @autobind
  handleChange(e) {
    this.setState({ teamName: e.target.value });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '清除输入框中的内容' } })
  handleClear() {
    this.setState({ teamName: '' });
  }

  @autobind
  renderContent() {
    const { modalType, list = [] } = this.props;
    const { teamName, select } = this.state;
    const { name = '--', code = '--' } = select;
    const titles = _.isEmpty(modalType) ? titleArray.manager : titleArray[modalType];
    return (
      <div className={styles.modalBody}>
        <div className={styles.row}>
          <div className={styles.infoColumn}>{titles[1]}</div>
          <div className={styles.inputColumn}>
            <AutoComplete
              placeholder="工号/姓名"
              showObjKey="ptyMngName"
              objId="ptyMngId"
              defaultSearchValue={(_.isEmpty(select) ? '' : `${name}（${code}）`)}
              searchList={list}
              onSelect={this.handleSelect}
              onSearch={this.handleSearch}
            />
          </div>
        </div>
        {
          titles.length > 2 ? (
            <div className={styles.row}>
              <div className={classnames(styles.infoColumn, styles.info)}>{titles[2]}</div>
              <div className={styles.inputColumn}>
                <Input
                  addonAfter={<Icon type="guanbi" onClick={this.handleClear} />}
                  value={teamName}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }

  @autobind
  renderFooter() {
    const { okText, cancelText } = this.props;
    return (
      <div className={styles.footer}>
        <Button type="primary" size="large" onClick={this.handleOk} className={styles.ok}>
          {okText}
        </Button>
        <Button type="default" size="large" onClick={this.handleClose} className={styles.cancel}>
          {cancelText}
        </Button>
      </div>
    );
  }

  render() {
    const { visible, modalType, defultItem } = this.props;
    const titles = _.split(_.head(titleArray[modalType]), '/');
    const title = _.isEmpty(defultItem) ? _.head(titles) : _.last(titles);
    return (
      <Modal
        title={title}
        visible={visible}
        footer={this.renderFooter()}
        wrapClassName={styles.modalContainer}
        onCancel={this.handleClose}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
