/**
 * @fileOverview components/history/IndicatorOverviewHeader.js
 * @author hongguangqing
 * @description 用于历史对比头部区域模块
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';
import { Prompt } from 'dva/router';
import Icon from '../common/Icon';
import { CreateHistoryBoardModal, DeleteHistoryBoardModal } from '../modals';
import logable from '../../decorators/logable';

// 选择项字典
import styles from './indicatorOverviewHeader.less';

// 投顾绩效历史对比的borderId
const TYPE_LSDB_TGJX = '3';
// 经营业绩历史对比的boardId
const TYPE_LSDB_JYYJ = '4';

export default class IndicatorOverviewHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    createBoardConfirm: PropTypes.func.isRequired,
    deleteBoardConfirm: PropTypes.func.isRequired,
    updateBoardConfirm: PropTypes.func.isRequired,
    ownerOrgId: PropTypes.string.isRequired,
    orgId: PropTypes.string.isRequired,
    selectKeys: PropTypes.array.isRequired,
    createLoading: PropTypes.bool.isRequired,
    operateData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      createHistoryBoardModal: false,
      deleteHistoryBoardModal: false,
      saveHistoryBoardModal: false,
      isBlocking: false,
    };
  }

  componentDidMount() {
    const { router } = this.context;
    this.historyListen = router.history.listen(() => {
      if (!_.isEmpty(this.props.selectKeys)) {
        this.setState({
          isBlocking: true,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.historyListen) {
      this.historyListen();
    }
  }


  @autobind
  closeModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  @autobind
  openModal(modal) {
    this.setState({
      [modal]: true,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '另存为' } })
  createHistoryBoardHandle() {
    this.openModal('createHistoryBoardModal');
  }

  // 删除历史对比看板
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '删除' } })
  deleteHistoryBoardHandle() {
    this.openModal('deleteHistoryBoardModal');
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '保存' } })
  saveHistoryBoardHandle() {
    const {
      location: { query: { boardId, boardType } },
      updateBoardConfirm,
      ownerOrgId,
      selectKeys,
    } = this.props;
    // TODO 调用更新(保存)历史看板接口
    if (boardType === 'TYPE_LSDB_TGJX') {
      updateBoardConfirm({
        ownerOrgId,
        boardId,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['tgInNum'],
        custContrastIndicator: ['custNum', 'currSignCustNum'],
      });
    } else {
      updateBoardConfirm({
        ownerOrgId,
        boardId,
        boardType,
        coreIndicator: selectKeys,
        investContrastIndicator: ['ptyMngNum'],
        custContrastIndicator: ['totCustNum', 'pCustNum', 'oCustNum', 'oNoPrdtCustNum', 'oPrdtCustNum', 'InminorCustNum', 'newCustNum'],
      });
    }
  }


  render() {
    const { createHistoryBoardModal, deleteHistoryBoardModal, isBlocking } = this.state;
    const {
      location: { query: { boardId, boardType } },
      createBoardConfirm,
      deleteBoardConfirm,
      ownerOrgId,
      orgId,
      selectKeys,
      createLoading,
      operateData,
    } = this.props;
    // 创建（另存为）共同配置项
    const createHistoryBMProps = {
      modalKey: 'createHistoryBoardModal',
      modalCaption: '提示',
      visible: createHistoryBoardModal,
      closeModal: this.closeModal,
      createBoardConfirm,
      ownerOrgId,
      boardId,
      boardType,
      selectKeys,
      createLoading,
      operateData,
    };
    // 删除共同配置项
    const deleteHistoryBMProps = {
      modalKey: 'deleteHistoryBoardModal',
      modalCaption: '提示',
      visible: deleteHistoryBoardModal,
      closeModal: this.closeModal,
      deleteBoardConfirm,
      orgId,
      boardId,
      boardType,
    };

    const deleteBtnClass = classnames({
      [styles.deleteBtnUnshowClass]: boardId === TYPE_LSDB_TGJX || boardId === TYPE_LSDB_JYYJ,
    });
    const createBtnClass = classnames({
      [styles.createBtnUnshowClass]: _.isEmpty(this.props.selectKeys),
    });
    const updateBtnClass = classnames({
      [styles.updateBtnUnshowClass]: boardId === TYPE_LSDB_TGJX ||
                                     boardId === TYPE_LSDB_JYYJ ||
                                     (_.isEmpty(this.props.selectKeys) &&
                                     boardId !== TYPE_LSDB_TGJX &&
                                     boardId !== TYPE_LSDB_JYYJ),
    });

    return (
      <div className={styles.indicatorOverviewHeader}>
        <div className={styles.analyticalCaption}>指标分析</div>
        <div className={styles.overviewHeaderRight}>
          <Button
            type="primary"
            ghost
            onClick={this.saveHistoryBoardHandle}
            className={updateBtnClass}
          >
            <Icon type="save_blue" />
            保存
          </Button>
          <Button
            ghost
            onClick={this.createHistoryBoardHandle}
            className={createBtnClass}
          >
            <Icon type="save_blue" />
            另存为
          </Button>
          <CreateHistoryBoardModal
            {...createHistoryBMProps}
          />
          <Button
            ghost
            onClick={this.deleteHistoryBoardHandle}
            className={deleteBtnClass}
          >
            <Icon type="shanchu" />
            删除
          </Button>
          <DeleteHistoryBoardModal
            {...deleteHistoryBMProps}
          />
        </div>
        <Prompt
          when={isBlocking}
          message="您重新挑选的指标看板尚未保存，确认直接返回？"
        />
      </div>
    );
  }
}
