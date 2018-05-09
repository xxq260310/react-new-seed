/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2018-04-11 19:45:19
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal, Upload } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import InfoForm from '../../components/common/infoForm';
import AutoComplete from '../../components/common/similarAutoComplete';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import { seibelConfig, request } from '../../config';
import { emp } from '../../helper';
import config from './config';
import commonConfirm from '../common/Confirm';
import customerTemplet from './customerTemplet.xls';
import styles from './createFilialeCustTransfer.less';
import logable, { logPV } from '../../decorators/logable';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// 表头
const { filialeCustTransfer: { titleList, approvalColumns } } = seibelConfig;
// 划转方式默认值
const defaultType = config.transferType[0].value;

export default class CreateFilialeCustTransfer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原服务经理
    getOldManager: PropTypes.func.isRequired,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    selectNewManager: PropTypes.func.isRequired,
    // 服务经理数据
    managerData: PropTypes.array,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 提交成功后清除上一次查询的数据
    emptyQueryData: PropTypes.func.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
    // 批量划转
    queryCustomerAssignImport: PropTypes.func,
    customerAssignImport: PropTypes.object,
    // 提交批量划转请求
    validateData: PropTypes.func,
    // 清空批量划转的数据
    clearMultiData: PropTypes.func,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    queryAppList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    custList: EMPTY_LIST,
    managerData: EMPTY_LIST,
    newManagerList: EMPTY_LIST,
    queryCustomerAssignImport: _.noop,
    customerAssignImport: {},
    validateData: _.noop,
    clearMultiData: _.noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 所选客户
      client: EMPTY_OBJECT,
      // 所选新服务经理
      newManager: EMPTY_OBJECT,
      // 划转方式默认值--单客户划转
      transferType: defaultType,
      // 是否是初始划转方式
      isDefaultType: true,
      // 上传后的返回值
      attachment: '',
      // 导入的弹窗
      importVisible: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
    };
  }


  componentWillMount() {
    // 获取下一步骤按钮列表
    this.props.getButtonList({});
  }

  // 上传事件
  @autobind
  @logable({ type: 'Click', payload: { name: '导入' } })
  onChange(info) {
    this.setState({
      importVisible: false,
    }, () => {
      const uploadFile = info.file;
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const data = uploadFile.response.resultData;
          const { queryCustomerAssignImport } = this.props;
          const payload = {
            attachment: data,
            pageNum: 1,
            pageSize: 10,
          };
          // 发送请求
          queryCustomerAssignImport(payload).then(() => {
            this.setState({
              attachment: data,
            });
          });
        } else {
          // 上传失败
          message.error(uploadFile.response.msg);
        }
      }
    });
  }

  // 导入数据
  @autobind
  @logPV({ pathname: '/modal/importData', title: '导入数据' })
  onImportHandle() {
    this.setState({
      importVisible: true,
    });
  }

  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择客户',
      value: '$args[0].custName',
    },
  })
  handleSelectClient(v) {
    this.setState({
      client: v,
    }, () => {
      if (!_.isEmpty(v)) {
        // 选择客户之后触发查询该客户的原服务经理
        const { getOldManager } = this.props;
        getOldManager({
          brokerNumber: v.brokerNumber,
        });
      }
    });
  }

  // 查询客户
  @autobind
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const { getCustList } = this.props;
    getCustList({
      keyword: v,
    });
  }

  // 选择新服务经理
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择新服务经理',
      value: '$args[0].newEmpName',
    },
  })
  handleSelectNewManager(v) {
    this.setState({
      newManager: v,
    }, () => {
      if (!_.isEmpty(v)) {
        // 将选择的新服务经理和原服务经理数据合并用作展示
        const { selectNewManager } = this.props;
        selectNewManager(v);
      }
    });
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v) {
    if (!v) {
      return;
    }
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    });
  }

  // 提交
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$args[0].btnName' } })
  handleSubmit(item) {
    const { client, newManager, isDefaultType, attachment } = this.state;
    const { managerData } = this.props;
    const itemData = {
      operate: item.operate,
      groupName: item.nextGroupName,
      approverIdea: item.btnName,
      nextApproverList: item.flowAuditors,
    };
    if (!isDefaultType) {
      if (_.isEmpty(attachment)) {
        message.error('暂未导入客户或者导入失败，请重试');
        return;
      }
      this.setState({
        ...itemData,
        nextApproverModal: true,
      });
    } else {
      const managerDataItem = managerData[0];
      let nextApproverModal = false;
      if (_.isEmpty(client)) {
        message.error('请选择客户');
        return;
      }
      if (_.isEmpty(newManager)) {
        message.error('请选择新客户经理');
        return;
      }
      if (managerDataItem.hasContract) {
        Modal.confirm({
          okText: '确定',
          cancelText: '取消',
          title: '确认要划转吗?',
          content: '该客户名下有生效中的合作合约，请确认是否划转?',
          onOk: () => {
            this.setState({
              ...itemData,
              nextApproverModal: true,
            });
          },
        });
        return;
      }
      nextApproverModal = true;
      this.setState({
        ...itemData,
        nextApproverModal,
      });
    }
  }

  // 发送请求
  @autobind
  sendRequest(obj) {
    const { client, newManager } = this.state;
    const {
      saveChange,
      queryAppList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const payload = {
      custId: client.custId,
      custType: client.custType,
      // integrationId: newManager.newIntegrationId,
      integrationId: emp.getOrgId(),
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
      brokerNumber: client.brokerNumber,
      auditors: obj.auditors,
      login: newManager.newLogin,
    };
    saveChange(payload).then(() => {
      message.success('划转请求提交成功');
      this.emptyData();
      this.setState({
        isShowModal: false,
      }, () => {
        // 清空掉从消息提醒页面带过来的 id,appId
        queryAppList({ ...query, id: '', appId: '' }, pageNum, pageSize);
      });
    });
  }

  // 提交成功后清空数据
  @autobind
  emptyData() {
    const { emptyQueryData, clearMultiData } = this.props;
    this.setState({
      client: EMPTY_OBJECT,
      newManager: EMPTY_OBJECT,
      nextApproverModal: false,
      attachment: '',
    }, () => {
      if (this.queryCustComponent) {
        this.queryCustComponent.clearValue();
      }
      if (this.queryManagerComponent) {
        this.queryManagerComponent.clearValue();
      }
      emptyQueryData();
      clearMultiData();
    });
  }

  // 划转方式的 select 事件
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '划转方式',
      value: '$args[1]',
    },
  })
  handleSelectChange(key, value) {
    const isDefaultType = value === defaultType;
    this.setState({
      [key]: value,
      isDefaultType,
    }, () => {
      this.emptyData();
    });
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal('isShowCreateModal');
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户划转申请弹框' } })
  closeModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    this.setState({ isShowModal: false }, () => {
      this.emptyData();
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '否' } })
  importHandleCancel() {
    this.setState({
      importVisible: false,
    });
  }
  // 分页
  @autobind
  pageChangeHandle(page, pageSize) {
    const { queryCustomerAssignImport } = this.props;
    const { attachment } = this.state;
    const payload = {
      attachment,
      pageNum: page,
      pageSize,
    };
    queryCustomerAssignImport(payload);
  }

  @logable({ type: 'Click', payload: { name: '下载模板' } })
  handleDownloadClick() {}

  // 发送单客户修改请求,先走修改接口，再走走流程接口
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  sendModifyRequest(value) {
    const { isDefaultType, attachment } = this.state;
    const {
      validateData,
      queryAppList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    if (isDefaultType) {
      const payload = {
        auditors: value.login,
      };
      this.sendRequest(payload);
    } else {
      const payload = {
        integrationId: emp.getOrgId(),
        attachment,
        auditors: value.login,
      };
      validateData(payload).then(() => {
        Modal.success({
          title: '提示',
          content: '提交成功，后台正在进行数据处理！若数据校验失败，可在首页通知提醒中查看失败原因。',
          onOk: () => {
            this.emptyData();
            this.setState({
              isShowModal: false,
            }, () => {
              // 清空掉从消息提醒页面带过来的 id, appId
              queryAppList({ ...query, id: '', appId: '' }, pageNum, pageSize);
            });
          },
        });
      });
    }
  }

  render() {
    const {
      custList,
      newManagerList,
      managerData,
      customerAssignImport,
      customerAssignImport: { page },
      buttonList,
    } = this.props;
    const {
      isShowModal,
      transferType,
      importVisible,
      attachment,
      isDefaultType,
      nextApproverList,
      nextApproverModal,
    } = this.state;
    const uploadProps = {
      data: {
        empId: emp.getId(),
        attachment: '',
      },
      action: `${request.prefix}/file/uploadTemp`,
      headers: {
        accept: '*/*',
      },
      onChange: this.onChange,
      showUploadList: false,
    };
    // 分页
    // const hasPage = !_.isEmpty(page);
    const paginationOption = {
      current: page && page.curPageNum,
      total: page && page.totalRecordNum,
      pageSize: (page && page.pageSize) || 10,
      onChange: this.pageChangeHandle,
    };
    const uploadElement = _.isEmpty(attachment) ?
      (<Upload {...uploadProps} {...this.props}>
        <a>导入</a>
      </Upload>)
    :
      (<span><a onClick={this.onImportHandle}>导入</a></span>);
    const selfBtnGroup = (<BottonGroup
      list={buttonList}
      onEmitEvent={this.handleSubmit}
    />);
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <CommonModal
        title="分公司客户划转申请"
        visible={isShowModal}
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
        selfBtnGroup={selfBtnGroup}
      >
        <div className={styles.filialeCustTransferWrapper} >
          <InfoForm style={{ width: '120px' }} label="划转方式" required>
            <Select
              name="transferType"
              data={config.transferType}
              value={transferType}
              onChange={this.handleSelectChange}
            />
          </InfoForm>
          {
            isDefaultType ?
              <div>
                <InfoForm style={{ width: '120px' }} label="选择客户" required>
                  <AutoComplete
                    placeholder="选择客户"
                    showObjKey="custName"
                    objId="brokerNumber"
                    searchList={custList}
                    onSelect={this.handleSelectClient}
                    onSearch={this.handleSearchClient}
                    ref={ref => this.queryCustComponent = ref}
                  />
                </InfoForm>
                <InfoForm style={{ width: '120px' }} label="选择新服务经理" required>
                  <AutoComplete
                    placeholder="选择新服务经理"
                    showObjKey="showSelectName"
                    searchList={newManagerList}
                    onSelect={this.handleSelectNewManager}
                    onSearch={this.handleSearchNewManager}
                    ref={ref => this.queryManagerComponent = ref}
                  />
                </InfoForm>
              </div>
            :
              <div className={styles.filialeBtn}>
                {uploadElement}
                |
                <a
                  onClick={this.handleDownloadClick}
                  href={customerTemplet} className={styles.downloadLink}
                >下载模板</a>
              </div>
          }
          <CommonTable
            data={transferType === defaultType ? managerData : customerAssignImport.list}
            titleList={titleList}
          />
          {/* 批量划转时显示分页器 */}
          {
            isDefaultType ?
              null
            :
              <Pagination {...paginationOption} />
          }
        </div>
        <Modal
          visible={importVisible}
          title="提示"
          onCancel={this.importHandleCancel}
          footer={[
            <Button style={{ marginRight: '10px' }} key="back" onClick={this.importHandleCancel}>
              否
            </Button>,
            <Upload {...uploadProps} {...this.props}>
              <Button key="submit" type="primary">
                是
              </Button>
            </Upload>,
          ]}
        >
          <p>已有导入的数据，继续导入将会覆盖之前导入的数据，是否继续？</p>
        </Modal>
        <TableDialog {...searchProps} />
      </CommonModal>
    );
  }
}
