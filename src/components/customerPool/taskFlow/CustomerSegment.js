/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-10 13:43:41
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-20 18:58:40
 * 客户细分组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';
import Table from '../../common/commonTable';
import Uploader from '../../common/uploader';
import { request } from '../../../config';
import Button from '../../common/Button';
import GroupModal from '../groupManage/CustomerGroupUpdateModal';
import logable from '../../../decorators/logable';
import styles from './customerSegment.less';

import { fsp } from '../../../helper';

import selfBuiltTemplate from './selfBuiltTemplate.xls';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const COLUMN_WIDTH = 115;
const INITIAL_PAGE_SIZE = 10;
const INITIAL_PAGE_NUM = 1;
const COLUMN_HEIGHT = 36;

const acceptFile = '.xls,.xlsx';
export default class CustomerSegment extends PureComponent {
  static propTypes = {
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    // 保存的数据
    storedData: PropTypes.object,
    // 设置下一步按钮可点击状态
    setNextStepBtnDisabled: PropTypes.func.isRequired,
    nextStepBtnIsDisabled: PropTypes.bool.isRequired,
    // 是否显示导入客户组件
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onPreview: _.noop,
    storedData: EMPTY_OBJECT,
  };

  constructor(props) {
    super(props);
    const { storedData = EMPTY_OBJECT } = props;
    const { custSegment = EMPTY_OBJECT } = storedData;
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custTotal = 0 } = custSegment;
    this.state = {
      curPageNum: 1,
      curPageSize: 10,
      dataSource: EMPTY_LIST,
      totalRecordNum: 10,
      isShowTable: false,
      currentFile,
      uploadedFileKey,
      originFileName,
      custTotal,
    };
  }

  componentDidMount() {
    // 在初始化的时候，回滚fsp滚动条到顶部
    fsp.scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    const {
      priviewCustFileData: nextData = EMPTY_LIST,
      setNextStepBtnDisabled,
      nextStepBtnIsDisabled,
      visible,
     } = nextProps;
    const { custInfos: nextInfos = EMPTY_LIST, page: nextPage = EMPTY_OBJECT } = nextData;
    const { totalCount: nextTotalCount, pageNum, pageSize } = nextPage;

    // 展示预览数据
    const columns = _.head(nextInfos);
    const { uploadedFileKey } = this.state;
    this.setState({
      totalRecordNum: nextTotalCount,
      curPageNum: pageNum,
      curPageSize: pageSize,
      titleColumn: this.renderColumnTitle(columns),
      dataSource: this.renderDataSource(columns, _.drop(nextInfos)),
      columnSize: _.size(columns),
    });
    // 从瞄准镜圈人切换到导入客户时
    if (visible) {
      // 如果当前上传文件不为空，并且“下一步”按钮状态是不可点击状态，将按钮状态修改为可点击
      if (!_.isEmpty(uploadedFileKey) && nextStepBtnIsDisabled) {
        setNextStepBtnDisabled(false);
      }
      // 如果当前上传文件为空，并且“下一步”按钮状态是可点击状态，将按钮状态修改为不可点击
      if (_.isEmpty(uploadedFileKey) && !nextStepBtnIsDisabled) {
        setNextStepBtnDisabled(true);
      }
    }
  }


  @autobind
  getData() {
    const { currentFile, uploadedFileKey, originFileName, custTotal } = this.state;
    return {
      custSegment: {
        currentFile,
        uploadedFileKey,
        originFileName,
        custTotal,
        custSource: '导入客户',
      },
    };
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { uploadedFileKey } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    // 预览数据
    onPreview({
      filename: uploadedFileKey,
      pageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    const { uploadedFileKey } = this.state;
    const { onPreview } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    // 预览数据
    onPreview({
      filename: uploadedFileKey,
      pageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, (item, index) => _.merge(item, { id: index }));
    }

    return [];
  }

  @autobind
  handleDeleteFile() {
    const { setNextStepBtnDisabled } = this.props;
    this.setState({
      isShowTable: false,
      uploadedFileKey: '',
    }, () => {
      setNextStepBtnDisabled(true);
    });
  }

  /**
   * @param {*} result 本次上传结果
   */
  @autobind
  handleFileUpload(lastFile) {
    // 当前上传的file
    const { currentFile = {}, uploadedFileKey = '', originFileName = '', custTotal = 0 } = lastFile;
    const { setNextStepBtnDisabled } = this.props;
    this.setState({
      currentFile,
      uploadedFileKey,
      originFileName,
      custTotal,
    }, () => {
      setNextStepBtnDisabled(false);
    });
  }

  @autobind
  handleShowMatchCustTable(uploadedFileKey) {
    console.log(uploadedFileKey);
    if (!uploadedFileKey) {
      message.error('请先上传文件');
      return;
    }
    // 已经上传的file key
    // 用来预览客户列表时，用
    const { onPreview } = this.props;
    const { fileKey } = this.state;
    this.setState({
      uploadedFileKey: uploadedFileKey || fileKey,
    });
    onPreview({
      filename: uploadedFileKey,
      pageNum: INITIAL_PAGE_NUM,
      pageSize: INITIAL_PAGE_SIZE,
    }).then(() => {
      // 数据回来，显示modal
      this.setState({
        isShowTable: true,
      });
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleCloseModal() {
    this.setState({
      isShowTable: false,
    });
  }

  @autobind
  renderDataSource(column, data) {
    const dataSource = _.map(data, (item) => {
      const rowData = {};
      return _.merge(rowData,
        _.fromPairs(_.map(item, (itemData, index) => ([column[index], itemData]))));
    });
    return dataSource;
  }

  @logable({ type: 'Click', payload: { name: '导入模板' } })
  handleDownloadClick() {}

  renderColumnTitle(columns) {
    // 随着导入表格列的变化而变化
    return _.map(columns, item => ({
      key: item,
      value: item,
      render(data, key) {
        return (
          <div className={styles.textOverflowEllipsis}>{data[key]}</div>
        );
      },
    }));
  }

  render() {
    const {
      curPageNum = 1,
      curPageSize = 10,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      isShowTable,
      titleColumn,
      columnSize,
      currentFile,
      uploadedFileKey,
      originFileName,
      custTotal,
    } = this.state;

    const scrollX = (columnSize * COLUMN_WIDTH);

    // if (columnSize < 6) {
    //   const averageWidth = Math.floor(newColumnWidth / columnSize);

    //   newColumnWidth = [];
    // }

    const scrollXProps = columnSize >= 6 ? {
      isFixedColumn: true,
      // 前两列固定，如果太长，后面的就滚动
      fixedColumn: [0, 1],
      // 列的总宽度加上固定列的宽度
      scrollX,
    } : null;


    const scrollY = (INITIAL_PAGE_SIZE * COLUMN_HEIGHT);

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(dataSource);
    return (
      <div className={styles.customerSegmentContainer}>
        <div className={styles.uploadSection}>
          <Uploader
            onOperateFile={this.handleFileUpload}
            onHandleOverview={this.handleShowMatchCustTable}
            attachModel={currentFile}
            fileKey={uploadedFileKey}
            onDeleteFile={this.handleDeleteFile}
            originFileName={originFileName}
            custTotal={custTotal}
            isNeedPreview
            isNeedDelete
            uploadTitle={'上传客户列表'}
            uploadTarget={`${request.prefix}/file/khxfFileUpload`}
            // 只支持EXCEL文件
            accept={acceptFile}
          />
        </div>
        <div className={styles.tipSection}>
          注：支持从客户细分导出的excel格式文件。文件中必须包含”经纪客户号“字段，excel导入格式参见：
          <a
            onClick={this.handleDownloadClick}
            href={selfBuiltTemplate}
          >导入模板</a>。
        </div>
        {
          isShowTable ?
            <GroupModal
              wrapperClass={styles.modalTable}
              visible={isShowTable}
              closable
              title={'客户预览'}
              okText={'提交'}
              okType={'primary'}
              onOkHandler={this.handleCloseModal}
              onCancelHandler={this.handleCloseModal}
              footer={
                <Button
                  type="primary"
                  size="default"
                  onClick={this.handleCloseModal}
                >
                  确定
                </Button>
              }
              modalStyle={{
                maxWidth: 1165,
                minWidth: 700,
              }}
              modalWidth={'auto'}
              modalContent={
                <Table
                  pageData={{
                    curPageNum,
                    curPageSize,
                    totalRecordNum,
                  }}
                  listData={newDataSource}
                  onSizeChange={this.handleShowSizeChange}
                  onPageChange={this.handlePageChange}
                  tableClass={styles.custListTable}
                  titleColumn={titleColumn}
                  // title fixed
                  isFixedTitle
                  // 纵向滚动
                  scrollY={scrollY}
                  {...scrollXProps}
                  columnWidth={COLUMN_WIDTH}
                  bordered
                />
              }
            />
            : null
        }
      </div>
    );
  }
}
