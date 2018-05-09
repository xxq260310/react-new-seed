/**
 * @file components/feedback/Detail.js
 *  问题反馈
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Row, Col, Button, message, Modal, Tabs } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import ProblemHandling from './ProblemHandling';
import Remark from './Remark';
import RemarkList from './RemarkList';
import Problemdetails from './ProblemDetails';
import FeedbackUser from './FeedbackUser';
import UploadFiles from './UploadFiles';
import { emp } from '../../helper';
import { feedbackOptions, request } from '../../config';
import './detail.less';
import logable, { logPV } from '../../decorators/logable';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const GETDETAIL = 'feedback/getFeedbackDetail';
const GETRECORDLIST = 'feedback/getFeedbackRecordList';
const UPDATEQUESTION = 'feedback/updateFeedback';

const issueTypeOptions = feedbackOptions.typeOptions;
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
  fbDetail: state.feedback.fbDetail,
  recordList: state.feedback.recordList,
  updateQuestion: state.feedback.updateQuestion,
});

const getDataFunction = loading => totype => query => ({
  type: totype,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  getFeedbackDetail: getDataFunction(true)(GETDETAIL),
  getFeedbackRecordList: getDataFunction(true)(GETRECORDLIST),
  updateFeedback: getDataFunction(true)(UPDATEQUESTION),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Detail extends PureComponent {
  static propTypes = {
    fbDetail: PropTypes.object.isRequired,
    recordList: PropTypes.object.isRequired,
    updateQuestion: PropTypes.object.isRequired,
    getFeedbackDetail: PropTypes.func.isRequired,
    getFeedbackRecordList: PropTypes.func.isRequired,
    updateFeedback: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    const { fbDetail, recordList } = this.props;
    const { resultData = EMPTY_OBJECT } = fbDetail || EMPTY_OBJECT;
    const { resultData: voResultData } = recordList || EMPTY_OBJECT;
    this.state = {
      dataSource: resultData,
      voDataSource: voResultData,
      visible: false,
      remarkVisible: false,
      title: '',
      messageBtnValue: '处理问题',
      inforTxt: '',
      uploadPops: {},
      colSpans: {
        left: 16,
        right: 8,
      },
      nowStatus: true, // PROCESSING / CLOSED
      currentId: '',
      previewVisible: false,
      newWidth: 520,
      hasImgUrl: false,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    if (currentId) {
      this.setState({
        currentId,
      });
      this.handlegetData(currentId);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillReceiveProps(nextProps) {
    const { fbDetail: nextDetail = EMPTY_OBJECT,
      location: { query: { currentId } },
      recordList: nextVOList = EMPTY_OBJECT } = nextProps;
    const { fbDetail: preDetail = EMPTY_OBJECT,
      location: { query: { currentId: prevCurrentId } },
      recordList: preVOList = EMPTY_OBJECT } = this.props;
    const { resultData: nextResultData = EMPTY_OBJECT } = nextDetail;
    const { resultData: preResultData = EMPTY_OBJECT } = preDetail;

    if (preResultData !== nextResultData || nextVOList !== preVOList) {
      this.setState({
        voDataSource: nextVOList,
        dataSource: nextDetail,
        currentId,
      }, () => {
        const { resultData = EMPTY_OBJECT } = nextDetail || EMPTY_OBJECT;
        const { feedbackFileUrls = EMPTY_LIST, status } = resultData || EMPTY_OBJECT;
        if (feedbackFileUrls && feedbackFileUrls.length >= 1) {
          this.setState({
            hasImgUrl: true,
          }, () => {
            const newImg = new Image();
            newImg.onload = () => {
              const imgHeight = newImg.height;
              const imgWidth = newImg.width;

              this.setState({
                imgHeight,
                imgWidth,
              });
            };

            newImg.src = `${request.prefix}/file/${feedbackFileUrls[0]}`; // this must be done AFTER setting onload
          });
        } else {
          this.setState({
            hasImgUrl: false,
          });
        }
        if (status === 'CLOSED') {
          this.setState({
            nowStatus: false,
            messageBtnValue: '重新打开',
            inforTxt: '重新打开表示此问题没有解决，需要继续关注。',
          });
        } else if (status === 'PROCESSING') {
          this.setState({
            nowStatus: true,
            messageBtnValue: '处理问题',
            inforTxt: '处理问题表示对此问题做出判断处理。',
          });
        }
      });
    }

    /* currentId变化重新请求 */
    if (currentId && (currentId !== prevCurrentId)) {
      this.handlegetData(currentId);
      this.setState({
        currentId,
      });
    }
  }

  componentDidUpdate() {
    const { location: { query } } = this.props;
    const { currentId } = query;
    const { currentId: id } = this.state;

    // 只有当前state里面有currentId
    // 并且当前query里面有currentId
    // 才发起初始化请求
    if (!id && currentId) {
      this.handlegetData(currentId);
    }
    this.setState({ //eslint-disable-line
      currentId,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  /**
   * 设置弹出框图片的宽度和高度
   * @param {*} newHeight 新的高度
   * @param {*} newWidth 新的宽度
   */
  setDOMStyle(newHeight, newWidth) {
    /* eslint-disable */
    const modalElem = ReactDOM.findDOMNode(document.querySelector('.imgModal'));
    const childrenElem = modalElem.children[0];
    // let marginTop = 0;
    /* eslint-enable */
    modalElem.style.height = `${newHeight}px`;
    modalElem.style.width = `${newWidth}px`;
    modalElem.style.margin = 'auto';
    modalElem.style.overflow = 'hidden';
    childrenElem.style.top = '50%';
    childrenElem.style.marginTop = `-${newHeight / 2}px`;
    childrenElem.style.paddingBottom = '0px';
  }

  /**
 * 计算图片在页面需要展示的宽度，并设置弹框样式
 */
  calculateRealSize() {
    const containerHeight = document.documentElement.clientHeight - (50 * 2);
    const containerWidth = document.documentElement.clientWidth - (100 * 2);
    const { imgHeight, imgWidth } = this.state;
    let w = imgWidth;
    let h = imgHeight;
    const hRatio = containerHeight / h;
    const wRatio = containerWidth / w;
    let Ratio = 1;
    if (containerWidth === 0 && containerHeight === 0) {
      Ratio = 1;
    } else if (containerWidth === 0) {
      if (hRatio < 1) { Ratio = hRatio; }
    } else if (containerHeight === 0) {
      if (wRatio < 1) { Ratio = wRatio; }
    } else if (wRatio < 1 || hRatio < 1) {
      Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
      w *= Ratio;
      h *= Ratio;
    }

    this.setState({
      newHeight: h,
      newWidth: w,
    }, () => {
      if (!this.state.previewVisible) {
        this.setState({
          previewVisible: true,
        }, () => {
          this.setDOMStyle(h, w);
        });
      } else {
        this.setDOMStyle(h, w);
      }
    });
  }

  @autobind
  handleResize() {
    const { previewVisible } = this.state;
    if (previewVisible) {
      this.calculateRealSize();
    }
  }

  /**
   * 数据加载
   */
  handlegetData = (cid) => {
    const { getFeedbackDetail, getFeedbackRecordList } = this.props;
    getFeedbackRecordList({
      feedbackId: cid,
    });
    getFeedbackDetail({
      id: cid,
    });
  }

  /**
   * 弹窗处理（开启）
  */
  @logPV({ pathname: '/modal/handlerproblem', title: '问题反馈-解决弹窗' })
  showModal = () => {
    this.setState({ visible: true });
  }
  /**
   * 弹窗处理（关闭）
  */
  @logable({ type: 'Click', payload: { name: '关闭问题反馈-解决弹窗' } })
  handleCancel = () => {
    this.setState({ visible: false });
  }
  /**
   * 备注显示
  */
  @logable({ type: 'ButtonClick', payload: { name: '备注' } })
  showRemark = () => {
    this.setState({ remarkVisible: true });
  }
  /**
   * 备注隐藏
  */
  remarkCancel = () => {
    this.setState({ remarkVisible: false });
  }
  /**
   * 问题处理提交
  */
  @autobind
  handleCreate(f) {
    const form = f;
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    form.validateFields((err, values) => {
      if (err) {
        message.error(err);
        return;
      }
      let detail = values;
      const removeEmpty = (obj) => {
        const objs = obj;
        Object.keys(objs).forEach(key => (_.isEmpty(objs[key]) || objs[key] === '无' || objs[key] === 'undefined') && delete objs[key]);
        return objs;
      };
      detail = removeEmpty(detail);
      if (detail.uploadedFiles && detail.uploadedFiles.fileList) {
        const files = detail.uploadedFiles.fileList.map(item =>
          item.response.resultData || {},
        );
        detail.uploadedFiles = removeEmpty(files) || [];
      }
      updateFeedback({
        request: {
          ...detail,
          id: currentId,
          feedbackId: currentId,
          processerEmpId: emp.getId(),
        },
        currentQuery: query,
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  // 图片上传直接提交
  @autobind
  fileUploadData(file, type) {
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    let fileStatus = {};
    if (type === 'ADD') {
      fileStatus = {
        uploadedFiles: [file],
      };
    } else if (type === 'DELETE') {
      fileStatus = {
        deletedFiles: [file],
      };
    }
    updateFeedback({
      request: {
        ...fileStatus,
        id: currentId,
        processerEmpId: emp.getId(),
      },
      currentQuery: query,
    });
  }
  // 删除附件
  @autobind
  handleRemoveFile(item) {
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    updateFeedback({
      request: {
        deletedFiles: [item],
        id: currentId,
        processerEmpId: emp.getId(),
        feedbackId: currentId,
      },
      currentQuery: query,
    });
  }

  /**
   * 备注提交
  */
  saveFromRemark = () => {
    const form = this.remarkForm;
    const { location: { query }, updateFeedback } = this.props;
    const { currentId } = query;
    form.validateFields((err, values) => {
      if (values.remarkContent) {
        if (values.remarkContent.length < 1000) {
          if (!err) {
            updateFeedback({
              request: {
                remark: values.remarkContent,
                id: currentId,
                processerEmpId: emp.getId(),
              },
              currentQuery: query,
            });
          } else {
            message.error(err);
            return;
          }
        } else {
          message.error('最大字数限制为1000');
          return;
        }
      } else {
        message.error('您还未填写备注信息');
        return;
      }
      form.resetFields();
      this.setState({ remarkVisible: false });
    });
  }
  /**
   * 存储处理问题form
  */
  saveFormRef = (form) => {
    this.handlingForm = form;
  }
  /**
   * 存储备注form
  */
  saveRemarkFormRef = (form) => {
    this.remarkForm = form;
  }
  /**
   * 缩略图预览
   */
  @autobind
  @logPV({ pathname: '/modal/imgPreview', title: '缩略图预览' })
  handlePreview() {
    this.calculateRealSize();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '' } })
  handlePreviewCancel() {
    this.setState({
      previewVisible: false,
    });
  }

  // sortProcessList(arr) {
  //   if (arr.length <= 1) {
  //     return arr;
  //   }
  //   const pivotIndex = Math.floor(arr.length / 2);
  //   const pivotObject = arr.splice(pivotIndex, 1)[0];
  //   const pivot = pivotObject.createTime;
  //   const left = [];
  //   const right = [];
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i].createTime < pivot) {
  //       left.push(arr[i]);
  //     } else {
  //       right.push(arr[i]);
  //     }
  //   }
  //   return this.sortProcessList(left).concat([pivotObject], this.sortProcessList(right));
  // }

  @autobind
  handleDesciption(txt) {
    const dataTxt = _.isEmpty(txt) ? '' : txt;
    const dataTrim = dataTxt.replace(/(^\s*)|(\s*$)/g, '');
    if (dataTrim.length < 1) {
      return (
        <div className="nodescription">
          <i className="anticon anticon-frown-o" />暂无描述
        </div>);
    }
    return dataTxt;
  }

  render() {
    const {
      dataSource,
      voDataSource,
      hasImgUrl,
      nowStatus,
      messageBtnValue,
      inforTxt,
      previewVisible,
      newWidth,
    } = this.state;
    const { resultData = EMPTY_OBJECT } = dataSource || EMPTY_OBJECT;
    const { resultData: voList = EMPTY_OBJECT } = voDataSource || EMPTY_OBJECT;
    const { remarkList = EMPTY_LIST,
      processList = EMPTY_LIST,
      suggestList = EMPTY_LIST,
     } = voList; // 处理记录
    const processRecordList = _.concat(remarkList, suggestList);
    const handleRecordList = _.concat(remarkList, suggestList, processList);
    const {
      attachModelList,
      functionName,
      feedEmpInfo,
      description,
      createTime,
      feedbackFileUrls,
      processer,
      issueType,
      version,
      feedId,
      status,
      jiraId,
      appId,
      tag,
      id,
    } = resultData || EMPTY_OBJECT; // 反馈用户
    let feedbackDetail = {
      functionName,
      createTime,
      processer,
      version,
      status,
      jiraId,
      tag,
      id,
    };
    if (!feedbackDetail) {
      feedbackDetail = EMPTY_OBJECT;
    }
    let imgUrl = feedbackFileUrls;
    if (!imgUrl) {
      imgUrl = EMPTY_LIST;
    }
    const remarkbtn = classnames({
      bzBtn: true,
      btnhidden: this.state.remarkVisible,
    });
    const type = _.find(issueTypeOptions, item => item.value === issueType);

    return (
      <div className="detail_box">
        <div className="inner">
          <h1 className="bugtitle">【{type && type.label}】{appId}/{feedId}</h1>
          <div className="row_box">
            {hasImgUrl ?
              <Row gutter={18}>
                <Col span="18">
                  <div id="detail_module" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">问题详情</h2>
                    </div>
                    <div className="mod_content">
                      <Problemdetails
                        problemDetails={feedbackDetail}
                        onCancel={this.remarkCancel}
                        onCreate={this.handleCreate}
                        nowStatus={nowStatus}
                      />
                    </div>
                  </div>
                </Col>
                <Col span="6">
                  <div className="imgbox" onClick={this.handlePreview}>
                    <img src={`${request.prefix}/file/${imgUrl[0]}`} alt="图片" />
                  </div>
                  <Modal
                    visible={previewVisible}
                    width={newWidth}
                    footer={null}
                    onCancel={this.handlePreviewCancel}
                    wrapClassName="imgModal"
                  >
                    <img alt="图片" style={{ width: '100%' }} src={`${request.prefix}/file/${imgUrl[0]}`} />
                  </Modal>
                </Col>
              </Row> :
              <Row>
                <Col span="24">
                  <div id="detail_module" className="module">
                    <div className="mod_header">
                      <h2 className="toogle_title">问题详情</h2>
                    </div>
                    <div className="mod_content">
                      <Problemdetails
                        problemDetails={resultData}
                        onCancel={this.remarkCancel}
                        onCreate={this.handleCreate}
                        nowStatus={nowStatus}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            }
          </div>
          <div id="descriptionmodule" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">描述</h2>
            </div>
            <div className="mod_content">
              <div className="des_txt">
                {this.handleDesciption(description)}
              </div>
              <div className="btn_dv">
                <Button type="primary" onClick={this.showModal}>{messageBtnValue}</Button>
              </div>
            </div>
          </div>
          <div id="peoplemodule" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">反馈用户</h2>
            </div>
            <div className="mod_content">
              <FeedbackUser
                fbuser={feedEmpInfo}
              />
            </div>
          </div>
          <div id="annex" className="module">
            <div className="mod_header">
              <h2 className="toogle_title">附件</h2>
            </div>
            <div className="mod_content">
              <UploadFiles
                onCreate={this.fileUploadData}
                attachModelList={attachModelList}
                removeFile={this.handleRemoveFile}
              />
            </div>
          </div>
          <div id="processing" className="module">
            <Tabs type="card">
              <TabPane tab="处理意见" key="1">
                <RemarkList
                  remarkList={processRecordList}
                />
                <div className="mod_content">
                  <div className="remarks_box">
                    <Button icon="edit" className={remarkbtn} onClick={this.showRemark}>备注</Button>
                    <Remark
                      visible={this.state.remarkVisible}
                      ref={this.saveRemarkFormRef}
                      onCancel={this.remarkCancel}
                      onCreate={this.saveFromRemark}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="操作记录" key="2">
                <RemarkList
                  remarkList={handleRecordList}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <ProblemHandling
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          problemDetails={feedbackDetail}
          title={messageBtnValue}
          inforTxt={inforTxt}
        />
      </div>
    );
  }
}

