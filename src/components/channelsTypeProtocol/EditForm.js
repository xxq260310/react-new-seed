/*
 * @Description: 通道类型协议新建/修改 页面
 * @Author: XuWenKang
 * @Date:   2017-09-19 14:47:08
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-08 09:01:08
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import EditBaseInfo from './EditBaseInfo';
import InfoTitle from '../common/InfoTitle';
import SearchSelect from '../common/Select/SearchSelect';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import Transfer from '../../components/common/biz/TableTransfer';
import { seibelConfig } from '../../config';
import config from '../../routes/channelsTypeProtocol/config';
import styles from './editForm.less';
import channelType from '../../helper/page/channelType';
import logable from '../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
  attachmentMap,  // 附件类型数组
} = seibelConfig.channelsTypeProtocol;
const attachmentRequired = {
  // 不需要校验附件必传
  noNeed: [],
  // 没有下挂客户时，需要必传的附件类型
  noCust: [attachmentMap[0].type],
  // 有下挂客户时，需要必传的附件类型
  hasCust: [
    attachmentMap[0].type,
    attachmentMap[1].type,
    attachmentMap[2].type,
  ],
  // 高速通道订购，续订必传的附件类型,
  highSpeedProtocol: [
    attachmentMap[0].type,
    attachmentMap[3].type,
    attachmentMap[5].type,
  ],
  // 套利软件
  arbirageSoftware: [
    attachmentMap[0].type,
    attachmentMap[3].type,
    attachmentMap[5].type,
  ],
};
const ArbirageSoftWareType = config.protocolSubTypes.arbitrageSoft; // 套利软件的子类型值
const custAttachment = ['noNeed', 'noCust', 'hasCust', 'highSpeedProtocol', 'arbirageSoftware'];
const { subscribeArray, unSubscribeArray, addDelArray, custStatusObj, custOperateArray } = config;

export default class EditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户
    onSearchCutList: PropTypes.func,
    canApplyCustList: PropTypes.array,
    // 模板列表
    templateList: PropTypes.array.isRequired,
    // 业务类型
    businessTypeList: PropTypes.array.isRequired,
    // 开通权限列表
    openPermissionList: PropTypes.array.isRequired,
    // 协议详情-编辑时传入
    protocolDetail: PropTypes.object,
    // 查询协议详情接口
    getProtocolDetail: PropTypes.func,
    // 查询子类型/操作类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    // 查询开通权限列表，在驳回后修改的页面中使用
    queryOpenPermissionList: PropTypes.func,
    // 查询业务类型列表，在驳回后修改的页面中使用
    queryBusinessTypeList: PropTypes.func,
    operationTypeList: PropTypes.array,
    subTypeList: PropTypes.array,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 所选模板对应协议条款列表
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    // 协议产品列表
    protocolProductList: PropTypes.array.isRequired,
    // 保存详情
    saveProtocolData: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array.isRequired,
    // 下挂客户接口
    onQueryCust: PropTypes.func.isRequired,
    // 清空props数据
    clearPropsData: PropTypes.func.isRequired,
    // 验证客户
    getCustValidate: PropTypes.func,
    // 附件列表
    attachmentList: PropTypes.array.isRequired,
    // 模版信息
    template: PropTypes.object,
    // 协议 ID 列表接口
    queryProtocolList: PropTypes.func,
    // 协议 ID 列表
    protocolList: PropTypes.array,
    // 查询审批人接口
    getFlowStepInfo: PropTypes.func.isRequired,
    // 清除详情数据
    clearDetailData: PropTypes.func,
    // 筛选协议模板
    filterTemplate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSearchCutList: () => { },
    canApplyCustList: EMPTY_LIST,
    protocolDetail: EMPTY_OBJECT,
    getProtocolDetail: () => { },
    operationTypeList: [],
    getCustValidate: () => { },
    template: {},
    subTypeList: [],
    queryProtocolList: () => { },
    protocolList: [],
    clearDetailData: () => { },
    queryOpenPermissionList: () => { },
    queryBusinessTypeList: () => { },
  }

  constructor(props) {
    super(props);
    const { underCustList, protocolDetail, location: { pathname } } = props;
    const isEdit = !_.isEmpty(protocolDetail) && pathname.indexOf('/edit') > -1;
    let custOperate = true;
    // 更新附件组件必传项
    let hasCust = custAttachment[1];
    if (isEdit) {
      const { subType, operationType } = protocolDetail;
      // 如果操作类型是退订，则不对附件做校验
      if (_.includes(unSubscribeArray, operationType)) {
        hasCust = custAttachment[0];
      } else if (channelType.isGSChannel(subType)) {
        // 如果子类型是高速通道，对高速通道类型的附件做检验
        hasCust = custAttachment[3];
      } else if (channelType.isArbirageSoftware(subType)) {
        hasCust = custAttachment[4];
      }
      if (_.includes(custOperateArray, protocolDetail.operationType)) {
        custOperate = true;
      } else {
        custOperate = false;
      }
    }
    // 找出需要必传的数组
    const requiredArr = attachmentRequired[hasCust];
    // 清空附件数组的必传项
    const defaultAttachmentArr = attachmentMap.map(item => ({
      ...item,
      required: false,
    }));
    // 将附件数组做必传项配置
    const attachmentMapRequired = defaultAttachmentArr.map((item) => {
      if (_.includes(requiredArr, item.type)) {
        return {
          ...item,
          required: true,
        };
      }
      return item;
    });

    this.state = {
      isArbirageSoftWare: channelType.isArbirageSoftware(protocolDetail.subType),
      isEdit,
      // 附件类型列表
      attachmentTypeList: attachmentMapRequired,
      // 下挂客户表格数据
      cust: isEdit ? protocolDetail.cust : EMPTY_LIST,
      // 所选协议产品列表
      productList: isEdit ? protocolDetail.item : EMPTY_LIST,
      protocolClause: isEdit ? protocolDetail.term : EMPTY_LIST,
      // 是否多账户
      multiUsedFlag: protocolDetail.multiUsedFlag === 'Y' || false,
      underCustList,
      isNeedTransfer: true,
      // 协议产品是否可编辑，默认true
      productOperate: true,
      // 下挂客户是否可编辑，默认 true
      custOperate,
      clearProduct: false,
      // 操作类型
      operationType: isEdit ? protocolDetail.operationType : '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachmentList: preAl } = this.props;
    const { protocolDetail: nextPD, attachmentList: nextAL } = nextProps;
    if (!_.isEmpty(nextAL) && preAl !== nextAL) {
      let assignAttachment = [];
      // 对数据进行必传等配置
      if (nextAL.length) {
        assignAttachment = attachmentMap.map((item) => {
          let newItem = {};
          const filterArr = _.filter(nextAL, o => o.title === item.title);
          if (filterArr.length) {
            newItem = {
              ...item,
              ...filterArr[0],
              length: filterArr[0].attachmentList.length,
            };
          } else {
            newItem = item;
          }
          return newItem;
        });
      }
      let hasCust;
      if (channelType.isZJKCDChannel(nextPD.subType)) {
        // 如果子类型是紫金快车道
        hasCust = nextPD.multiUsedFlag === 'Y' ? custAttachment[2] : custAttachment[1];
      } else {
        // 否则对高速通道的附件进行校验
        hasCust = custAttachment[3];
      }
      if (_.includes(unSubscribeArray, nextPD.operationType)) {
        hasCust = custAttachment[0];
      }
      this.setState({
        // 附件类型列表
        attachmentTypeList: assignAttachment,
      }, () => this.setUploadConfig(hasCust));
    }
  }

  componentWillUnmount() {
    // 销毁组件时清空数据
    const { clearPropsData } = this.props;
    clearPropsData();
  }

  // 切换协议编号
  @autobind
  onChangeProtocolNumber(operationType, subType) {
    const { protocolDetail, protocolDetail: { cust, item: productList, term } } = this.props;
    let hasCust = protocolDetail.multiUsedFlag === 'Y' ? custAttachment[2] : custAttachment[1];
    // 协议产品不可编辑，下挂客户不可编辑
    const productOperate = false;
    let custOperate = false;
    // 新增或删除下挂客户时可以进行下挂客户操作
    if (_.includes(addDelArray, operationType)) {
      custOperate = true;
    }
    if (_.includes(unSubscribeArray, operationType)) {
      hasCust = custAttachment[0];
    }
    if (channelType.isZJKCDChannel(subType)) {
      this.setState({
        productOperate,
        custOperate,
        isEdit: true,
        // 下挂客户表格数据
        cust,
        // 所选协议产品列表
        productList,
        protocolClause: term,
        multiUsedFlag: protocolDetail.multiUsedFlag === 'Y',
      }, () => this.setUploadConfig(hasCust));
    }
    if (channelType.isGSChannel(subType)) {
      this.setState({
        productOperate,
        isEdit: true,
        // 所选协议产品列表
        productList,
        protocolClause: term,
      });
    }
  }

  // 切换多账户
  @autobind
  onChangeMultiCustomer(boolean) {
    // 切换时隐藏显示下挂客户组件，并清空数据
    this.setState({
      multiUsedFlag: boolean,
      cust: [],
      isNeedTransfer: false,
    }, () => {
      if (this.editBaseInfoComponent) {
        const baseInfoData = this.editBaseInfoComponent.getData();
        if (channelType.isZJKCDChannel(baseInfoData.subType)) {
          // 如果子类型是紫金快车道时切换多账户才改变上传文件的必填项
          this.setUploadConfig(boolean ? custAttachment[2] : custAttachment[1]);
        }
      }
    });
  }

  // 向父组件提供数据
  @autobind
  getData() {
    const baseInfoData = this.editBaseInfoComponent.getData();
    const { protocolClauseList, protocolDetail, location: { pathname } } = this.props;
    const { productList, attachmentTypeList, cust, isEdit, isArbirageSoftWare } = this.state;
    let formData = {};
    // 生成订购时的数据，如果是订购
    if (_.includes(subscribeArray, baseInfoData.operationType)) {
      formData = {
        subType: baseInfoData.subType,
        custId: baseInfoData.client.cusId,
        custType: baseInfoData.client.custType,
        econNum: baseInfoData.client.brokerNumber,
        startDt: '',
        vailDt: '',
        content: baseInfoData.content,
        operationType: baseInfoData.operationType,
        templateId: baseInfoData.protocolTemplate.rowId,
        multiUsedFlag: baseInfoData.multiUsedFlag ? 'Y' : 'N',
        levelTenFlag: baseInfoData.levelTenFlag ? 'Y' : 'N',
        item: productList,
        term: (isEdit && _.isEmpty(protocolClauseList)) ? protocolDetail.term : protocolClauseList,
        attachment: attachmentTypeList,
        cust,
        flowid: isEdit ? protocolDetail.flowid : '',
        id: isEdit ? protocolDetail.id : '',
      };
      // TODO 如果是套利软件传递不同的参数
      if (isArbirageSoftWare) {
        formData = {
          subType: baseInfoData.subType,
          custId: baseInfoData.client.cusId,
          custType: baseInfoData.client.custType,
          econNum: baseInfoData.client.brokerNumber,
          startDt: '',
          vailDt: '',
          content: baseInfoData.content,
          operationType: baseInfoData.operationType,
          templateId: baseInfoData.protocolTemplate.rowId,
          attachment: attachmentTypeList,
          flowid: isEdit ? protocolDetail.flowid : '',
          id: isEdit ? protocolDetail.id : '',
          softPermission: baseInfoData.softPermission,
          softBusinessType: baseInfoData.businessType,
        };
      }
    } else {
      // 其他操作类型的数据
      formData = {
        ...protocolDetail,
        subType: baseInfoData.subType,
        agreementNum: baseInfoData.protocolNumber,
        custId: baseInfoData.client.cusId,
        custType: baseInfoData.client.custType,
        econNum: baseInfoData.client.brokerNumber,
        flowId: protocolDetail.flowid,
        operationType: baseInfoData.operationType,
        content: baseInfoData.content,
        attachment: attachmentTypeList,
        item: productList,
        cust,
      };
    }
    if (!(pathname.indexOf('/edit') > -1)) {
      formData.submitFlag = 'Y';
    }
    return formData;
  }

  // 设置上传配置项
  @autobind
  setUploadConfig(hasCust) {
    const { attachmentTypeList } = this.state;
    // 找出需要必传的数组
    const requiredArr = attachmentRequired[hasCust];
    // 清空附件数组的必传项
    const defaultAttachmentArr = attachmentTypeList.map(item => ({
      ...item,
      required: false,
      order: 2, // 表示放到数组后面
    }));
    // 将附件数组做必传项配置
    const attachmentMapRequired = defaultAttachmentArr.map((item) => {
      if (_.includes(requiredArr, item.type)) {
        return {
          ...item,
          required: true,
          order: 1, // 表示放到数组前面
        };
      }
      return item;
    });
    // 需要将必填的取出来，放在头部
    const lastattachmentMapRequired = _.sortBy(attachmentMapRequired, 'order');
    this.setState({
      attachmentTypeList: lastattachmentMapRequired,
    });
  }
  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
      defaultData: {},
      editClause: false,
    });
  }

  // 添加协议产品
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '协议产品',
    },
  })
  handleTransferChange(flag, newSelect, changeSecondArray) {
    this.setState({
      productList: changeSecondArray,
    });
  }

  // 下挂客户添加事件
  @autobind
  changeFunction(value) {
    const baseInfoData = this.editBaseInfoComponent.getData();
    const { cust } = this.state;
    const newCust = [...cust];
    let id = '';
    if (!_.isEmpty(baseInfoData.protocolNumber)) {
      id = this.props.protocolDetail.id;
    }
    this.setState({
      underCustList: [],
    });
    if (baseInfoData.client.cusId === value.custId) {
      message.error('已选择的主客户不能添加到下挂客户');
      return;
    }
    if (_.isEmpty(value)) {
      message.error('请选择客户');
      return;
    }
    const filterCust = _.filter(cust, o => o.econNum === value.econNum);
    // 如果已添加的客户找到了现在添加的客户
    if (filterCust.length) {
      if (!_.includes(custStatusObj.canAdd, filterCust[0].custStatus)) {
        message.error('相同客户不能重复添加');
        return;
      }
    }
    const { subType, protocolTemplate: { rowId } } = baseInfoData;
    const { custId, econNum, subCustType } = value;
    const validatePayload = {
      id: custId,
      custType: subCustType === '个人客户' ? 'per' : 'org',
      econNum,
      agrId: id,
      agrType: subType,
      templateId: rowId,
      type: 'ItuCust',
    };
    const { getCustValidate } = this.props;
    getCustValidate(validatePayload).then(() => {
      let finalCust = [];
      if (filterCust.length && _.includes(custStatusObj.canAdd, filterCust[0].custStatus)) {
        _.remove(newCust, o => o.econNum === filterCust[0].econNum);
        newCust.push({
          ...filterCust[0],
          custStatus: '开通处理中',
        });
        finalCust = newCust;
      } else {
        finalCust = [...cust, value];
      }
      this.setState({
        cust: finalCust,
      });
    });
  }

  // 下挂客户搜索事件
  @autobind
  changeValue(value) {
    const { onQueryCust } = this.props;
    if (_.isEmpty(value)) {
      message.error('请输入客户号或姓名');
      return;
    }
    onQueryCust({
      keyWord: value,
    }).then(() => {
      this.setState({
        underCustList: this.props.underCustList,
      });
    });
  }

  // 表格删除事件
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '下挂客户删除',
    },
  })
  deleteTableData(record, index) {
    const { cust } = this.state;
    const testArr = _.cloneDeep(cust);
    const { custStatus } = record;
    // 如果在不可删除的数组中，提示不可以删除
    if (_.includes(custStatusObj.cannotDelete, custStatus)) {
      message.error('该客户不可以删除');
    } else if (_.includes(custStatusObj.canDelete, custStatus)) {
      // 如果在可删除的数组中，直接删除
      const newTableList = _.remove(testArr, (n, i) => i !== index);
      this.setState({
        cust: newTableList,
      });
    } else if (_.includes(custStatusObj.logicalDelete, custStatus)) {
      // 如果在逻辑删除的数组中，修改为退订处理中
      testArr[index].custStatus = '退订处理中';
      this.setState({
        cust: testArr,
      });
    }
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(attachmentType, attachment) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType) {
        return {
          ...item,
          uuid: attachment,
          length: length + 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(attachmentType) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType && length > 0) {
        return {
          ...item,
          length: length - 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  // 清除附件信息
  @autobind
  resetUpload() {
    const { attachmentTypeList } = this.state;
    const newAttachmentList = attachmentTypeList.map((item) => {
      if (item.length) {
        const type = `uploader${item.type}`;
        this[type].getWrappedInstance().resetUpload();
        return {
          ...item,
          length: 0,
          uuid: '',
        };
      }
      return {
        ...item,
      };
    });
    this.setState({
      productList: [],
      attachmentTypeList: newAttachmentList,
    });
    // this.EditFormComponent.getData();
  }

  // 清除协议产品信息
  @autobind
  resetProduct() {
    this.setState({
      productList: [],
      protocolClause: [],
    });
  }

  // EditBaseInfo切换操作类型
  @autobind
  handleChangeOperationType(operationType) {
    const productOperate = _.includes(subscribeArray, operationType);
    this.resetProduct();
    this.setState({
      isEdit: false,
      operationType,
      productOperate,
    });
  }

  // 设置子类型
  @autobind
  handleChangeSubType(st) {
    const isArbirageSoftWare = st === ArbirageSoftWareType;
    if (isArbirageSoftWare) {
      // 如果子类型切换到套利软件，则需要修改附件必填项和顺序
      this.setUploadConfig(custAttachment[4]);
    }
    this.setState({
      isArbirageSoftWare,
    });
  }

  // EditBaseInfo切换子类型和操作类型时改变对应的上传文件必填项
  @autobind
  handleChangeRequiredFile(subType, operateType) {
    // 子类型是高速通道协议
    if (channelType.isGSChannel(subType)) {
      // 操作类型是订购或续订
      if (operateType === config.subscribeArray[0] || operateType === config.renewalArray[0]) {
        this.setUploadConfig(custAttachment[3]);
      } else {
        this.setUploadConfig(custAttachment[0]);
      }
    }
  }

  @autobind
  editComponentRef(input) {
    this.editComponent = input;
  }

  @autobind
  getEditContainer() {
    return this.editComponent;
  }

  render() {
    const {
      location,
      // 客户列表
      canApplyCustList,
      // 查询客户
      onSearchCutList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 模板列表
      templateList,
      // 业务类型
      businessTypeList,
      // 开通权限列表
      openPermissionList,
      // 操作类型列表
      operationTypeList,
      // 子类型列表
      subTypeList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议产品列表
      protocolProductList,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 验证客户
      getCustValidate,
      // 详情数据
      protocolDetail,
      // 详情接口
      getProtocolDetail,
      // 清除数据
      clearPropsData,
      // 模版数据
      template,
      // 获取协议 ID 列表
      queryProtocolList,
      // 协议 ID 列表
      protocolList,
      getFlowStepInfo,
      clearDetailData,
      queryOpenPermissionList,
      queryBusinessTypeList,
      // 筛选协议模板
      filterTemplate,
    } = this.props;
    const {
      isArbirageSoftWare,
      isEdit,
      cust,
      attachmentTypeList,
      multiUsedFlag,
      // 下挂客户列表
      underCustList,
      productOperate,
      custOperate,
      productList,
      protocolClause,
      operationType,
    } = this.state;
    // 下挂客户表格中需要的操作
    const customerOperation = {
      column: {
        key: 'delete', // 'check'\'delete'\'view'
        title: '操作',
      },
      operate: this.deleteTableData,
    };
    // 添加协议产品组件props
    const pagination = {
      defaultPageSize: 5,
      pageSize: 5,
      size: 'small',
    };
    const transferProps = {
      firstTitle: '待选协议产品',
      secondTitle: '已选协议产品',
      firstData: protocolProductList,
      secondData: (isEdit && _.isEmpty(protocolProductList)) ? protocolDetail.item : [],
      firstColumns: protocolProductTitleList,
      secondColumns: protocolProductTitleList,
      transferChange: this.handleTransferChange,
      rowKey: 'prodRowId',
      scrollX: 1010,
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      supportSearchKey: [['prodCode'], ['prodName']],
      isNeedTransfer: productOperate,
    };
    const customerSelectList = underCustList.length ? underCustList.map(item => ({
      ...item,
      custStatus: '开通处理中',
    })) : EMPTY_LIST;
    return (
      <div className={styles.editComponent} ref={this.editComponentRef}>
        <div className={styles.editWrapper}>
          <EditBaseInfo
            location={location}
            queryChannelProtocolItem={queryChannelProtocolItem}
            onSearchCutList={onSearchCutList}
            custList={canApplyCustList}
            templateList={templateList}
            businessTypeList={businessTypeList}
            ref={ref => this.editBaseInfoComponent = ref}
            queryTypeVaules={queryTypeVaules}
            queryOpenPermissionList={queryOpenPermissionList}
            queryBusinessTypeList={queryBusinessTypeList}
            operationTypeList={operationTypeList}
            subTypeList={subTypeList}
            queryChannelProtocolProduct={queryChannelProtocolProduct}
            onChangeMultiCustomer={this.onChangeMultiCustomer}
            resetUpload={this.resetUpload}
            resetProduct={this.resetProduct}
            getCustValidate={getCustValidate}
            formData={protocolDetail}
            getProtocolDetail={getProtocolDetail}
            clearPropsData={clearPropsData}
            isEdit={isEdit}
            template={template}
            queryProtocolList={queryProtocolList}
            protocolList={protocolList}
            onChangeProtocolNumber={this.onChangeProtocolNumber}
            getFlowStepInfo={getFlowStepInfo}
            clearDetailData={clearDetailData}
            changeOperationType={this.handleChangeOperationType}
            changeRequiredFile={this.handleChangeRequiredFile}
            getParentContainer={this.getEditContainer}
            onChangeSubType={this.handleChangeSubType}
            openPermissionList={openPermissionList}
            filterTemplate={filterTemplate}
          />
        </div>
        {
          /* 此处新增判断如果是套利软件,则不显示协议产品，下挂客户等 */
          isArbirageSoftWare ? null :
          (
            <div className={`${styles.editWrapper} ${styles.transferWrapper}`}>
              <InfoTitle
                head="协议产品"
              />
              {
                _.includes(subscribeArray, operationType) ?
                  <Transfer
                    {...transferProps}
                  />
                  :
                  <CommonTable
                    data={(isEdit && _.isEmpty(protocolProductList)) ? productList : []}
                    titleList={protocolProductTitleList}
                  />
              }
            </div>
          )
        }
        {
          isArbirageSoftWare ? null :
          (
            <div className={styles.editWrapper}>
              <InfoTitle head="协议条款" />
              <CommonTable
                data={(isEdit && _.isEmpty(protocolClauseList)) ?
                  protocolClause
                  :
                  protocolClauseList}
                titleList={protocolClauseTitleList}
              />
            </div>
          )
        }
        {
          !isArbirageSoftWare && multiUsedFlag ?
            <div className={styles.editWrapper}>
              <InfoTitle head="下挂客户" />
              {
                custOperate ?
                  <SearchSelect
                    onAddCustomer={this.changeFunction}
                    onChangeValue={this.changeValue}
                    width="184px"
                    labelName="客户"
                    dataSource={customerSelectList}
                  />
                  :
                  null
              }
              <div className={styles.customerTable}>
                <CommonTable
                  data={cust}
                  titleList={underCustTitleList}
                  operation={custOperate ? customerOperation : {}}
                />
              </div>
            </div>
            :
            null
        }
        <div className={styles.editWrapper}>
          <InfoTitle head="附件" />
          {
            attachmentTypeList.map((item) => {
              const uploaderElement = item.show ? (
                <div className={styles.mt10}>
                  <MultiUploader
                    key={item.type}
                    edit
                    type={item.type}
                    title={item.title}
                    required={item.required}
                    attachment={isEdit ? item.uuid : ''}
                    attachmentList={isEdit ? item.attachmentList : []}
                    uploadCallback={this.handleUploadCallback}
                    deleteCallback={this.handleDeleteCallback}
                    ref={(ref) => { this[`uploader${item.type}`] = ref; }}
                    showDelete
                  />
                </div>
              ) : null;
              return (
                <div key={item.type}>
                  {uploaderElement}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
