/*
 * @Author: LiuJianShu
 * @Date: 2017-06-26 17:00:40
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-20 15:54:28
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import selectHandlers from '../Edit/selectHelper';
import styles from './BoardItem.less';
import ImgTGJX from './img/bg_tgjx.png';
import ImgJYYJ from './img/bg_jyyj.png';
import { optionsMap } from '../../config';
import logable from '../../decorators/logable';

const boardTypeMap = optionsMap.boardTypeMap;

export default class BoardItem extends PureComponent {

  static propTypes = {
    boardData: PropTypes.object.isRequired,
    visibleRanges: PropTypes.array.isRequired,
    delete: PropTypes.func.isRequired,
    publish: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  @autobind
  setVRnames(user, all) {
    // 首先判断
    const selfOrg = all[0].level;
    const allNode = selectHandlers.getAllCheckboxNode(selfOrg);
    const getVRnames = selectHandlers.afterSelected(all, allNode);
    return getVRnames(user, true);
  }
  // 发布按钮点击事件
  @autobind
  @logable({ type: 'Click', payload: { name: '发布' } })
  publishHandle() {
    const { publish, boardData: { boardStatus, id, ownerOrgId, isPublishable } } = this.props;
    if ((isPublishable === 'Y') && (boardStatus === 'UNRELEASE')) {
      publish({
        ownerOrgId,
        boardId: id,
      });
    }
  }
  // 进入编辑页面
  @autobind
  @logable({ type: 'Click', payload: { name: '编辑' } })
  editBoardHandle() {
    const { id, ownerOrgId, boardType } = this.props.boardData;
    this.props.push(`/boardEdit?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
  }
  @autobind
  @logable({ type: 'Click', payload: { name: '删除' } })
  deleteBoardHandle() {
    const { id, ownerOrgId, name } = this.props.boardData;
    this.props.delete({
      orgId: ownerOrgId,
      boardId: id,
      name,
    });
  }

  render() {
    const { visibleRanges } = this.props;
    if (_.isEmpty(visibleRanges)) {
      return null;
    }
    // 获取看板信息数据
    const {
      name,
      boardTypeDesc,
      boardStatus,
      createTime,
      updateTime,
      orgModel,
      isPublishable,
      boardType,
    } = this.props.boardData;
    const ImgBg = boardType === boardTypeMap.tgjx ? ImgTGJX : ImgJYYJ;
    const seeAllow = this.setVRnames(orgModel.slice(1), visibleRanges);
    let statusText = '';
    if (boardStatus === 'RELEASE') {
      statusText = '已发布';
    } else {
      statusText = '未发布';
    }

    const publishBtnClass = classnames({
      [styles.boardStatusPublish]: boardStatus === 'RELEASE',
      [styles.boardStatusUnPublish]: (boardStatus === 'UNRELEASE' && isPublishable === 'Y'),
      [styles.boardStatusPublishDisable]: (boardStatus === 'UNRELEASE' && isPublishable === 'N'),
    });

    return (
      <a className={styles.boardItem}>
        <div className={styles.boardImg}>
          <img src={ImgBg} alt="" />
          <div className={publishBtnClass}>
            <div className={styles.boardStatusBtn}>
              <span>{statusText}</span>
              <span onClick={this.publishHandle}>发布</span>
            </div>
          </div>
          <div className={styles.boardInfo}>
            <div className={styles.text}>可见范围：{seeAllow}</div>
            <div className={styles.text}>修改时间：{updateTime || createTime}</div>
          </div>
          <div className={styles.boardBtnGroup}>
            <span onClick={this.editBoardHandle}>编辑</span>
            <span onClick={this.deleteBoardHandle}>删除</span>
          </div>
        </div>
        <div className={styles.boardTitle}>
          <div className={styles.title}>{name}</div>
          <div className={styles.type}>{boardTypeDesc}</div>
        </div>
      </a>
    );
  }
}
