/*
 * @Description: 任务反馈问题列表项
 * @Author: Wangjunjun
 * @path: src/components/taskFeedback/ListItem.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Icon from '../../common/Icon';

import styles from './questionList.less';

// 主观题对应的code码
const subjectiveType = '3';

const ListItem = (props) => {
  const {
    item,
    item: {
      quesDesp,
      quesValue,
      quesTypeCode,
      quesTypeValue,
      optionInfoList,
    },
    deleteQuestion,
  } = props;

  const handleDelete = () => {
    deleteQuestion(item);
  };

  /**
   * 根据数组的索引生成大写的英文字母，0=>A, 1=>B, 2=>C ...
   */
  const getLetter = i => (i < 26 ? String.fromCharCode(i + 65) : 'error letter');

  /**
   * 根据选择题答案的数组生成 带选项序号的答案 的html
   * @param {*} list 答案数组
   */
  const choiceAnswer = (list) => {
    if (!_.isEmpty(list)) {
      return _.map(list, (o, i) => <p key={o.optionId} >{getLetter(i)}. {o.optionValue}</p>);
    }
    return null;
  };

  /**
   * 根据题目的类型，生成选择题和主观题的答案或者描述
   * quesTypeCode = 3 时显示主观题描述， 1、2显示选择题答案
   */
  const showAnswerOrDescription = () => {
    if (quesTypeCode === subjectiveType) {
      return (
        <div className={`${styles.row} ${styles.mt20}`}>
          <span className={styles.label}>描述：</span>
          <span className={styles.content}>{ quesDesp }</span>
        </div>
      );
    }
    return (
      <div className={`${styles.row} ${styles.mt20}`}>
        <span className={styles.label}>答案：</span>
        <span className={styles.content}>
          { choiceAnswer(optionInfoList) }
        </span>
      </div>
    );
  };

  return (
    <div className={styles.listItem}>
      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.label}>问题：</span>
          <span className={styles.content}>{quesValue}</span>
        </div>
        <div className={`${styles.row} ${styles.mt20}`}>
          <span className={styles.label}>问题类型：</span>
          <span className={styles.content}>{quesTypeValue}</span>
        </div>
        { showAnswerOrDescription() }
      </div>
      <div className={styles.actionZone}>
        <span className={styles.button} onClick={handleDelete}>
          <Icon type="shanchu" /> 删除
        </span>
      </div>
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
};

export default ListItem;
