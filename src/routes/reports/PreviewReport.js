/**
 * @description 定制看板预览页面
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import ReportHome from './Home';
import { dom } from '../../helper';
import { PublishConfirmModal } from '../../components/modals';
import withRouter from '../../decorators/withRouter';
import styles from './PreviewReport.less';
import logable from '../../decorators/logable';

// 首先判断wrap存在与否
const contentWrapper = document.getElementById('workspace-content');

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  boardInfo: state.preview.boardInfo,
  publishLoading: state.edit.publishLoading,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  goBack: routerRedux.goBack,
  publishBoard: fectchDataFunction(true, 'edit/publishBoard'),
  getBoardInfo: fectchDataFunction(true, 'preview/getBoardInfo'),
  delBoardInfo: fectchDataFunction(true, 'preview/delBoardInfo'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PreviewReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    boardInfo: PropTypes.object.isRequired,
    publishBoard: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    getBoardInfo: PropTypes.func.isRequired,
    delBoardInfo: PropTypes.func.isRequired,
    publishLoading: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    // 新的页面需要
    this.state = {
      publishConfirmModal: false,
      boardInfo: {},
    };
  }

  componentWillMount() {
    const { location: { query: { boardId, orgId } } } = this.props;
    const { getBoardInfo } = this.props;
    getBoardInfo({
      boardId,
      orgId,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { boardInfo: preboard } = this.props;
    const { boardInfo } = nextProps;
    if (!_.isEqual(preboard, boardInfo)) {
      this.setState({
        boardInfo,
      });
    }
    const { publishLoading: prePL } = this.props;
    const { push, publishLoading } = nextProps;
    if (!publishLoading && prePL) {
      message.success('发布成功');
      const { location: { query: { boardId } } } = this.props;
      push(`/report?boardId=${boardId}`);
    }
  }

  componentWillUnmount() {
    this.props.delBoardInfo();
  }

  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  openPublishConfirmModal() {
    this.setState({
      publishConfirmModal: true,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '返回' } })
  handleBackClick() {
    this.props.goBack();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发布' } })
  handlePubClick() {
    this.openPublishConfirmModal();
  }

  @autobind
  publishBoardCofirm() {
    const { id, ownerOrgId } = this.state.boardInfo;
    this.props.publishBoard({
      boardId: id,
      ownerOrgId,
      isPublished: 'Y',
    });
  }

  render() {
    if (_.isEmpty(this.state.boardInfo)) {
      return null;
    }
    const { publishConfirmModal } = this.state;
    const { location } = this.props;
    const { name, id, boardType } = this.state.boardInfo;
    // 发布共同配置项
    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.publishBoardCofirm,
    };
    return (
      <div className={styles.previewReport}>
        <div className={styles.previewHome}>
          <ReportHome
            preView
            reportName={name}
            location={location}
            boardId={id}
            boardType={boardType}
          />
        </div>
        <div
          className={styles.previewLayout}
          style={{
            left: contentWrapper ? dom.getCssStyle(contentWrapper, 'left') : '0',
          }}
        >
          <Button onClick={this.handlePubClick} key="publish" className={styles.preButton} size="large" type="primary">发布</Button>
          <Button onClick={this.handleBackClick} key="back" className={styles.preButton} size="large" ghost>返回</Button>
        </div>
        <PublishConfirmModal {...publishConfirmMProps} />
      </div>
    );
  }
}
