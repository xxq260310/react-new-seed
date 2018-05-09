/*
 * @Description: 通道类型协议新建/编辑 -基本信息
 * @Author: XuWenKang
 * @Date:   2017-09-21 15:27:31
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-08 09:00:52
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input } from 'antd';

import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import AutoComplete from '../common/similarAutoComplete';
import HtscTreeSelect from '../common/Select/TreeSelect';
import CustomSwitch from '../common/customSwitch';
import { time, permission } from '../../helper';
import config from '../../routes/channelsTypeProtocol/config';
import logable from '../../decorators/logable';

import styles from './editBaseInfo.less';
import {
  isInvolvePermission,
  isInvolveSoftware,
} from './auth';

const { TextArea } = Input;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const { subscribeArray, protocolSubTypes, protocolStepOperate, arbitrageSoftwareArray } = config;

export default class EditBaseInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    // 套利软件业务类型列表
    businessTypeList: PropTypes.array.isRequired,
    // 开通权限列表
    openPermissionList: PropTypes.array.isRequired,
    // 查询子类型/操作类型/业务类型
    queryTypeVaules: PropTypes.func.isRequired,
    queryOpenPermissionList: PropTypes.func,
    queryBusinessTypeList: PropTypes.func,
    operationTypeList: PropTypes.array,
    subTypeList: PropTypes.array,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    // 编辑时传入元数据
    formData: PropTypes.object,
    // 查询协议接口
    getProtocolDetail: PropTypes.func,
    // 多账户切换
    onChangeMultiCustomer: PropTypes.func,
    // 清空附件
    resetUpload: PropTypes.func,
    // 清除协议产品
    resetProduct: PropTypes.func,
    // 验证客户
    getCustValidate: PropTypes.func,
    // 清除数据
    clearPropsData: PropTypes.func,
    // 模版数据
    template: PropTypes.object,
    // 是否是编辑
    isEdit: PropTypes.bool,
    // 协议 ID 列表
    protocolList: PropTypes.array,
    // 获取协议 ID 列表
    queryProtocolList: PropTypes.func,
    onChangeProtocolNumber: PropTypes.func,
    getFlowStepInfo: PropTypes.func,
    // 切换操作类型时向父组件返回数据
    changeOperationType: PropTypes.func.isRequired,
    // 操作类型子类型发生变化时数据传递到父组件用来判断上传文件必填项
    changeRequiredFile: PropTypes.func.isRequired,
    getParentContainer: PropTypes.func,
    // 切换子类型
    onChangeSubType: PropTypes.func,
    // 筛选协议模板
    filterTemplate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    formData: EMPTY_OBJECT,
    getProtocolDetail: () => { },
    operationTypeList: EMPTY_ARRAY,
    onChangeMultiCustomer: () => { },
    resetUpload: () => { },
    resetProduct: () => { },
    clearPropsData: () => { },
    getCustValidate: () => { },
    queryProtocolList: () => { },
    protocolList: [],
    template: {},
    subTypeList: [],
    isEdit: false,
    onChangeProtocolNumber: () => { },
    getFlowStepInfo: () => { },
    getParentContainer: () => {},
    onChangeSubType: () => {},
    queryOpenPermissionList: () => {},
    queryBusinessTypeList: () => {},
  }

  constructor(props) {
    super(props);
    const { formData = {}, templateList, location: { pathname } } = props;
    // 是否是编辑页面
    const isEditPage = pathname.indexOf('/edit') > -1;
    let flag = false;
    if (!_.isEmpty(formData)) {
      flag = _.includes(subscribeArray, formData.operationType);
    }
    let stateObj = {};
    if (isEditPage) {
      stateObj = {
        // 所选操作类型
        operationType: formData.operationType,
        // 所选子类型
        subType: formData.subType,
        // 客户信息
        client: {
          cusId: formData.custId,
          custType: formData.custType,
          brokerNumber: formData.econNum,
        },
        // 所选协议模板
        protocolTemplate: {
          prodName: formData.templateId,
          rowId: formData.templateId,
        },
        // 是否多账户
        multiUsedFlag: formData.multiUsedFlag === 'Y',
        // 是否订购十档行情
        levelTenFlag: formData.levelTenFlag === 'Y',
        // 备注
        content: formData.content,
        // 协议编号
        protocolNumber: formData.agreementNum,
        // 协议开始时间
        startDt: formData.startDt,
        // 协议有效时间
        vailDt: formData.vailDt,
        needMutliAndTen: formData.operationType === '协议订购',
        // 业务类型
        businessType: formData.softBusinessType,
        // 开通权限
        softPermission: formData.softPermission,
        // 软件密码
        softPassword: formData.softPassword,
        // 软件密码
        softAccount: formData.softAccount,
      };
    } else {
      stateObj = {
        // 所选操作类型
        operationType: '',
        // 所选子类型
        subType: '',
        // 所选客户
        client: EMPTY_OBJECT,
        // 所选协议模板
        protocolTemplate: EMPTY_OBJECT,
        // 是否多账户
        multiUsedFlag: false,
        // 是否订购十档行情
        levelTenFlag: false,
        // 备注
        content: '',
        // 协议编号
        protocolNumber: '',
        needMutliAndTen: true,
        // 业务类型
        businessType: '',
        // 开通权限
        softPermission: [],
      };
    }
    this.state = {
      ...stateObj,
      templateList,
      isSubscribe: flag,
      isEditPage,
      isHightSpeed: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      templateList: preTL,
    } = this.props;
    const {
      templateList: nextTL,
      formData: nextFD,
    } = nextProps;
    // 设定新的模版列表数据
    if (!_.isEqual(preTL, nextTL)) {
      const { templateId } = nextFD;
      const filterTemplate = _.filter(nextTL, o => o.prodName === templateId);
      this.setState({
        templateList: nextTL,
        protocolTemplate: (filterTemplate && filterTemplate[0]) || {},
      });
    }
  }

  // 向外传递数据
  @autobind
  getData() {
    return this.state;
  }

  @autobind
  refHtscTreeSelect(input) {
    this.htscTreeSelect = input;
  }

  @autobind
  compareFormData(next) {
    const {
      contactName,
      templateId,
      multiUsedFlag,
      levelTenFlag,
      startDt,
      vailDt,
    } = next;
    this.setState({
      needMutliAndTen: false,
      contactName,
      templateId,
      protocolTemplate: {
        ...this.state.protocolTemplate,
        prodName: templateId,
        rowId: templateId,
      },
      multiUsedFlag: multiUsedFlag === 'Y',
      levelTenFlag: levelTenFlag === 'Y',
      startDt,
      vailDt,
    });
  }

  // 清除选择的业务类型
  @autobind
  clearBussinessType() {
    this.setState({ businessType: '' });
  }

  // 清除选择的开通权限
  @autobind
  clearOpenPermission() {
    this.setState({ softPermission: [] });
    this.htscTreeSelect.clear();
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '子类型',
      value: '$args[1]',
    },
  })
  handleSubTypeSelect(key, value) {
    this.handleSelectChange(key, value);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '操作类型',
      value: '$args[1]',
    },
  })
  handleOperateTypeSelect(key, value) {
    this.handleSelectChange(key, value);
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    const {
      queryTypeVaules,
      onSearchCutList,
      clearPropsData,
      resetProduct,
      changeOperationType,
      changeRequiredFile,
      getFlowStepInfo,
      onChangeSubType,
    } = this.props;
    let sub = true;
    let isHightSpeed = false;
    let needMutliAndTen = this.state.needMutliAndTen;
    if (key === 'operationType') {
      sub = _.includes(subscribeArray, value);
      if (sub) {
        needMutliAndTen = true;
      }
      changeOperationType(value);
    } else if (key === 'subType') {
      // TODO 此处告知父组件，当前选的子类型
      onChangeSubType(value);
      getFlowStepInfo({
        flowId: '',
        operate: protocolStepOperate[value],
      });
      // 判断子类型是否为紫金通道，不是则不展现多用户和十档行情选择
      if (value !== protocolSubTypes.fastConnect) {
        isHightSpeed = true;
      }
    }
    clearPropsData();
    resetProduct();
    this.setState({
      content: '',
      operationType: '',
      client: EMPTY_OBJECT,
      protocolTemplate: EMPTY_OBJECT,
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
      protocolNumber: '',
      isSubscribe: sub,
      needMutliAndTen,
      [key]: value,
      isHightSpeed,
    }, () => {
      const { onChangeMultiCustomer, resetUpload } = this.props;
      const { isEditPage, subType, operationType } = this.state;
      // 清除详情
      this.clearDetailData();
      // 清除客户列表
      this.selectCustComponent.clearValue();
      // 清除协议模版
      if (this.selectTemplateComponent) {
        this.selectTemplateComponent.clearValue();
      }
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEditPage) {
        // 清除附件
        resetUpload();
      }
      if (key === 'subType') {
        changeRequiredFile(subType, operationType);
        // 子类型发生变化查询操作类型
        queryTypeVaules({
          typeCode: 'operationType',
          subType: value,
        });
        // 子类型发生变化查询客户列表 type 根据后端要求写死，subType取子类型
        onSearchCutList({
          type: '05',
          subType: value,
        });
      } else if (key === 'operationType') {
        changeRequiredFile(subType, operationType);
        if (_.includes(subscribeArray, value)) {
          // 子类型发生变化且为订购时查询协议模板列表
          queryTypeVaules({
            typeCode: 'templateId',
            subType,
            operationType: value,
          });
          if (this.isArbirageSoftware()) {
            // 查询业务类型
            queryTypeVaules({
              typeCode: 'businessType',
              subType,
              operationType: value,
            });
          }
        }
      }
    });
  }

  // 开通权限下拉多选框改变
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '开通权限',
      value: '$args[1]',
    },
  })
  handleOpenPermissionChange(name, value) {
    const softPermission = value.map(v => ({ code: v.value, value: v.label }));
    this.setState({ softPermission });
  }

  // 切换业务类型
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务类型',
      value: '$args[1]',
    },
  })
  handleBusinessTypeSelect(key, value) {
    this.setState({ businessType: value, softPermission: [] });
    const { operationType, subType, isEditPage } = this.state;
    // TODO如果设置权限，需要查询开通权限
    if (isInvolvePermission(value)) {
      // TODO
      if (isEditPage) {
        this.props.queryOpenPermissionList({
          typeCode: 'permissionType',
          subType,
          operationType,
        });
      } else {
        this.props.queryTypeVaules({
          typeCode: 'permissionType',
          subType,
          operationType,
        });
      }
    }
  }

  // 清除数据
  @autobind
  clearDetailData() {
    this.setState({
      contactName: '',
      templateId: '',
      protocolTemplate: {},
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
    });
  }

  // 选择客户
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户',
      value: '$args[0].custName',
    },
  })
  handleSelectClient(value) {
    const {
      getCustValidate,
      clearPropsData,
      onChangeMultiCustomer,
      resetUpload,
      queryProtocolList,
      resetProduct,
    } = this.props;
    // 清除详情
    const { isSubscribe, operationType, isEditPage, subType } = this.state;
    const { cusId, custType, brokerNumber } = value;
    const validatePayload = {
      id: cusId,
      custType,
      econNum: brokerNumber,
      agrId: '',
      agrType: subType,
      templateId: '',
      type: 'PriCust',
    };
    // 清除下挂客户
    onChangeMultiCustomer(false);
    if (!isEditPage) {
      // 清除附件
      resetUpload();
    }
    clearPropsData();
    resetProduct();
    this.clearDetailData();
    this.setState({
      ...this.state,
      content: '',
      protocolTemplate: EMPTY_OBJECT,
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
      protocolNumber: '',
    }, () => {
      // 开发时，测试提出的
      this.handleSearchClient();
    });
    if (operationType === config.unSubscribeArray[0]) {
      this.setState({
        client: value,
      }, () => {
        if (isSubscribe) {
          // 清空协议模版
          this.selectTemplateComponent.clearValue();
        } else if (!_.isEmpty(value)) {
          // 只有当前选择的值不为空，才执行 查询协议 ID 列表， 否则会报 缺少参数
          // 查询协议 ID 列表
          queryProtocolList({
            custId: cusId,
            subType,
            operationType,
          });
        }
      });
      return;
    }
    // 当前选中的为空时，即value为空时，直接清空客户列表，不执行getCustValidate方法
    // 否则会报 缺少参数
    if (_.isEmpty(value)) {
      // 清除客户列表
      this.selectCustComponent.clearValue();
      this.setState({
        client: {},
      });
      return;
    }
    // TODO 切换用户后，此处需要将协议模板，业务类型，开通权限，数据清空
    getCustValidate(validatePayload).then(
      () => {
        this.setState({
          client: value,
        }, () => {
          if (isSubscribe) {
            // 清空协议模版
            this.selectTemplateComponent.clearValue();
            // TODO 如果是套利软件，则有可能需要清空
            if (this.isArbirageSoftware()) {
              // TODO 如果此时正好用户也已经选择开通权限
              if (isInvolvePermission()) {
                this.clearOpenPermission();
              }
              this.clearBussinessType();
            }
          } else {
            // 查询协议 ID 列表
            queryProtocolList({
              custId: cusId,
              subType,
              operationType,
            });
          }
        });
      },
      () => {
        // 清除客户列表
        this.selectCustComponent.clearValue();
        this.setState({
          client: {},
        });
      },
    );
  }

  // 查询协议产品列表
  @autobind
  queryChannelProtocolProduct() {
    const { client, protocolTemplate, subType } = this.state;
    const { queryChannelProtocolProduct } = this.props;
    if (!_.isEmpty(client) && !_.isEmpty(protocolTemplate)) {
      queryChannelProtocolProduct({
        subType,
        custId: client.cusId,
        custType: client.custType,
        promotionId: protocolTemplate.rowId,
        pageNum: 1,
        pageSize: 100,
        keyword: '',
      });
    }
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(v = '') {
    const { subType } = this.state;
    this.props.onSearchCutList({
      type: '05', // type 根据后端要求写死
      subType,
      keyword: v,
    });
  }

  // 选择协议模板
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '协议模板',
      value: '$args[0].prodName',
    },
  })
  handleSelectTemplate(value) {
    this.setState({
      content: '',
      multiUsedFlag: false,
      levelTenFlag: false,
      protocolTemplate: value,
      businessType: '',
      softPermission: [],
    }, () => {
      const {
        queryChannelProtocolItem,
        onChangeMultiCustomer,
        resetUpload,
        resetProduct,
      } = this.props;
      const { isEditPage, subType } = this.state;
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEditPage) {
        // 清除附件
        resetUpload();
      }
      resetProduct();
      // 当前选中的值 value 不为空时，请求接口
      if (!_.isEmpty(value)) {
        queryChannelProtocolItem({
          subType,
          keyword: value.rowId,
        });
        // 触发查询协议产品列表
        this.queryChannelProtocolProduct();
      }
    });
  }

  // 根据填入关键词筛选协议模板
  @autobind
  handleSearchTemplate(value) {
    const { filterTemplate } = this.props;
    filterTemplate(value);
  }

  // 修改备注
  @autobind
  handleChangeContent(e) {
    this.setState({
      content: e.target.value,
    }, this.transferDataToHome);
  }

  // switch处理，是否使用多账户
  @autobind
  @logable({ type: 'Click', payload: { name: 'switch控制是否使用多账户' } })
  handleUseSwitch(name, value) {
    this.handleChangeSwitchValue(name, value);
  }

  // switch处理，是否订购十档行情
  @autobind
  @logable({ type: 'Click', payload: { name: 'switch控制是否订购十档行情' } })
  handleOrderSwitch(name, value) {
    this.handleChangeSwitchValue(name, value);
  }

  // 修改开关
  @autobind
  handleChangeSwitchValue(name, value) {
    const { onChangeMultiCustomer } = this.props;
    this.setState({
      ...this.state,
      [name]: value,
    }, () => {
      // 判断是否是多账户的切换
      if (name === 'multiUsedFlag') {
        onChangeMultiCustomer(value);
      }
    });
  }

  // 选择协议 ID
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '协议编号',
      value: '$args[1]',
    },
  })
  handleSelectProtocol(key, value) {
    const [id, flowId] = value.split('~');
    const {
      getProtocolDetail,
      onChangeProtocolNumber,
      getFlowStepInfo,
    } = this.props;
    this.setState({
      [key]: id,
    }, () => {
      getProtocolDetail({
        needAttachment: false,
        needFlowHistory: false,
        data: {
          flowId,
        },
      }).then(() => {
        const { formData: nextFD } = this.props;
        const { operationType, subType } = this.state;
        // TODO 高速通道退订、续订等操作时，需要对 operate 进行判断
        getFlowStepInfo({
          flowId,
          operate: 1,
        });
        this.compareFormData(nextFD);
        onChangeProtocolNumber(operationType, subType);
      });
    });
  }

  // 判断子类型是否套利软件
  @autobind
  isArbirageSoftware() {
    const { subType } = this.state;
    // return subType === protocolSubTypes.arbitrageSoft;
    return _.includes(arbitrageSoftwareArray, subType);
  }

  // 判断需要显示开通权限字段吗
  @autobind
  needShowOpenPermission() {
    const { businessType } = this.state;
    return this.isArbirageSoftware() && isInvolvePermission(businessType);
  }

  // 判断需要显示软件信息
  @autobind
  needShowSoftware() {
    const { businessType } = this.state;
    return this.isArbirageSoftware() && isInvolveSoftware(businessType);
  }

  render() {
    const {
      custList,
      operationTypeList,
      businessTypeList,
      subTypeList,
      formData: protocolDetail,
      protocolList,
      getParentContainer,
      openPermissionList,
    } = this.props;
    const {
      isEditPage,
      subType,
      operationType,
      multiUsedFlag,
      levelTenFlag,
      protocolTemplate,
      templateList,
      client,
      isSubscribe,
      protocolNumber,
      content,
      startDt,
      vailDt,
      needMutliAndTen,
      isHightSpeed,
      businessType,
      softPermission,
      softPassword,
      softAccount,
    } = this.state;
    const { custName = '', brokerNumber = '' } = client || {};
    let newProtocolList = [];
    if (protocolList && protocolList.length) {
      newProtocolList = protocolList.map(item => ({
        show: true,
        label: item.id,
        value: `${item.id}~${item.flowId}`,
      }));
    }
    let selectSoftPermission = softPermission || [];
    if (isEditPage) {
      newProtocolList = [
        {
          show: true,
          label: protocolNumber,
          value: protocolNumber,
        },
      ];
    }
    selectSoftPermission = selectSoftPermission.map(v => ({ value: v.code }));
    const accountNumber = permission.protocolIsShowSwitch(protocolTemplate.rowId || '', subType, needMutliAndTen) ?
      (<div>
        <InfoForm label="是否多账户使用" >
          <CustomSwitch
            name="multiUsedFlag"
            value={multiUsedFlag}
            onChange={this.handleUseSwitch}
          />
        </InfoForm>
        <InfoForm label="是否订购十档行情">
          <CustomSwitch
            name="levelTenFlag"
            value={levelTenFlag}
            onChange={this.handleOrderSwitch}
          />
        </InfoForm>
      </div>
      )
      :
      null;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        {
          isEditPage ?
            <div>
              <InfoItem label="子类型" value={subType} />
              <InfoItem label="操作类型" value={protocolDetail.operationTypeText} />
              <InfoItem label="客户" value={`${(protocolDetail.contactName || protocolDetail.accountName)} ${protocolDetail.econNum}`} />
            </div>
            :
            <div className={styles.editWrapperThree}>
              <InfoForm label="子类型" required>
                <Select
                  name="subType"
                  data={subTypeList}
                  value={subType}
                  onChange={this.handleSubTypeSelect}
                />
              </InfoForm>
              <InfoForm label="操作类型" required>
                <Select
                  name="operationType"
                  data={operationTypeList}
                  value={operationType}
                  onChange={this.handleOperateTypeSelect}
                />
              </InfoForm>
              <InfoForm label="客户" required>
                <AutoComplete
                  placeholder="经纪客户号/客户名称"
                  showObjKey="custName"
                  objId="brokerNumber"
                  defaultSearchValue={`${custName} ${brokerNumber}`}
                  searchList={custList}
                  onSelect={this.handleSelectClient}
                  onSearch={this.handleSearchClient}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
        }
        {
          isSubscribe ?
            <InfoForm label="协议模板" required>
              <AutoComplete
                placeholder="协议模板"
                showObjKey="prodName"
                objId="rowId"
                defaultSearchValue={isEditPage ? `${protocolTemplate.prodName || ''}` : ''}
                searchList={templateList}
                onSelect={this.handleSelectTemplate}
                onSearch={this.handleSearchTemplate}
                ref={ref => this.selectTemplateComponent = ref}
              />
            </InfoForm>
            :
            <div>
              {
                isEditPage ?
                  <InfoItem label="协议编号" value={protocolNumber || ''} />
                  :
                  <InfoForm label="协议编号" required>
                    <Select
                      name="protocolNumber"
                      data={newProtocolList}
                      value={protocolNumber}
                      onChange={this.handleSelectProtocol}
                    />
                  </InfoForm>
              }
              <InfoItem label="协议模版" value={protocolTemplate.prodName || ''} />
            </div>
        }
        {
          !isHightSpeed ? accountNumber : null
        }
        <InfoItem label="协议开始日期" value={startDt ? time.format(startDt) : '暂无'} />
        <InfoItem label="协议有效期" value={vailDt ? time.format(vailDt) : '暂无'} />
        {
          /* 判断是否套利软件 */
          (!this.isArbirageSoftware() || _.isEmpty(businessTypeList)) ? null
          :
          (
            <InfoForm label="业务类型" required>
              <Select
                name="businessType"
                data={businessTypeList}
                value={businessType}
                onChange={this.handleBusinessTypeSelect}
              />
            </InfoForm>
          )
        }
        {
          /* 开通权限(只有在权限或者软件+权限时候才显示) */
          (!this.needShowOpenPermission() || _.isEmpty(openPermissionList)) ? null :
          (
            <InfoForm label="开通权限" required>
              <HtscTreeSelect
                name="openPermission"
                placeholder="请选择开通权限"
                defaultValue={selectSoftPermission}
                treeData={openPermissionList}
                boxStyle={{ width: 260, height: 'auto' }}
                onSelect={this.handleOpenPermissionChange}
                getPopupContainer={getParentContainer}
                ref={this.refHtscTreeSelect}
              />
            </InfoForm>
          )
        }
        {
          /* 软件信息 只有在 软件或者软件+权限或者软件续用才显示 */
          !this.needShowSoftware() ? null : (<InfoItem label="软件账号" value={softAccount || '暂无'} />)
        }
        {
          !this.needShowSoftware() ? null : (<InfoItem label="软件密码" value={softPassword || '暂无'} />)
        }
        <InfoForm label="备注">
          <TextArea
            onChange={this.handleChangeContent}
            value={content}
          />
        </InfoForm>
      </div>
    );
  }
}
