/**
 * @file list/CreateContactModal.js
 *  电话联系组件
 * @author xuxiaoqin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal, Button, Table } from 'antd';
import Icon from '../../common/Icon';
import Collapse from './CreateCollapse';
import { check } from '../../../helper';
import logable from '../../../decorators/logable';

import styles from './createContactModal.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const CONTACT_MAP = {
  cellPhones: '手机',
  workTels: '单位电话',
  homeTels: '家庭电话',
  otherTels: '其他电话',
};

export default class CreateContactModal extends PureComponent {
  static propTypes = {
    custContactData: PropTypes.object.isRequired,
    serviceRecordData: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    custType: PropTypes.string,
    createServiceRecord: PropTypes.func.isRequired,
    currentCustId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    executeTypes: PropTypes.array.isRequired, // 执行方式字典
    serveWay: PropTypes.array.isRequired, // 服务渠道字典
    handleCloseClick: PropTypes.func.isRequired,
    handleAddServiceRecord: PropTypes.func.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    currentCustName: PropTypes.string.isRequired,
    getCeFileList: PropTypes.func.isRequired,
    filesList: PropTypes.array,
  };

  static defaultProps = {
    data: {},
    custType: '',
    filesList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭' } })
  handleCancel() {
    const { onClose, handleCloseClick } = this.props;
    // 手动发送日志
    handleCloseClick();
    onClose();
    this.setState({ visible: false });
  }

  /**
  * 构造表格的列数据
  */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'contact',
      title: '其他联系人',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'phone',
      title: '手机',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'work',
      title: '单位电话',
      width: '20%',
      render: record =>
        // 当前行记录
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'home',
      title: '住宅电话',
      width: '20%',
      render: record =>
        <div className="recordSection" title={record}>
          {record}
        </div>,
    },
    {
      dataIndex: 'personType',
      title: '人员类型',
      width: '20%',
      render: record =>
        <div className="recordSection" title={record}>
          {record}
        </div>,
    }];

    return columns;
  }

  /**
  * 构造数据源
  */
  constructTableDatas(dataSource) {
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    return newDataSource;
  }

  @autobind
  constructOtherContact(contact) {
    return _.map(contact, (item, index) =>
      <div className={styles.otherTelsSection} key={index}>
        <div className={styles.leftSection}>
          <span className={styles.telName}>{CONTACT_MAP[index]}：</span>
        </div>
        <div className={styles.rightSection}>
          {
            _.map(item, (unit, flag) =>
              <div className={styles.telSection} key={flag}>
                <span>{this.formatPhoneNumber(unit.contactValue)}</span>
              </div>,
            )
          }
        </div>
      </div>,
    );
  }

  /**
   * 格式化手机号 15667567889 变成 156-6756-7889形式
   * 格式化座机号 02588888888 变成 025-88888888形式
   * @param {*} phone 手机号
   */
  formatPhoneNumber(phone) {
    let count = 0;
    let newPhone = '';
    const temp = phone.toString();
    const len = temp.length;
    let flag = 4;
    const isCellPhone = check.isCellPhone(phone);
    if (!isCellPhone) {
      // 不是手机号
      if (phone.indexOf('-') === -1) {
        // 但是后台没有处理成025-213413421形式
        flag = 8;
      }
    }

    for (let i = len - 1; i >= 0; i--) {
      if (count % flag === 0 && count !== 0) {
        newPhone = `${temp.charAt(i)}-${newPhone}`;
      } else {
        newPhone = `${temp.charAt(i)}${newPhone}`;
      }
      count++;
    }

    return newPhone;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '添加服务记录' } })
  handleServiceRecordClick() {
    const {
      onClose,
      createServiceRecord,
      currentCustName,
      currentCustId,
      handleAddServiceRecord,
    } = this.props;
    // 手动上传日志
    handleAddServiceRecord();
    // 先关闭联系方式对话框
    this.setState({
      visible: false,
    });
    // 打开创建服务记录对话框
    createServiceRecord({ custName: currentCustName, custId: currentCustId, flag: true });
    // 回调，关闭父组件state状态
    onClose();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '最近服务记录展开/折叠' } })
  handleCollapseClick() {
    this.props.handleCollapseClick();
  }

  render() {
    const {
      visible,
    } = this.state;

    const {
      custContactData = EMPTY_OBJECT,
      serviceRecordData = EMPTY_LIST,
      custType,
      currentCustId,
      executeTypes,
      serveWay,
      getCeFileList,
      filesList,
    } = this.props;
    if (!currentCustId || !visible) {
      return null;
    }

    const {
      perCustomerContactInfo = EMPTY_OBJECT,
      orgCustomerContactInfoList = EMPTY_LIST,
      custBaseInfo = EMPTY_OBJECT,
    } = custContactData;

    const { custName } = custBaseInfo;
    let otherContactInfo = EMPTY_LIST;
    let mainContactInfo = {
      nameInfo: {},
      cellInfo: '',
      telInfo: {},
    };
    let personalContactInfo = EMPTY_OBJECT;
    let isPersonHasContact = false;
    let isOrgMainContactHasTel = false;

    if (!_.isEmpty(custContactData)) {
      if (custType === 'org' && !_.isEmpty(orgCustomerContactInfoList)) {
        const mainContactIndex = _.findIndex(orgCustomerContactInfoList, item => item.mainFlag);
        let mainContactNameInfo;
        let mainContactAllInfo;
        if (mainContactIndex > -1) {
          // 机构客户中存在主要联系人
          // 找出主要联系人姓名和职位和具体电话信息
          mainContactAllInfo = _.pick(orgCustomerContactInfoList[mainContactIndex],
            ['name', 'custRela', 'cellPhones', 'workTels', 'homeTels', 'otherTels']);
          // 主联系人的姓名、职位
          mainContactNameInfo = _.pick(mainContactAllInfo, ['name', 'custRela']);
          // 主联系人的手机，住宅，单位，其他电话信息
          mainContactInfo = {
            nameInfo: mainContactNameInfo,
            cellInfo: _.isEmpty(mainContactAllInfo.cellPhones) ? '' :
              this.formatPhoneNumber(mainContactAllInfo.cellPhones[0].contactValue),
            telInfo: _.omitBy(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels']), _.isEmpty),
          };
          if (!_.isEmpty(_.pick(mainContactAllInfo, ['workTels', 'homeTels', 'otherTels', 'cellPhones']))) {
            isOrgMainContactHasTel = true;
          }
          const otherCellInfo = _.filter(mainContactAllInfo.cellPhones,
            item => !item.mainFlag) || EMPTY_LIST;
          if (!_.isEmpty(otherCellInfo)) {
            // 手机号不止一个
            mainContactInfo = _.merge({
              telInfo: {
                cellPhones: otherCellInfo,
              },
            }, mainContactInfo);
          }
        }
        // 其他联系人信息
        const otherContact = _.filter(orgCustomerContactInfoList,
          (item, index) => index !== mainContactIndex) || EMPTY_LIST;
        otherContactInfo = !_.isEmpty(otherContact) && _.map(otherContact, item => ({
          contact: item.name || '--',
          phone: _.isEmpty(item.cellPhones) ? '--' :
            this.formatPhoneNumber(item.cellPhones[0].contactValue),
          work: _.isEmpty(item.workTels) ? '--' :
            this.formatPhoneNumber(item.workTels[0].contactValue),
          home: _.isEmpty(item.homeTels) ? '--' :
            this.formatPhoneNumber(item.homeTels[0].contactValue),
          personType: item.custRela || '--',
        }));
      } else if (!_.isEmpty(perCustomerContactInfo)) {
        const allTelInfo = _.pick(perCustomerContactInfo, ['cellPhones', 'workTels', 'homeTels', 'otherTels']);
        isPersonHasContact = !_.isEmpty(_.omitBy(allTelInfo, _.isEmpty));
        if (isPersonHasContact) {
          const cellPhones = allTelInfo.cellPhones || EMPTY_LIST;
          let mainTelInfo = {
            type: 'none',
            value: '',
          };
          if (_.find(cellPhones, item => item.mainFlag)) {
            // 存在主要电话
            mainTelInfo = {
              type: 'cellPhones',
              value: this.formatPhoneNumber(cellPhones && cellPhones[0].contactValue),
            };
          }

          // 过滤个人其他联系方式为空的情况
          let otherTelInfo = _.omitBy(_.omit(allTelInfo, ['cellPhones']), _.isEmpty);

          const otherCellInfo = _.filter(cellPhones, item => !item.mainFlag) || EMPTY_LIST;
          if (!_.isEmpty(otherCellInfo)) {
            // 手机号不止一个
            otherTelInfo = _.merge({
              cellPhones: otherCellInfo,
            }, otherTelInfo);
          }

          // 筛选contactValue存在的其他电话
          personalContactInfo = {
            mainTelInfo,
            otherTelInfo,
          };
        }
      }
    }

    const columns = this.constructTableColumns();
    const newDataSource = this.constructTableDatas(otherContactInfo);
    return (
      <Modal
        wrapClassName={styles.contactModal}
        visible={visible}
        title={'联系客户'}
        maskClosable={false}
        width={892}
        onCancel={this.handleCancel}
        closable={false}
        footer={[
          (<Button key="close" size="large" onClick={this.handleCancel}>关闭</Button>),
        ]}
      >
        <div className={styles.custName}>
          {custName || ''}
        </div>
        {
          custType === 'org' && !_.isEmpty(mainContactInfo.nameInfo) ?
            <div className={styles.title}>
              主要联系人：{mainContactInfo.nameInfo.name || '--'}（{mainContactInfo.nameInfo.custRela || '--'}）
            </div>
            : null
        }
        {
          (custType === 'per' && isPersonHasContact
          && personalContactInfo.mainTelInfo.type !== 'none') ?
            <div className={styles.title}>
              主要联系电话（{CONTACT_MAP[personalContactInfo.mainTelInfo.type]}）：
            </div> : null
        }
        {
          (!isPersonHasContact && !isOrgMainContactHasTel) ?
            <div className={styles.noneInfoSection}>
              <div className={styles.noneInfo}>
                  客户未预留主要联系方式，请尽快完善信息
              </div>
              <div className={styles.rightSection}>
                <Button onClick={this.handleServiceRecordClick}>
                  <Icon type="jia" className={styles.addIcon} />
                  <span>添加服务记录</span>
                </Button>
              </div>
            </div> :
            <div className={styles.number}>
              {
                ((isOrgMainContactHasTel && !_.isEmpty(mainContactInfo.cellInfo)) ||
                (isPersonHasContact && personalContactInfo.mainTelInfo.type !== 'none')) ?
                  <div className={styles.mainContact}>
                    <Icon type="dianhua1" className={styles.phoneIcon} />
                    <span>
                      {
                      custType === 'per' ?
                      personalContactInfo.mainTelInfo.value :
                      mainContactInfo.cellInfo
                      }
                    </span>
                  </div> : null
              }
              <div className={styles.rightSection}>
                <Button onClick={this.handleServiceRecordClick}>
                  <Icon type="jia" className={styles.addIcon} />
                  <span>添加服务记录</span>
                </Button>
              </div>
            </div>
        }
        {
          /* 个人其他联系方式和主联系人其他联系方式 */
          custType === 'per' ? this.constructOtherContact(personalContactInfo.otherTelInfo)
          : this.constructOtherContact(mainContactInfo.telInfo)
        }
        { /* 机构客户其他联系人与联系方式 */}
        {
          (custType === 'org' && !_.isEmpty(newDataSource)) ?
            <div className={styles.orgCustOtherTelsSection}>
              <Table
                className={styles.telTable}
                columns={columns}
                dataSource={newDataSource}
                pagination={false}
                // 默认文案配置
                locale={{
                  // 空数据时的文案
                  emptyText: '暂无数据',
                }}
              />
            </div> : null
        }
        { /* 提示信息 */}
        <div className={styles.tipSection}>
          <Icon className={styles.tipIcon} type="wenxintishi" />
          <span>温馨提醒：联系过客户后请及时创建服务记录</span>
        </div>
        <div className={styles.serviceTitle}>最近服务记录</div>
        {/* 折叠面板 */}
        <Collapse
          data={serviceRecordData}
          executeTypes={executeTypes}
          serveWay={serveWay}
          handleCollapseClick={this.handleCollapseClick}
          getCeFileList={getCeFileList}
          filesList={filesList}
        />
      </Modal>
    );
  }
}
