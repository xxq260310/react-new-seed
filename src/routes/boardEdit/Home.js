/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Tooltip, Button, message } from 'antd';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';

import { fspContainer /* , responseCode */} from '../../config';
import SimpleEditor from '../../components/Edit/SimpleEditor';
import SelfSelect from '../../components/Edit/SelfSelect';
import BoardSelectTree from '../../components/Edit/BoardSelectTree';
import selectHandlers from '../../components/Edit/selectHelper';
import { BackConfirmModal, PublishConfirmModal } from '../../components/modals';
import withRouter from '../../decorators/withRouter';
import styles from './Home.less';
import logable from '../../decorators/logable';

const reactApp = fspContainer.reactApp;

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  visibleRanges: state.edit.visibleRanges,
  boardInfo: state.edit.boardInfo,
  updateLoading: state.edit.updateLoading,
  publishLoading: state.edit.publishLoading,
  message: state.edit.message,
  operateData: state.edit.operateData,
  indicatorLib: state.edit.indicatorLib,
  globalLoading: state.activity.global,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getBoardInfo: fectchDataFunction(true, 'edit/getBoardInfo'),
  delBoardInfo: fectchDataFunction(true, 'edit/delBoardInfo'),
  getVisibleRange: fectchDataFunction(false, 'edit/getVisibleRange'),
  getIndicatorLib: fectchDataFunction(false, 'edit/getIndicatorLib'),
  updateBoard: fectchDataFunction(false, 'edit/updateBoard'),
  publishBoard: fectchDataFunction(true, 'edit/publishBoard'),
  getEditInitial: fectchDataFunction(true, 'edit/getEditInitial'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BoardEditHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    boardInfo: PropTypes.object.isRequired,
    operateData: PropTypes.object.isRequired,
    visibleRanges: PropTypes.array.isRequired,
    indicatorLib: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    globalLoading: PropTypes.bool.isRequired,
    updateLoading: PropTypes.bool.isRequired,
    publishLoading: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getBoardInfo: PropTypes.func.isRequired,
    delBoardInfo: PropTypes.func.isRequired,
    getVisibleRange: PropTypes.func.isRequired,
    getIndicatorLib: PropTypes.func.isRequired,
    updateBoard: PropTypes.func.isRequired,
    publishBoard: PropTypes.func.isRequired,
    getEditInitial: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      boardNameEditor: false,
      visibleRangeEditor: false,
      bNEditorOriginal: '',
      vROriginal: '',
      vREditorOriginal: [],
      preview: false,
      vrTipVisible: false,
      nameTipVisible: false,
      visibleRangeTip: '',
      nameTip: '',
      clickWhichBtn: '', // 用户点击的是哪一个按钮
      publishBt: false, // 发布按钮状态, 默认为false，即可用状态
      previewBt: false, // 预览按钮状态
      saveBt: false, // 保存按钮状态，false为已经保存过了的状态
      publishConfirmModal: false,
      backConfirmModal: false,
      hasPublished: false, // 看板是否已经发布
      saveBtnType: 'default', // 按钮样式
      summuryIndicator: [], // 用户选中的总量指标
      detailIndicator: [], // 用户选中的分类明细指标
    };
  }

  componentWillMount() {
    const { location: { query: { boardId, orgId, boardType } } } = this.props;
    this.props.getEditInitial({
      vr: { orgId },
      lib: { orgId, type: boardType },
      board: { boardId, orgId },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { visibleRanges, boardInfo } = nextProps;
    const { boardInfo: preBoardInfo } = this.props;
    if (!_.isEqual(boardInfo, preBoardInfo)) {
      const userVR = this.getAllUserVRKeys(boardInfo.orgModel);
      const hasPublished = boardInfo.boardStatus === 'RELEASE';
      // 转化总量指标和分类指标
      const summury = this.getUserSummuryKeys(boardInfo.summury);// 用户选择的总量指标
      const detail = this.initialDetailIndcators(boardInfo.detail); // 用户选择的分类指标
      const finalLabel = this.getVRLabel(userVR.slice(1), visibleRanges);
      this.setState({
        bNEditorOriginal: boardInfo.name, // 看板名称
        vROriginal: finalLabel, // 可见范围的显示label
        vREditorOriginal: userVR.slice(1), // 选择的可见范围
        visibleRangeTip: this.getTooltipHtml(finalLabel),
        nameTip: boardInfo.name,
        hasPublished,
        publishBt: _.isEmpty(summury) && _.isEmpty(detail),
        previewBt: _.isEmpty(summury) && _.isEmpty(detail),
        summuryIndicator: summury,
        detailIndicator: detail,
      });
    }
    const { publishLoading: prePL, updateLoading: preUL } = this.props;
    const { publishLoading, updateLoading, boardInfo: { id, ownerOrgId }, push } = nextProps;
    if (prePL && !publishLoading) {
      // 发布按钮
      const { success, msg /* code */} = nextProps.operateData;
      if (success) {
        message.success('发布成功');
        push(`/report?boardId=${id}`);
      } else {
        // if (code === responseCode.DUPLICATE_NAME) {
        message.error(msg);
        // } else {
          // message.error();
        // }
      }
    }
    if (preUL && !updateLoading) {
      this.setState({
        saveBt: false,
      });
      // 保存和预览按钮
      const { success, msg /* code */} = nextProps.operateData;
      if (success) {
        message.success('保存成功');
        if (this.state.clickWhichBtn === 'preview') {
          this.props.push(`/preview?boardId=${id}&orgId=${ownerOrgId}`);
        }
      } else {
        // if (code === responseCode.DUPLICATE_NAME) {
        message.error(msg);
        // } else {
          // message.error();
        // }
      }
    }
  }

  componentWillUnmount() {
    const { delBoardInfo } = this.props;
    delBoardInfo();
  }
  @autobind
  getAllUserVRKeys(orgModel) {
    return orgModel.map(o => o.id);
  }

  @autobind
  getVRLabel(user, all) {
    // 默认必须选中本级机构
    const allCheckedNode = selectHandlers.getAllCheckboxNode(all[0].level);
    const getFinalLabel = selectHandlers.afterSelected(all, allCheckedNode);
    return getFinalLabel(user);
  }

  @autobind
  getTooltipHtml(label) {
    const newLabel = label.replace(/\//g, '、');
    return (
      <div className="vrlabel">
        <div className="title">可见范围：</div>
        <div className="label">{newLabel}</div>
      </div>
    );
  }

  @autobind
  getTooltipContainer() {
    return document.querySelector(reactApp);
  }

  @autobind
  getUserSummuryKeys(summury) {
    if (!_.isEmpty(summury)) {
      return summury.map(o => o.key);
    }
    return [];
  }

  @autobind
  getDetailCheckedKeys(detail) {
    if (Array.isArray(detail)) {
      const detailCheckedKeys = [];
      detail.forEach((item) => {
        const children = item.detailIndicators || [];
        children.forEach(o => detailCheckedKeys.push(o.key));
      });
      return detailCheckedKeys;
    }
    return [];
  }

  @autobind
  initialDetailIndcators(detail) {
    if (_.isEmpty(detail)) {
      return [];
    }
    const result = [];
    detail.forEach((item) => {
      const children = item.detailIndicators;
      const category = item.indicatorCategoryDto;
      const detailIndicatorIds = [];
      children.forEach(child => detailIndicatorIds.push(child.key));
      const single = {
        categoryKey: category.categoryKey,
        detailIndicatorIds,
      };
      result.push(single);
    });
    return result;
  }


  @autobind
  editorStateController(editor, flag) {
    if (flag) {
      // 如果是打开某一个,其余需要关闭
      this.setState({
        boardNameEditor: false,
        visibleRangeEditor: false,
        [editor]: true,
        vrTipVisible: false,
        nameTipVisible: false,
      });
    } else {
      // 如果是关闭则只是关闭
      this.setState({
        [editor]: false,
      });
    }
  }

  @autobind
  saveBoardChange(board) {
    const { updateBoard, publishBoard } = this.props;
    const { isPublished } = board;
    if (isPublished === 'Y') {
      // 发布
      publishBoard(board);
    } else {
      // 更新
      updateBoard(board);
    }
  }

  // editor按确认按钮的处理程序
  @autobind
  editorConfirm(obj) {
    const { key, value } = obj;
    if (key === 'boardNameEditor') {
      this.setState({
        bNEditorOriginal: value,
        nameTip: value,
        saveBtnType: 'primary',
        saveBt: true,
      });
    }
    if (key === 'visibleRangeEditor') {
      const tip = this.getTooltipHtml(value.label);
      this.setState({
        vROriginal: value.label,
        vREditorOriginal: value.currency,
        visibleRangeTip: tip,
        saveBtnType: 'primary',
        saveBt: true,
      });
    }
  }

  @autobind
  showPreview() {
    this.setState({
      preview: true,
    });
  }

  @autobind
  hidePreview() {
    this.setState({
      preview: false,
    });
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
  openBackConfirmModal() {
    this.setState({
      backConfirmModal: true,
    });
  }

  @autobind
  nameTipVisibleHandle(flag) {
    const { boardNameEditor } = this.state;
    this.setState({
      nameTipVisible: !boardNameEditor && flag,
    });
  }

  @autobind
  vrTipVisibleHandle(flag) {
    const { visibleRangeEditor } = this.state;
    this.setState({
      vrTipVisible: !visibleRangeEditor && flag,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '发布' } })
  handlePublishBtnClick() {
    this.setState({ clickWhichBtn: 'publish' });
    this.openPublishConfirmModal();
  }

  @autobind
  saveBoard(extraParam) {
    const { bNEditorOriginal, vREditorOriginal, summuryIndicator, detailIndicator } = this.state;
    const { id, ownerOrgId } = this.props.boardInfo;
    // 后面新增指标库
    this.saveBoardChange({
      boardId: id,
      ownerOrgId,
      name: bNEditorOriginal,
      permitOrgIds: vREditorOriginal,
      summuryIndicator,
      detailIndicator,
      ...extraParam,
    });
  }
  // 发布就是保存并将isPublished: '设置成Y',
  @autobind
  publishBoardCofirm() {
    this.saveBoard({
      isPublished: 'Y',
    });
  }

  @autobind
  backModalConfirm() {
    this.props.push('/boardManage');
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '返回' } })
  handleBackBtnClick() {
    // 需要判断，是否进行了指标选择
    const { saveBt } = this.state;
    if (saveBt) {
      this.openBackConfirmModal();
    } else {
      this.props.push('/boardManage');
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '预览' } })
  handlePreviewBtnClick() {
    this.setState({ clickWhichBtn: 'preview' });
    // 预览按钮点击之后，需要先保存
    this.saveBoard({});
    // const { boardInfo: { id, ownerOrgId } } = this.props;
    // this.props.push(`/preview?boardId=${id}&orgId=${ownerOrgId}`);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '保存' } })
  handleSaveBtnClick() {
    this.setState({
      saveBt: false,
      clickWhichBtn: 'save',
    });
    this.saveBoard({});
  }

  @autobind
  changeBtnState(button) {
    this.setState({
      ...button,
    });
  }

  @autobind
  saveUserCheckedIndicators(type, indicators) {
    if (type === 'summury') {
      this.setState({
        summuryIndicator: indicators,
        saveBtnType: 'primary',
        saveBt: true,
      });
    } else {
      this.setState({
        detailIndicator: indicators,
        saveBtnType: 'primary',
        saveBt: true,
      });
    }
  }

  render() {
    const { boardInfo, visibleRanges, indicatorLib } = this.props;
    const { publishLoading, updateLoading, operateData } = this.props;
    const { vROriginal, vREditorOriginal, bNEditorOriginal } = this.state;
    // 做初始化容错处理
    if (_.isEmpty(visibleRanges)) {
      return null;
    }
    if (_.isEmpty(boardInfo)) {
      return null;
    }
    if (_.isEmpty(indicatorLib)) {
      return null;
    }
    const {
      boardNameEditor,
      visibleRangeEditor,
      visibleRangeTip,
      nameTip,
      vrTipVisible,
      nameTipVisible,
      publishBt,
      previewBt,
      saveBt,
      publishConfirmModal,
      backConfirmModal,
      hasPublished,
      saveBtnType,
    } = this.state;
    // 发布共同配置项
    const publishConfirmMProps = {
      modalKey: 'publishConfirmModal',
      modalCaption: '提示',
      visible: publishConfirmModal,
      closeModal: this.closeModal,
      confirm: this.publishBoardCofirm,
    };

    const backConfirmMProps = {
      modalKey: 'backConfirmModal',
      modalCaption: '提示',
      visible: backConfirmModal,
      closeModal: this.closeModal,
      confirm: this.backModalConfirm,
      tip: hasPublished ? 'publish' : 'save',
    };

    const { summury, detail } = boardInfo;
    const { boardTypeDesc, boardType } = this.props.boardInfo;
    // 总量指标库
    const summuryCheckedKeys = this.getUserSummuryKeys(summury);
    const summuryLib = {
      type: 'summury',
      boardType,
      checkTreeArr: indicatorLib.summury,
      checkedKeys: summuryCheckedKeys,
    };
    // 分类明细指标库
    const detailCheckedKeys = this.getDetailCheckedKeys(detail);
    const detailLib = {
      type: 'detail',
      boardType,
      checkTreeArr: indicatorLib.detail,
      checkedKeys: detailCheckedKeys,
    };

    return (
      <div className="page-invest content-inner">
        <div className={styles.editPageHd}>
          <div className={styles.HdName}>看板编辑</div>
        </div>
        <div className={styles.editBasicHd}>
          <div className={styles.editBasic}>
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板类型:</div>
              <SimpleEditor
                editable={false}
                originalValue={boardTypeDesc}
              />
            </div>
            <div className={styles.hDivider} />
            <Tooltip
              placement="bottom"
              title={nameTip}
              trigger="hover"
              visible={nameTipVisible}
              onVisibleChange={this.nameTipVisibleHandle}
              overlayClassName="visibleRangeToolTip"
              getPopupContainer={this.getTooltipContainer}
            >
              <div className={styles.basicInfo}>
                <div className={styles.title}>看板名称:</div>
                <SimpleEditor
                  editable
                  originalValue={bNEditorOriginal}
                  style={{
                    maxWidth: '260px',
                  }}
                  editorValue={bNEditorOriginal}
                  editorName="boardNameEditor"
                  controller={this.editorStateController}
                  editorState={boardNameEditor}
                  confirm={this.editorConfirm}
                  updateLoading={updateLoading}
                  publishLoading={publishLoading}
                  operateData={operateData}
                >
                  <Input autoComplete="off" style={{ paddingRight: '30px' }} />
                </SimpleEditor>
              </div>
            </Tooltip>
            <div className={styles.hDivider} />
            <Tooltip
              placement="bottom"
              title={visibleRangeTip}
              trigger="hover"
              visible={vrTipVisible}
              onVisibleChange={this.vrTipVisibleHandle}
              overlayClassName="visibleRangeToolTip"
              getPopupContainer={this.getTooltipContainer}
            >
              <div className={styles.basicInfo}>
                <div className={styles.title}>可见范围:</div>
                <SimpleEditor
                  editable
                  originalValue={vROriginal}
                  style={{
                    maxWidth: '260px',
                    minWidth: '180px',
                  }}
                  editorValue={{
                    currency: vREditorOriginal,
                    label: vROriginal,
                  }}
                  editorName="visibleRangeEditor"
                  controller={this.editorStateController}
                  editorState={visibleRangeEditor}
                  confirm={this.editorConfirm}
                >
                  <SelfSelect
                    options={visibleRanges}
                    level={visibleRanges[0].level || '3'}
                    style={{ height: '30px' }}
                  />
                </SimpleEditor>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={styles.editPageMain}>
          <BoardSelectTree
            data={summuryLib}
            saveIndcator={this.saveUserCheckedIndicators}
          />
          <BoardSelectTree
            data={detailLib}
            saveIndcator={this.saveUserCheckedIndicators}
          />
        </div>
        <div className={styles.editPageFoot}>
          <div className={styles.buttonGroup}>
            <Button
              disabled={publishBt}
              className={styles.editBt}
              onClick={this.handlePublishBtnClick}
              key="editPubl"
              size="large"
              type="primary"
            >
              发布
            </Button>
            <Button
              className={styles.editBt}
              onClick={this.handleBackBtnClick}
              key="editBack"
              size="large"
            >
              返回
            </Button>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              disabled={previewBt}
              className={styles.editBt}
              onClick={this.handlePreviewBtnClick}
              key="editPrev"
              size="large"
            >
              预览
            </Button>
            {/* 对于已经发布的看板不需要保存 */}
            {
              hasPublished ?
              null
              :
              (
                <Button
                  disabled={!saveBt}
                  className={styles.editBt}
                  onClick={this.handleSaveBtnClick}
                  key="editSave"
                  size="large"
                  type={saveBtnType}
                >
                  保存
                </Button>
              )
            }
          </div>
        </div>
        <PublishConfirmModal {...publishConfirmMProps} />
        <BackConfirmModal {...backConfirmMProps} />
      </div>
    );
  }
}
