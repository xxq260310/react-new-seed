/*
 * @Description: 任务反馈
 * @Author: Wangjunjun
 * @path: src/routes/taskFeedback/Home
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import { Button, message } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import choosePage from '../../components/operationManage/choosePage';
import QuestionList from '../../components/operationManage/taskFeedback/QuestionList';
import AddQuestionModal from '../../components/operationManage/taskFeedback/AddQuestionModal';
import logable from '../../decorators/logable';
import styles from './home.less';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryQuestions: 'taskFeedback/queryQuestions',
  deleteQuestion: 'taskFeedback/deleteQuestion',
  addOneQuestion: 'taskFeedback/addOneQuestion',
};

const mapStateToProps = state => ({
  questionInfoList: state.taskFeedback.questionInfoList,
  deleteSuccess: state.taskFeedback.deleteSuccess,
  addSuccess: state.taskFeedback.addSuccess,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 查询问题列表
  queryQuestions: fetchDataFunction(true, effects.queryQuestions),
  // 删除一个问题
  deleteQuestion: fetchDataFunction(true, effects.deleteQuestion),
  // 添加一个问题
  addOneQuestion: fetchDataFunction(true, effects.addOneQuestion),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@choosePage
export default class TaskFeedback extends PureComponent {

  static propTypes = {
    questionInfoList: PropTypes.object.isRequired,
    queryQuestions: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    addOneQuestion: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    deleteSuccess: PropTypes.bool.isRequired,
    addSuccess: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.props.queryQuestions({
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 显示隐藏添加问题的对话框
  @autobind
  @logable({ type: 'Click', payload: { name: '关闭弹框' } })
  setModalVisible(bool) {
    this.setState({
      modalVisible: bool,
    });
  }

  // 显示添加问题的对话框
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '+添加问题' } })
  addQuestion() {
    this.setModalVisible(true);
  }

  /**
   * 提交问题
   * 添加问题成功后，重新获取问题列表
   */
  @autobind
  submitOneQuestion(values) {
    const {
      addOneQuestion,
      queryQuestions,
      location: {
        query: {
          pageSize = 10,
        },
        pathname,
      },
      replace,
    } = this.props;
    const {
      quesValue,
      quesTypeCode,
      quesOptions,
      quesDesp,
    } = values;
    addOneQuestion({
      quesValue,
      quesTypeCode,
      quesOptions: _.compact(quesOptions),
      quesDesp,
    }).then(() => {
      if (this.props.addSuccess) {
        message.success('添加成功');
        queryQuestions({
          pageNum: 1,
          pageSize,
        });
        replace({
          pathname,
          query: {
            pageNum: 1,
          },
        });
      }
      this.setState({ modalVisible: false });
    });
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <div className={styles.taskFeedback}>
        <p className={styles.pageDescription}>
          任务反馈标准问题库，用于管理岗人员给服务经理创建任务时选择是否要服务经理对该任务做反馈，
          并为需要的反馈从此标准问题库中选择问题列表组成调查问卷。管理人员在此维护问题列表。
        </p>
        <div className={styles.listHeader}>
          <Button
            className={styles.addQuestion}
            type="dashed"
            onClick={this.addQuestion}
          >
            +添加问题
          </Button>
        </div>
        <QuestionList
          {...this.props}
        />
        {
          modalVisible ?
            <AddQuestionModal
              title="新增任务反馈问题"
              visible={modalVisible}
              closable
              maskClosable={false}
              onOk={values => this.submitOneQuestion(values)}
              onCancel={() => this.setModalVisible(false)}
            /> : null
        }
      </div>
    );
  }
}

