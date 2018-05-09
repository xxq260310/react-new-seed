/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-08 10:39:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-08 11:32:29
 * 将公用的获取数据的方法通过connect单独生成connect组件
 * 避免在组件被引用多次的时候，需要传入很多次公用方法
 */

import { connect } from 'dva';
import MissionInvestigation from './index';
// import RestoreScrollTop from '../../../decorators/restoreScrollTop';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 问题列表
  questionInfo: state.taskFeedback.questionInfoList,
});

const mapDispatchToProps = {
  // 获取问题列表数据
  getQuestionList: fetchDataFunction(true, 'taskFeedback/queryQuestions'),
};

// withRef暴露被包裹组件给引用的组件
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(MissionInvestigation);
