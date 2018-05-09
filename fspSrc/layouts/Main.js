/**
 * @file layouts/Main.js
 * 最外层的框架主组件
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { autobind } from 'core-decorators';
import { routerRedux, withRouter } from 'dva/router';
import { Modal, Input } from 'antd';

import Header from './Header';
import Footer from './Footer';
import Tab from '../components/layout/Tab';
import FSPUnwrap from '../components/layout/FSPUnwrap';
import { constants } from '../../src/config';
import ConnectedCreateServiceRecord from '../../src/components/customerPool/list/ConnectedCreateServiceRecord';

import styles from './main.less';
import '../css/fspFix.less';
import '../../src/css/skin.less';

const effects = {
  dictionary: 'app/getDictionary',
  customerScope: 'customerPool/getCustomerScope',
  empInfo: 'app/getEmpInfo',
  addServeRecord: 'customerPool/addServeRecord',
  handleCloseClick: 'serviceRecordModal/handleCloseClick', // 手动上传日志
  // 删除文件
  ceFileDelete: 'performerView/ceFileDelete',
  switchPosition: 'global/changePost',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  ...state.global,
  ...state.app,
  navs: state.global.menus,
  loading: state.activity.global,
  loadingForceFull: state.activity.forceFull,
  custRange: state.customerPool.custRange,
  dict: state.app.dict,
  empInfo: state.app.empInfo,
  interfaceState: state.loading.effects,
  // 显示隐藏添加服务记录弹窗
  serviceRecordModalVisible: state.app.serviceRecordModalVisible,
  // 发送保存服务记录请求成功状态
  addServeRecordSuccess: state.customerPool.addServeRecordSuccess,
  // 服务弹窗对应的客户的经纪客户号
  serviceRecordModalVisibleOfId: state.app.serviceRecordModalVisibleOfId,
  // 服务弹窗对应的客户的经纪客户名
  serviceRecordModalVisibleOfName: state.app.serviceRecordModalVisibleOfName,
  // 客户uuid
  custUuid: state.performerView.custUuid,
  // 任务反馈的字典
  taskFeedbackList: state.performerView.taskFeedbackList,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  getCustomerScope: fectchDataFunction(false, effects.customerScope),
  toggleServiceRecordModal: query => ({
    type: 'app/toggleServiceRecordModal',
    payload: query || false,
  }),
  addServeRecord: fectchDataFunction(false, effects.addServeRecord),
  handleCloseClick: fectchDataFunction(false, effects.handleCloseClick),
  ceFileDelete: fectchDataFunction(true, effects.ceFileDelete),
  switchPosition: fectchDataFunction(false, effects.switchPosition),
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 隔离墙modal是否可见
      isolationWallModalVisible: false,
    };
  }

  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingForceFull: PropTypes.bool,
    isBlockRemovePane: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    getCustomerScope: PropTypes.func.isRequired,
    interfaceState: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    navs: PropTypes.object.isRequired,
    serviceRecordModalVisible: PropTypes.bool,
    serviceRecordModalVisibleOfId: PropTypes.string,
    serviceRecordModalVisibleOfName: PropTypes.string,
    addServeRecordSuccess: PropTypes.bool.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired,
    custUuid: PropTypes.string.isRequired,
    ceFileDelete: PropTypes.func.isRequired,
    changePost: PropTypes.bool.isRequired,
    taskFeedbackList: PropTypes.array.isRequired,
    switchPosition: PropTypes.func.isRequired,
  }

  static defaultProps = {
    serviceRecordModalVisible: false,
    serviceRecordModalVisibleOfId: '',
    serviceRecordModalVisibleOfName: '',
    loadingForceFull: false,
  }

  componentDidMount() {
    const { getCustomerScope } = this.props;
    getCustomerScope(); // 加载客户池客户范围
  }

  @autobind
  switchRspAfter() {
    const { changePost } = this.props;
    if (changePost) {
      console.warn('TO DO Refresh window');
    } else {
      console.warn('DO NOT Refresh window');
    }
  }

  @autobind
  handleHeaderSwitchRsp(rsp) {
    this.props.switchPosition(rsp).then(this.switchRspAfter);
  }

  @autobind
  handleIsolationWallModalShow() {
    this.setState({
      isolationWallModalVisible: true,
    });
  }

  @autobind
  handleIsolationWallModalHide() {
    this.setState({
      isolationWallModalVisible: false,
    });
  }

  render() {
    const {
      children,
      location,
      loading,
      isBlockRemovePane,
      loadingForceFull,
      // 方法
      push,
      interfaceState,
      dict,
      empInfo: { empInfo = {}, empPostnList = [], loginInfo = {} },
      navs: { secondaryMenu = [], majorMenu = [] },
      addServeRecordSuccess,
      addServeRecord,
      serviceRecordModalVisibleOfId,
      serviceRecordModalVisibleOfName,
      serviceRecordModalVisible,
      toggleServiceRecordModal,
      handleCloseClick,
      custUuid,
      ceFileDelete,
      taskFeedbackList,
    } = this.props;

    return (
      <div>
        <Helmet>
          <link rel="icon" href={constants.logoSrc} type="image/x-icon" />
        </Helmet>
        <div
          className={styles.layout}
        >
          <Header
            navs={secondaryMenu}
            loginInfo={loginInfo}
            empInfo={empInfo}
            empRspList={empPostnList}
            onSwitchRsp={this.handleHeaderSwitchRsp}
            onIsolationWallModalShow={this.handleIsolationWallModalShow}
          />
          <div className={styles.main}>
            <Tab
              location={location}
              push={push}
              isBlockRemovePane={isBlockRemovePane}
            />
            <FSPUnwrap
              path={location.pathname}
              loading={loading}
              loadingForceFull={loadingForceFull}
            >
              <div id="react-content" className={styles.content}>
                {
                  (!_.isEmpty(interfaceState) &&
                    !interfaceState[effects.dictionary] &&
                    !interfaceState[effects.customerScope] &&
                    !interfaceState[effects.empInfo] &&
                    React.isValidElement(children)) ?
                      children :
                      <div />
                }
              </div>
              <Footer />
            </FSPUnwrap>
            <ConnectedCreateServiceRecord
              handleCloseClick={handleCloseClick}
              loading={interfaceState[effects.addServeRecord]}
              key={serviceRecordModalVisibleOfId}
              id={serviceRecordModalVisibleOfId}
              name={serviceRecordModalVisibleOfName}
              dict={dict}
              empInfo={empInfo}
              isShow={serviceRecordModalVisible}
              addServeRecord={addServeRecord}
              addServeRecordSuccess={addServeRecordSuccess}
              onToggleServiceRecordModal={toggleServiceRecordModal}
              custUuid={custUuid}
              ceFileDelete={ceFileDelete}
              taskFeedbackList={taskFeedbackList}
            />
            <Modal
              title="隔离墙"
              visible={this.state.isolationWallModalVisible}
              onCancel={this.handleIsolationWallModalHide}
            >
              <span>股票代码：</span>
              <Input />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
