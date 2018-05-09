/**
 * @description 用于展示各种Modal
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import Icon from '../../components/common/Icon';
import { VisibleRangeAll } from './VisibleRange';
import CreateBoardModal from '../../components/modals/CreateBoardModal';
import BackConfirmModal from '../../components/modals/BackConfirmModal';
import PublishConfirmModal from '../../components/modals/PublishConfirmModal';
import DeleteBoardModal from '../../components/modals/DeleteBoardModal';
import ProcessConfirm from '../../components/common/biz/ProcessConfirm';
import Transfer from '../../components/common/biz/TableTransfer';
import CommonUpload from '../../components/common/biz/CommonUpload';
import CommonModal from '../../components/common/biz/CommonModal';
import InfoItem from '../../components/common/infoItem';
import SearchSelect from '../../components/common/Select/SearchSelect';
import DigitalTrimmer from '../../components/common/DigitalTrimmer';
import ApprovalRecordBoard from '../../components/commissionAdjustment/ApprovalRecordBoard';
import EditModal from '../../components/relation/EditModal';


import {
  confirmData,
  subscribelData,
  unsubcribeData,
  // data,
  productColumns,
} from './MockTableData';
import styles from './home.less';

const visibleRange = VisibleRangeAll;

export default class TemplModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      createBoardModal: false,
      backConfirmModal: false,
      publishConfirmModal: false,
      deleteBoardModal: false,
      confirmModal: false,
      commonModal: false,
      approvalModal: false,
      editModal: false,
    };
  }

  @autobind
  onOk() {
    this.setState({
      commonModal: false,
    });
  }

  @autobind
  openCreateModal() {
    this.setState({
      createBoardModal: true,
    });
  }

  @autobind
  openBackConfirmModal() {
    this.setState({
      backConfirmModal: true,
    });
  }

  @autobind
  openPublishConfirmModal() {
    this.setState({
      publishConfirmModal: true,
    });
  }

  @autobind
  openDeleteBoardModal() {
    this.setState({
      deleteBoardModal: true,
    });
  }

  @autobind
  openConfirmClick() {
    this.setState({
      confirmModal: true,
    });
  }

  @autobind
  handleOk(param) {
    console.log(param);
  }

  @autobind
  handleSearch(keyword) {
    console.log(keyword);
  }

  @autobind
  handleTransferChange(flag, selected, updateArray, differenceRate) {
    console.log(flag, selected, updateArray, differenceRate);
  }

  @autobind
  handleCheckChange(selectedItem, updateArray) {
    console.log(selectedItem, updateArray);
  }

  @autobind
  showModal(modal) {
    this.setState({
      [modal]: true,
    });
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }
 @autobind
  changeFunction(value) {
    console.log(value);
    console.log('111');
  }
  @autobind
  openApprovalModal() {
    this.setState({
      approvalModal: true,
    });
  }

  @autobind
  closeApprovalModal() {
    this.setState({
      approvalModal: false,
    });
  }

   @autobind
  changeValue(value) {
    console.log('value', value);
  }

  @autobind
  handleOkOfDropDown(obj) {
    console.log('#######obj########', obj);
    this.closeModal(obj.modalKey);
  }

  @autobind
  renderSelectedElem(selected, removeFunc) {
    return (
      <div className={styles.result}>
        <div className={styles.nameLabel}>{selected.name}</div>
        <div className={styles.custIdLabel}>{selected.id}</div>
        <div className={styles.iconDiv}>
          <Icon
            type="close"
            className={styles.closeIcon}
            onClick={removeFunc}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      createBoardModal,
      backConfirmModal,
      publishConfirmModal,
      deleteBoardModal,
      confirmModal,
      commonModal,
      approvalModal,
      editModal,
    } = this.state;

    const createBMProps = {
      modalKey: 'createBoardModal',
      modalCaption: '创建绩效看板',
      visible: createBoardModal,
      closeModal: this.closeModal,
      level: '1',
      allOptions: visibleRange,
      confirm: this.openCreateModal,
      ownerOrgId: '1',
      operateData: {},
      createLoading: false,
    };

    const backConfirmMProps = {
      modalKey: 'backConfirmModal',
      modalCaption: '提示',
      visible: backConfirmModal,
      closeModal: this.closeModal,
      confirm: this.openBackConfirmModal,
    };

    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.openPublishConfirmModal,
    };

    const deleteBoardMProps = {
      modalKey: 'deleteBoardModal',
      modalCaption: '提示',
      modalName: '分公司经营业绩看板',
      visible: deleteBoardModal,
      closeModal: this.closeModal,
      confirm: this.openDeleteBoardModal,
    };

    const confirmProps = {
      visible: confirmModal,
      content: confirmData,
      modalKey: 'confirmModal',
      onOk: this.closeModal,
    };

    const pagination = {
      defaultPageSize: 5,
      pageSize: 5,
      size: 'small',
    };

    const transferProps = {
      firstData: subscribelData,
      // secondData: data,
      secondData: unsubcribeData,
      firstColumns: productColumns,
      secondColumns: productColumns,
      transferChange: this.handleTransferChange,
      checkChange: this.handleCheckChange,
      rowKey: 'key',
      defaultCheckKey: 'default',
      disableCheckKey: 'disable',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: ['0.0004', 'rate'],
      supportSearchKey: [['productCode'], ['productName']],
      // scrollX: '130%',
      // isNeedTransfer: false,
    };


    const uploadProps = {
      attachmentList: [{
        creator: '002332',
        attachId: '{6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        name: '新建文本文档 (3).txt',
        size: '0',
        createTime: '2017/09/12 13:37:45',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        realDownloadURL: '/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={6795CB98-B0CD-4CEC-8677-3B0B9298B209',
      },
      {
        creator: '002332',
        attachId: '{2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        name: '测试.docx',
        size: '11',
        createTime: '2017/09/12 11:53:36',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        realDownloadURL: '/attach/download?filename=%E6%B5%8B%E8%AF%95.docx&attachId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D',
      },
      {
        creator: '002332',
        attachId: '{24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        name: '生产sql和修改后sql.txt',
        size: '2',
        createTime: '2017/09/12 11:55:32',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        realDownloadURL: '/attach/download?filename=%E7%94%9F%E4%BA%A7sql%E5%92%8C%E4%BF%AE%E6%94%B9%E5%90%8Esql.txt&attachId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F',
      }],
    };

    const commonModalProps = {
      modalKey: 'commonModal',
      title: '这是一个弹出层',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: commonModal,
      size: 'large',
      children: 'tanchuang',
    };

    const approvalCust = {
      batchNum: '308RY237WE00001',
      custId: '1-DF-7620',
      custType: 'per',
      econNum: '02000191',
      custName: '张三',
      custLevel: '钻石',
      openAccDept: '南京长江路证券营业部南京长江路证券营业部',
      status: '成功',
    };

    const dataSource = [
      {
        key: '1-34Z1T0D-1',
        name: '通道佣金专用（万分之1.5）',
      },
      {
        key: '1-34Z1T0D-2',
        name: '通道佣金专用（万分之1.6）',
      },
    ];

    const eidtModalProps = {
      visible: editModal,
      modalKey: 'editModal',
      onSearch: this.handleSearch,
      onOk: this.handleOkOfDropDown,
      onCancel: this.closeModal,
      category: 'manager',
    };

    return (
      <div>
        <Button onClick={this.openApprovalModal}>打开审批记录弹窗</Button>
        <ApprovalRecordBoard
          cust={approvalCust}
          visible={approvalModal}
          onClose={this.closeApprovalModal}
        />
        <Button onClick={this.openCreateModal}>创建</Button>
        <CreateBoardModal {...createBMProps} />
        <Button onClick={this.openBackConfirmModal}>Back</Button>
        <BackConfirmModal {...backConfirmMProps} />
        <Button onClick={this.openPublishConfirmModal}>发布</Button>
        <PublishConfirmModal {...publishConfirmMProps} />
        <Button onClick={this.openDeleteBoardModal}>删除</Button>
        <DeleteBoardModal {...deleteBoardMProps} />
        <br />
        <br />
        <EditModal {...eidtModalProps} />
        <br />
        <Button onClick={this.openConfirmClick}>show confirm弹框</Button>
        <CommonUpload {...uploadProps} edit />
        <CommonUpload {...uploadProps} />
        <Button onClick={() => { this.showModal('confirmModal'); }}>打开公用弹窗</Button>
        <ProcessConfirm {...confirmProps} />
        <br />
        <br />
        <div className={styles.tranfer}>
          <Transfer {...transferProps} />
        </div>
        <CommonModal {...commonModalProps} />
        <br />
        <InfoItem label="备注" value="这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值" />
        <br />
        <SearchSelect
          onAddCustomer={this.changeFunction}
          onChangeValue={this.changeValue}
          width="184px"
          labelName="产品"
          dataSource={dataSource}
        />
        <br />
        <DigitalTrimmer
          min={0.16}
          max={3}
          step={0.01}
          defaultValue={0.16}
          getValue={this.changeFunction}
        />
      </div>
    );
  }
}
