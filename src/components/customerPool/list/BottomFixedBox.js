/**
 * @file components/customerPool/BottomFixedBox.js
 *  目标客户池列表页底部悬浮框，当列表中的数据被选中时显示
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal } from 'antd';
import Button from '../../common/Button';
import Icon from '../../common/Icon';
import { fspContainer } from '../../../config';
// import { emp } from '../../../helper';
import logable from '../../../decorators/logable';

import styles from './bottomFixedBox.less';

export default class BottomFixedBox extends PureComponent {
  static propTypes = {
    page: PropTypes.object.isRequired,
    custList: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    selectCount: PropTypes.number.isRequired,
    mainServiceManager: PropTypes.bool,
    entertype: PropTypes.string.isRequired,
    clearCreateTaskData: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    hasTkMampPermission: PropTypes.bool.isRequired,
    sendCustsServedByPostnResult: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mainServiceManager: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      taskAndGroupLeftPos: '0',
      warningContent: '',
    };
  }

  componentDidMount() {
    this.setTaskAndGroup();
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.addEventListener('click', this.updateLeftPos);
      sidebarShowBtn.addEventListener('click', this.updateLeftPos);
    }
  }

  componentDidUpdate() {
    this.setTaskAndGroup();
  }

  componentWillUnmount() {
    const sidebarHideBtn = document.querySelector(fspContainer.sidebarHideBtn);
    const sidebarShowBtn = document.querySelector(fspContainer.sidebarShowBtn);
    if (sidebarHideBtn && sidebarShowBtn) {
      sidebarHideBtn.removeEventListener('click', this.updateLeftPos);
      sidebarShowBtn.removeEventListener('click', this.updateLeftPos);
    }
  }

  @autobind
  setTaskAndGroup() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    if (workspaceSidebar) {
      this.setState({
        taskAndGroupLeftPos: `${workspaceSidebar.offsetWidth}px`,
      });
    }
  }

  @autobind
  updateLeftPos() {
    const workspaceSidebar = document.querySelector(fspContainer.workspaceSidebar);
    const fixedEleDom = document.querySelector('#fixedEleDom');
    if (fixedEleDom && workspaceSidebar) {
      fixedEleDom.style.left = `${workspaceSidebar.offsetWidth}px`;
    }
  }

  // 点击新建分组或者发起任务按钮
  @autobind
  handleClick({ url, title, id, shouldStay, editPane, labelDesc, missionDesc }) {
    const {
      page,
      condition,
      entertype,
      location: {
        query: {
          selectedIds,
        selectAll,
        source,
        },
        pathname,
        search,
      },
    } = this.props;
    const fr = encodeURIComponent(`${pathname}${search}`);
    if (selectedIds) {
      const selectedIdsArr = selectedIds.split(',');
      this.openByIds(
        url,
        condition,
        selectedIdsArr,
        selectedIdsArr.length,
        title,
        id,
        entertype,
        source,
        fr,
        shouldStay,
        editPane,
        labelDesc,
        missionDesc,
      );
    } else if (selectAll) {
      this.openByAllSelect(
        url,
        condition,
        page.total,
        title,
        id,
        entertype,
        source,
        fr,
        shouldStay,
        editPane,
        labelDesc,
        missionDesc,
      );
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '用户分组' } })
  handleCustomerGroupClick() {
    const url = '/customerPool/customerGroup';
    const title = '新建分组';
    const id = 'RCT_FSP_CUSTOMER_LIST';
    const shouldStay = true;
    const editPane = {
      name: '新建分组',
    };

    const {
      selectCount,
    } = this.props;
    if (Number(selectCount) > 500) {
      this.toggleModal();
      this.setState({
        modalContent: '一次添加的客户数不能超过500个',
      });
      return;
    }
    this.handleClick({ url, title, id, shouldStay, editPane });
  }

  // 跳转到创建任务页面
  @autobind
  toCreateTaskPage() {
    const { location: { query: { labelDesc, missionDesc } } } = this.props;
    const url = '/customerPool/createTask';
    const title = '自建任务';
    const id = 'RCT_FSP_CREATE_TASK_FROM_CUSTLIST';
    // 发起新的任务之前，先清除数据
    this.props.clearCreateTaskData('custList');

    this.handleClick({ url, title, id, labelDesc: decodeURIComponent(labelDesc), missionDesc });
  }

  // 验证通过后跳转到创建任务
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发起任务' } })
  handleCreateTaskClick() {
    const {
      condition,
      hasTkMampPermission,
      isSendCustsServedByPostn,
      location: {
        query: {
          selectAll,
        selectedIds,
        },
      },
    } = this.props;
    // 有任务管理权限
    if (hasTkMampPermission) {
      this.toCreateTaskPage();
    } else {
      const payload = {};
      if (selectAll) {
        payload.searchReq = condition;
      }
      if (selectedIds) {
        const custList = decodeURIComponent(selectedIds).split(',');
        const custIdList = [];
        _.forEach(custList, (item) => {
          custIdList.push(item.split('.')[0]);
        });
        payload.custIdList = custIdList;
      }
      // 没有任务管理权限，发请求判断是否超过1000条数据和是否包含非本人名下客户
      isSendCustsServedByPostn({
        ...payload,
      }).then(() => {
        const {
          sendCustsServedByPostnResult = {},
        } = this.props;
        const {
          custNumsIsExceedUpperLimit = false,
          sendCustsServedByPostn = false,
        } = sendCustsServedByPostnResult;
        // 选择超过1000条数据 或者 没有超过1000条但包含非本人名下客户
        if (custNumsIsExceedUpperLimit || !sendCustsServedByPostn) {
          this.toggleModal();
          this.setState({
            modalContent: '您没有“HTSC任务管理”职责，不能对非本人名下客户发起任务',
          });
        } else {
          this.toCreateTaskPage();
        }
      });
    }
  }

  // 单个点击选中时跳转到新建分组或者发起任务
  @autobind
  openByIds(url,
    condition,
    ids,
    count,
    title,
    id,
    entertype,
    source,
    fr,
    shouldStay,
    editPane,
    labelDesc,
    missionDesc,
  ) {
    const tmpArr = [];
    _(ids).forEach((item) => {
      tmpArr.push(item.split('.')[0]);
    });
    const idStr = encodeURIComponent(tmpArr.join(','));
    const name = encodeURIComponent(ids[0].split('.')[1]);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      ids: idStr,
      count,
      entertype,
      source,
      name,
      labelDesc,
      missionDesc,
      condition: condt,
      fr,
    };
    this.props.onClick({ id, title, url, obj, shouldStay, editPane });
  }

  // 全选按钮选中时跳转到新建分组或者发起任务
  @autobind
  openByAllSelect(url,
    condition,
    count,
    title,
    id,
    entertype,
    source,
    fr,
    shouldStay,
    editPane,
    labelDesc,
    missionDesc,
  ) {
    // 全选时取整个列表的第一个数据的name属性值传给后续页面
    const name = encodeURIComponent(this.props.custList[0].name);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      condition: condt,
      count,
      entertype,
      source,
      name,
      fr,
      labelDesc,
      missionDesc,
    };
    this.props.onClick({ id, title, url, obj, shouldStay, editPane });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确认' } })
  toggleModal() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  // 分组只针对服务经理，也就是说：
  // 有首页指标查看权限或者服务经理筛选选的是当前登录用户时显示用户分组
  renderGroup() {
    if (this.props.mainServiceManager) {
      return (
        <button onClick={this.handleCustomerGroupClick}>用户分组</button>
      );
    }
    return null;
  }

  renderCreateTaskBtn() {
    return (
      <button onClick={this.handleCreateTaskClick}>发起任务</button>
    );
  }

  @autobind
  renderText() {
    const {
      selectCount,
      mainServiceManager,
    } = this.props;
    let str = '';
    if (mainServiceManager) {
      str = '，或者把用户加入分组管理';
    }
    return (
      <p className="left">
        已选&nbsp;
        <span className="marked">{selectCount}</span>
        &nbsp;户，选择目标用户以创建自定义任务{str}
      </p>
    );
  }

  render() {
    const {
      taskAndGroupLeftPos,
      visible,
      modalContent,
    } = this.state;
    return (
      <div
        id="fixedEleDom"
        className={styles.taskAndGroup}
        style={{
          left: taskAndGroupLeftPos,
        }}
      >
        {this.renderText()}
        <div className="right">
          {this.renderGroup()}
          {this.renderCreateTaskBtn()}
        </div>
        <Modal
          title={''}
          closable
          okText={'确认'}
          width={300}
          height={180}
          wrapClassName={'infoModal'}
          visible={visible}
          onOk={this.toggleModal}
          onCancel={this.toggleModal}
          footer={
            <Button className={'confirm'} type={'primary'} onClick={this.toggleModal}>确认</Button>
          }
        >
          <div className={'info'}>
            <Icon type="tishi1" className={'tishi'} />
            <span>{modalContent}</span>
          </div>
        </Modal>
      </div>
    );
  }
}
