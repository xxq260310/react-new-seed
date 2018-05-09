/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-23 15:47:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-11 23:32:10
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, DatePicker, TimePicker, Input, Radio, Form } from 'antd';
import moment from 'moment';
// import classnames from 'classnames';
import StaticRecordContent from './StaticRecordContent_';
import Uploader from '../../common/uploader';
import { request } from '../../../config';
import { emp, getIconType } from '../../../helper';
import Icon from '../../common/Icon';
import styles from './index.less';
import logable from '../../../decorators/logable';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

// 日期组件的格式
const dateFormat = 'YYYY/MM/DD';
// 界面上显示的日期格式
const showDateFormat = 'YYYY年MM月DD日';

const timeFormat = 'HH:mm';
// 当天时间
const CURRENT_DATE = moment(new Date(), dateFormat);
const width = { width: 142 };

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const NO_HREF = 'javascript:void(0);'; // eslint-disable-line

/**
 * 服务状态转化map
 * 字典中服务状态有4中，分别是：
 * {key: "10", value: "未开始"}
 * {key: "20", value: "处理中"}
 * {key: "30", value: "完成"}
 * {key: "40", value: "结果达标"}
 * 页面中展示'处理中'和'完成'
 * 任务状态 未开始 ，页面展示处理中，传给后端的key为 '20'
 * 任务状态 结果达标 ，页面展示完成，传给后端的key为 '30'
 */
const serviceStateMap = {
  10: '20',
  20: '20',
  30: '30',
  40: '30',
};

// 其它类型的客户反馈，容错处理，在某些情况下，后端返回的feedbackList为空，没法展示服务记录界面
// 需要前端容错一下
const otherFeedback2Key = '99999';
const otherFeedback3Key = '100000';
const otherFeedbackValue = '其它';

// 一级其它反馈
const otherFeedback2List = [{ key: otherFeedback2Key, value: otherFeedbackValue }];
// 二级其它反馈
const otherFeedback3List = [{ key: otherFeedback3Key, value: otherFeedbackValue }];

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// {key:1, children: [{key: 11}]} 转成 {1: [{key: 11}]}
function generateObjOfKey(list) {
  const subObj = {};
  if (_.isEmpty(list)) {
    return subObj;
  }
  list.forEach((obj) => {
    if (obj.children && !_.isEmpty(obj.children)) {
      subObj[obj.key] = obj.children;
    } else {
      subObj[obj.key] = EMPTY_LIST;
    }
  });
  return subObj;
}

export default class ServiceRecordContent extends PureComponent {
  static propTypes = {
    dict: PropTypes.object,
    // 是否是执行者视图页面
    isEntranceFromPerformerView: PropTypes.bool,
    // 表单数据
    formData: PropTypes.object,
    isFold: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    beforeUpload: PropTypes.func,
    custUuid: PropTypes.string,
    onDeleteFile: PropTypes.func.isRequired,
    deleteFileResult: PropTypes.array.isRequired,
  }

  static defaultProps = {
    dict: {},
    formData: {},
    isEntranceFromPerformerView: false,
    isFold: false,
    isReadOnly: false,
    beforeUpload: () => { },
    isUploadFileManually: true,
    custUuid: '',
  }

  constructor(props) {
    super(props);
    const formData = this.handleInitOrUpdate(props);
    this.state = {
      ...formData,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
      originFormData: formData,
      isShowServeStatusError: false,
      isShowServiceContentError: false,
    };
    // 代表是否是删除操作
    this.isDeletingFile = false;
  }

  componentWillReceiveProps(nextProps) {
    const { formData, custUuid = '' } = this.props;
    const { formData: nextData, custUuid: nextCustUuid = '', isReadOnly } = nextProps;
    // 在删除文件的时候，不设置originFormData，不然会恢复原始数据
    if (formData !== nextData && !this.isDeletingFile) {
      const formObject = this.handleInitOrUpdate(nextProps);
      this.setState({
        ...this.state,
        ...formObject,
        originFormData: formObject,
      });
    }

    // 切换客户，错误信息重置
    if (custUuid !== nextCustUuid) {
      this.setState({
        isShowServeStatusError: false,
        isShowServiceContentError: false,
      });
      // 当custUuid不一样的时候，并且是新增服务记录时，清除刚才上传的附件记录
      if (!isReadOnly) {
        this.clearUploadedFileList();
      }
    }
  }

  // 向组件外部提供所有数据
  @autobind
  getData() {
    const { serviceStatus, serviceContent } = this.state;
    const { isEntranceFromPerformerView } = this.props;
    const isShowServiceContentError = !serviceContent || serviceContent.length > 1000;
    let isShowServeStatusError = false;
    // 来自执行者视图，需要校验服务状态
    if (isEntranceFromPerformerView) {
      isShowServeStatusError = !serviceStatus;
      this.setState({
        isShowServeStatusError,
      });
    }

    // 默认都校验服务记录文本
    this.setState({
      isShowServiceContentError,
    });

    if (isShowServiceContentError || isShowServeStatusError) {
      return false;
    }

    return _.pick(this.state,
      // 服务方式
      'serviceWay',
      // 服务类型
      'serviceType',
      // 服务时间
      'serviceDate',
      // 服务时间
      'serviceTime',
      // 反馈时间
      'feedbackDate',
      // 反馈类型
      'feedbackType',
      // 反馈类型
      'feedbackTypeChild',
      // 服务状态
      'serviceStatus',
      // 服务记录
      'serviceContent',
      // 当前上传的附件
      'currentFile',
    );
  }

  // 服务状态change事件
  @autobind
  @logable({ type: 'Click', payload: { name: '服务状态' } })
  handleRadioChange(e) {
    this.setState({
      serviceStatus: e.target.value,
      // 不显示错误信息
      isShowServeStatusError: false,
    });
  }

  @autobind
  handleInitOrUpdate(props) {
    const {
      // 服务方式字典
      serveWay = [{}],
    } = props.dict || {};
    const {
      isEntranceFromPerformerView,
      formData,
      isReadOnly,
      // 服务类型、客户反馈类型三级字典
      // isTaskFeedbackListOfNone如果为true，代表没有找到客户反馈二级反馈字典，则直接写死一个其他类型的feedbackList
      formData: { motCustfeedBackDict, isTaskFeedbackListOfNone },
    } = props;
    const [{ key: serviceTypeCode = '', value: serviceTypeName = '' }] = motCustfeedBackDict;

    // 服务类型value对应服务类型数组
    this.serviceTypeObj = generateObjOfKey(motCustfeedBackDict);
    let formObject = {};

    if (isEntranceFromPerformerView) {
      const {
        feedbackType = '',
        feedbackTypeList = [],
        feedbackTypeChild = '',
        feedbackTypeChildList = [],
      } = this.handleServiceType(serviceTypeCode, false);

      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
      // 当前日期的时间戳
      const currentDate = new Date().getTime();

      // 执行者视图
      if (isReadOnly) {
        // 只读状态
        const {
          // 服务时间（日期）
          serviceDate,
          // 服务时间（时分秒）
          serviceTime,
          // 反馈时间
          feedbackDate,
          // 服务状态
          serviceStatusCode,
          // 服务方式
          serviceWayName: serviceWay,
          // 服务方式code
          serviceWayCode,
          // 服务记录内容
          serviceRecord: serviceContent,
          // 客户反馈
          customerFeedback,
          // 附件记录
          attachmentList,
        } = formData;
        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType: serviceTypeCode,
          serviceTypeName,
          // 客户反馈一级
          feedbackType: '',
          feedbackTypeList: [],
          // 客户反馈二级
          feedbackTypeChild: '',
          feedbackTypeChildList: [],
          // 服务时间（日期）
          serviceDate: _.isEmpty(serviceDate) ?
            moment(currentDate).format(dateFormat) : serviceDate,
          // 服务时间（时分秒）
          serviceTime: _.isEmpty(serviceTime) ?
            moment(currentDate).format(timeFormat) : serviceTime,
          // 反馈时间
          feedbackDate: _.isEmpty(feedbackDate) ?
            moment(currentDate).format(dateFormat) : feedbackDate,
          // 服务状态
          serviceStatus: serviceStateMap[serviceStatusCode],
          // 服务方式
          serviceWay,
          serviceContent,
          serviceWayCode,
          // customerFeedback,
          attachmentList,
        };
        // 如果找不到反馈一二级，则前端默认指定两个其它类型，类型取和后端定义的一样，
        // 不然提交接口报错
        if (isTaskFeedbackListOfNone) {
          formObject.feedbackType = otherFeedback2Key;
          formObject.feedbackTypeList = otherFeedback2List;
          formObject.feedbackTypeChild = otherFeedback3Key;
          formObject.feedbackTypeChildList = otherFeedback3List;
        } else if (!_.isEmpty(customerFeedback)) {
          const {
            code,
            name,
            children: {
              code: subCode,
              name: subName,
            },
          } = customerFeedback;
          formObject.feedbackType = String(code);
          formObject.feedbackTypeList = [{ key: String(code), value: name }];
          formObject.feedbackTypeChild = String(subCode);
          formObject.feedbackTypeChildList = [{ key: String(subCode), value: subName }];
        }
      } else {
        formObject = {
          // 服务类型，页面上隐藏该字段
          serviceType: serviceTypeCode,
          // 客户反馈一级
          feedbackType,
          feedbackTypeList,
          // 客户反馈二级
          feedbackTypeChild,
          feedbackTypeChildList,
          // 服务时间（日期）
          serviceDate: moment(currentDate).format(dateFormat),
          // 服务时间（时分秒）
          serviceTime: moment(currentDate).format(timeFormat),
          // 反馈时间
          feedbackDate: moment(currentDate).format(dateFormat),
          // 服务状态
          // 新需求，不管来的是什么状态，只要能编辑，就没有默认选中的状态，
          serviceStatus: '',
          // 服务方式
          serviceWay: (serveWay[0] || {}).key,
          serviceContent: '',
          // serviceStatusCode,
          // serviceWayCode,
          // customerFeedback,
          // attachmentRecord,
        };
      }
    } else {
      // 客户列表添加服务记录
      // 反馈类型数组
      const feedbackTypeList = (motCustfeedBackDict[0] || {}).children || EMPTY_LIST;
      // 反馈类型value对应反馈类型数组
      this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
      // 反馈子类型数组
      const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || EMPTY_LIST;
      // 当前日期的时间戳
      const currentDate = new Date().getTime();
      const serveType = (motCustfeedBackDict[0] || {}).key || '';
      const feedbackType = (feedbackTypeList[0] || {}).key || '';
      const feedbackTypeChild = (feedbackTypeChildList[0] || {}).key || '';

      formObject = {
        serviceContent: '',
        feedbackType,
        feedbackTypeChild,
        feedbackTypeList,
        feedbackTypeChildList,
        serviceType: serveType,
        serviceWay: (serveWay[0] || {}).key,
        serviceDate: moment(currentDate).format(dateFormat),
        serviceTime: moment(currentDate).format(timeFormat),
        feedbackDate: moment(currentDate).format(dateFormat),
      };
    }

    return formObject;
  }


  @autobind
  resetField() {
    const { originFormData } = this.state;
    // 清除上传文件列表
    this.clearUploadedFileList();

    this.setState({
      ...this.state,
      ...originFormData,
      currentFile: {},
      uploadedFileKey: '',
      originFileName: '',
    });
  }

  @autobind
  clearUploadedFileList() {
    if (this.uploadElem) {
      // 清除上传文件列表
      this.uploadElem.clearUploadFile();
    }
  }

  // 保存选中的服务方式的值
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务方式',
      value: '$args[0]',
    },
  })
  handleServiceWay(value) {
    this.setState({
      serviceWay: value,
    });
  }

  // logable 只能修饰组件的onclick事件，不能被外部调用，若外部需要调用同样方法，需要重写一个
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '服务类型',
      value: '$args[0]',
    },
  })
  handleServiceType(value, shouldSetState = true) {
    if (_.isEmpty(value)) {
      return {};
    }
    const feedbackTypeList = this.serviceTypeObj[value] || EMPTY_LIST;
    const feedbackType = (feedbackTypeList[0] || {}).key || '';
    const feedbackTypeChildList = (feedbackTypeList[0] || {}).children || EMPTY_LIST;
    const feedbackTypeChild = (feedbackTypeChildList[0] || {}).key || '';

    if (shouldSetState) {
      this.setState({
        serviceType: value,
        feedbackType,
        feedbackTypeList,
        feedbackTypeChild,
        feedbackTypeChildList,
      });
    }

    return {
      serviceType: value,
      feedbackType,
      feedbackTypeList,
      feedbackTypeChild,
      feedbackTypeChildList,
    };
  }

  // 保存服务日期的值
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务日期',
      value: (instance, args) => moment(args[0]).format(dateFormat),
    },
  })
  handleServiceDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      serviceDate: moment(selectedDate).format(dateFormat),
    });
  }

  // 保存服务时间时分的值
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '服务时间',
      value: '$args[1]',
    },
  })
  handleServiceTime(time, timeString) {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    this.setState({
      serviceTime: timeString || `${h}:${m}`,
    });
  }

  // 保存反馈时间的值
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '反馈时间',
      value: (instance, args) => moment(args[0]).format(dateFormat),
    },
  })
  handleFeedbackDate(date) {
    const selectedDate = Number(date.format('x'));
    this.setState({
      feedbackDate: moment(selectedDate).format(dateFormat),
    });
  }

  // 保存反馈类型的值
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户反馈',
      value: '$args[0]',
    },
  })
  handleFeedbackType(value) {
    const { feedbackTypeList } = this.state;
    this.feedbackTypeObj = generateObjOfKey(feedbackTypeList);
    const curFeedbackTypeList = this.feedbackTypeObj[value];
    this.setState({
      feedbackType: value,
      feedbackTypeChild: _.isEmpty(curFeedbackTypeList) ? '' : curFeedbackTypeList[0].key,
      feedbackTypeChildList: curFeedbackTypeList,
    });
  }

  // 保存反馈子类型的值
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '客户反馈子类型',
      value: '$args[0]',
    },
  })
  handleFeedbackTypeChild(value) {
    this.setState({
      feedbackTypeChild: value,
    });
  }

  disabledDate(current) {
    if (current) {
      return current.valueOf() > moment().subtract(0, 'days');
    }
    return true;
  }

  @autobind
  disabledHours() {
    const { serviceDate } = this.state;
    const currentTimeStamp = moment(serviceDate).format('x');
    const hours = range(0, 24);
    const d = new Date();
    if (currentTimeStamp < moment(moment().format(dateFormat)).format('x')) {
      return [];
    }
    return hours.slice(d.getHours() + 1);
  }

  @autobind
  disabledMinutes(h) {
    const d = new Date();
    const m = range(0, 60);
    const { serviceDate } = this.state;
    const currentTimeStamp = moment(serviceDate).format('x');
    if (currentTimeStamp < moment(moment().format(dateFormat)).format('x')) {
      return [];
    }
    if (h === d.getHours()) {
      return m.slice(d.getMinutes() + 1);
    } else if (h < d.getHours()) {
      return [];
    }
    return m;
  }

  /**
   * @param {*} result 本次上传结果
   */
  @autobind
  handleFileUpload(file) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custUuid = '', attachment } = file;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
      custUuid,
      attachment,
    });
  }

  /**
   * 处理服务记录文本框输入事件
   * @param {*} e event
   */
  @autobind
  handleServiceRecordInputChange(e) {
    const value = e.target.value;
    this.setState({
      serviceContent: value,
      isShowServiceContentError: _.isEmpty(value) || value.length > 1000,
    });
  }

  @autobind
  handleDeleteFile(params) {
    // 正在删除文件
    this.isDeletingFile = true;
    const { onDeleteFile } = this.props;
    onDeleteFile({ ...params }).then(() => {
      this.isDeletingFile = false;
    });
  }

  // 空方法，用于日志上传
  @logable({ type: 'Click', payload: { name: '附件下载' } })
  handleDownloadClick() { }

  /**
   * 设置服务方式的Ref
   */
  @autobind
  setServiceWrapRef(input) {
    this.serviceWayRef = input;
  }

  /**
   * 设置服务类型的Ref
   */
  @autobind
  setServiceTypeRef(input) {
    this.serviceTypeRef = input;
  }

  /**
   * 设置服务时间的Ref
   */
  @autobind
  setServeTimeRef(input) {
    this.serviceTimeRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的客户反馈的ref
   */
  @autobind
  setCustFeedbackRef(input) {
    this.customerFeedbackRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的客户反馈时间的ref
   */
  @autobind
  setFeedbackTimeRef(input) {
    this.feedbackTimeRef = input;
  }

  /**
   * 设置非涨乐财富通服务方式下的文件上传的Ref
   */
  @autobind
  setUploaderRef(input) {
    this.uploadElem = input;
  }

  @autobind
  renderServiceStatusChoice() {
    const {
      dict: {
        serveStatus = [],
      },
    } = this.props;
    return _.map(serveStatus, item =>
      // 20代表处理中 30代表完成
      (item.key === '20' || item.key === '30')
      && <Radio key={item.key} value={item.key}>{item.value}</Radio>,
    );
  }

  /**
   * 只读的状态下，渲染附件信息
   */
  @autobind
  renderFileList() {
    const { attachmentList } = this.state;
    if (_.isEmpty(attachmentList)) {
      return null;
    }
    return (
      <div className={styles.uploadList}>
        {
          attachmentList.map(item => (
            <div key={item.attachId}>
              <span>附件:</span>
              <Icon className={styles.excelIcon} type={getIconType(item.name)} />
              <span>
                <a
                  onClick={this.handleDownloadClick}
                  href={
                    _.isEmpty(item.attachId) && _.isEmpty(item.name)
                      ? NO_HREF :
                      `${request.prefix}/file/ceFileDownload?attachId=${item.attachId}&empId=${emp.getId()}&filename=${item.name}`}
                >
                  {item.name}
                </a>
              </span>
            </div>
          ))
        }
      </div>
    );
  }

  /**
   * 渲染服务方式 | 的下拉选项,
   */
  @autobind
  renderServiceSelectOptions(list = []) {
    return list.map(obj => (<Option key={obj.key} value={obj.key}>{obj.value}</Option>));
  }

  render() {
    const {
      dict,
      isEntranceFromPerformerView,
      // isFold,
      isReadOnly,
      beforeUpload,
      custUuid,
      deleteFileResult,
      formData: { motCustfeedBackDict },
      dict: {
        serveStatus = [],
      },
    } = this.props;
    const {
      serviceWay,
      serviceStatus,
      serviceType,
      serviceTime,
      serviceDate,
      feedbackDate,
      feedbackType,
      feedbackTypeChild,
      feedbackTypeList,
      feedbackTypeChildList,
      currentFile,
      uploadedFileKey,
      originFileName,
      serviceContent,
      isShowServeStatusError,
      isShowServiceContentError,
      // attachmentRecord,
    } = this.state;
    if (!dict) {
      return null;
    }

    if (isReadOnly) {
      // 服务状态文本
      const serviceStatusText = (_.find(serveStatus, item =>
        item.key === serviceStatus) || EMPTY_OBJECT).value;

      // 客户反馈一级value
      const feedbackTypeL1Text = (_.find(feedbackTypeList, item =>
        item.key === feedbackType) || EMPTY_OBJECT).value;

      // 客户反馈二级value
      const feedbackTypeL2Text = (_.find(feedbackTypeChildList, item =>
        item.key === feedbackTypeChild) || EMPTY_OBJECT).value;

      // 反馈时间,格式化
      const feedbackDateTime = moment(feedbackDate, showDateFormat).format(showDateFormat);

      // 服务时间，格式化
      const serviceDateTime = moment(serviceDate, showDateFormat).format(showDateFormat);

      return (
        <StaticRecordContent
          data={{
            serviceContent,
            serviceWay,
            serviceStatusText,
            feedbackTypeL1Text,
            feedbackTypeL2Text,
            feedbackDateTime,
            serviceDateTime,
            renderFileList: this.renderFileList,
          }}
        />
      );
    }

    const serviceDateProps = {
      allowClear: false,
      value: moment(serviceDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleServiceDate,
      disabledDate: this.disabledDate,
    };

    const serviceTimeProps = {
      placeholder: '选择时间',
      value: moment(serviceTime, timeFormat),
      onChange: this.handleServiceTime,
      format: timeFormat,
      disabledHours: this.disabledHours,
      disabledMinutes: this.disabledMinutes,
    };

    const feedbackTimeProps = {
      allowClear: false,
      value: moment(feedbackDate, showDateFormat),
      format: showDateFormat,
      onChange: this.handleFeedbackDate,
      disabledDate: this.disabledDate,
    };

    const serviceStatusErrorProps = isShowServeStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '请选择服务状态',
    } : null;

    const serviceContentErrorProps = isShowServiceContentError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: '服务内容不能为空，最多输入1000汉字',
    } : null;

    // const serveType = classnames({
    //   [styles.serveType]: true,
    //   [styles.hidden]: isEntranceFromPerformerView,
    // });
    // feedbackTypeChildList为空或者客户反馈一级和二级的选项文字相同时不显示二级反馈选项
    let isShowSubCustomerFeedback = false;
    if (!_.isEmpty(feedbackTypeChildList)) {
      const currentCustomerFeedback = _.find(feedbackTypeList, { key: feedbackType });
      const currentSubCustomerFeedback = _.find(feedbackTypeChildList, { key: feedbackTypeChild });
      isShowSubCustomerFeedback =
        currentCustomerFeedback.value === currentSubCustomerFeedback.value;
    }

    return (
      <div className={styles.serviceRecordContent}>
        <div className={styles.gridWrapper}>
          <div className={styles.serveWay}>
            <div className={styles.title}>服务方式:</div>
            <div className={styles.content} ref={this.setServiceWrapRef} >
              <Select
                value={serviceWay}
                style={width}
                onChange={this.handleServiceWay}
                getPopupContainer={() => this.serviceWayRef}
              >
                { this.renderServiceSelectOptions(dict.serveWay) }
              </Select>
            </div>
          </div>

          {/* 执行者试图下显示 服务状态；非执行者视图下显示服务类型 */}
          {
            isEntranceFromPerformerView ?
              (<div className={styles.serveStatus}>
                <div className={styles.title}>服务状态:</div>
                <FormItem {...serviceStatusErrorProps}>
                  <div className={styles.content}>
                    <RadioGroup onChange={this.handleRadioChange} value={serviceStatus}>
                      {this.renderServiceStatusChoice()}
                    </RadioGroup>
                  </div>
                </FormItem>
              </div>)
              :
              (
                <div className={styles.serveType}>
                  <div className={styles.title}>服务类型:</div>
                  <div className={styles.content} ref={this.setServiceTypeRef}>
                    <Select
                      value={serviceType}
                      style={width}
                      onChange={this.handleServiceType}
                      getPopupContainer={() => this.serviceTypeRef}
                    >
                      { this.renderServiceSelectOptions(motCustfeedBackDict) }
                    </Select>
                  </div>
                </div>
              )
          }

          <div className={styles.serveTime}>
            <div className={styles.title}>服务时间:</div>
            <div className={styles.content} ref={this.setServeTimeRef}>
              <DatePicker
                style={width}
                {...serviceDateProps}
                defaultValue={moment(CURRENT_DATE, showDateFormat)}
                getCalendarContainer={() => this.serviceTimeRef}
              />
              <TimePicker
                style={width}
                className={styles.hidden}
                {...serviceTimeProps}
                defaultValue={moment(CURRENT_DATE, timeFormat)}
              />
            </div>
          </div>
        </div>

        <div className={styles.serveRecord}>
          <div className={styles.title}>服务记录:</div>
          <FormItem {...serviceContentErrorProps}>
            <div className={styles.content}>
              <TextArea
                rows={5}
                value={serviceContent}
                onChange={this.handleServiceRecordInputChange}
              />
            </div>
          </FormItem>
        </div>

        <div className={styles.divider} />

        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>客户反馈:</div>
            <div className={styles.content} ref={this.setCustFeedbackRef}>
              <Select
                value={feedbackType}
                style={width}
                onChange={this.handleFeedbackType}
                getPopupContainer={() => this.customerFeedbackRef}
              >
                { this.renderServiceSelectOptions(feedbackTypeList) }
              </Select>
              {
                isShowSubCustomerFeedback ? null :
                  (<Select
                    value={feedbackTypeChild}
                    style={width}
                    onChange={this.handleFeedbackTypeChild}
                    getPopupContainer={() => this.customerFeedbackRef}
                  >
                    { this.renderServiceSelectOptions(feedbackTypeChildList) }
                  </Select>)
              }
            </div>
          </div>
          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.content} ref={this.setFeedbackTimeRef}>
              <DatePicker
                style={width}
                {...feedbackTimeProps}
                defaultValue={moment(CURRENT_DATE, showDateFormat)}
                getCalendarContainer={() => this.feedbackTimeRef}
              />
            </div>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <Uploader
            ref={this.setUploaderRef}
            onOperateFile={this.handleFileUpload}
            attachModel={currentFile}
            fileKey={uploadedFileKey}
            originFileName={originFileName}
            uploadTitle={'上传附件'}
            upData={{
              empId: emp.getId(),
              // 第一次上传没有，如果曾经返回过，则必须传
              attachment: '',
            }}
            beforeUpload={beforeUpload}
            custUuid={custUuid}
            uploadTarget={`${request.prefix}/file/ceFileUpload`}
            isSupportUploadMultiple
            onDeleteFile={this.handleDeleteFile}
            deleteFileResult={deleteFileResult}
          />
        </div>
      </div>
    );
  }
}
