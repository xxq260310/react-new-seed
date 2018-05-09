/**
 * @file customerPool/ToDo.js
 *  目标客户池 待办流程列表页
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Input, Row, Col } from 'antd';
import withRouter from '../../decorators/withRouter';
import ToDoList from '../../components/customerPool/todo/ToDoList';
import logable from '../../decorators/logable';
import styles from './todo.less';

const curPageNum = 1;
const pageSize = 10;

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const effects = {
  getTaskBasicInfo: 'tasklist/getTaskBasicInfo',
};
const mapStateToProps = state => ({
  todolist: state.customerPool.todolist,
  data: state.customerPool.todolistRecord,
  taskBasicInfo: state.tasklist.taskBasicInfo,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getTaskBasicInfo: fetchDataFunction(true, effects.getTaskBasicInfo),
  // 清除自建任务数据
  clearCreateTaskData: query => ({
    type: 'customerPool/clearCreateTaskData',
    payload: query || {},
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ToDo extends PureComponent {

  static propTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    todolist: PropTypes.array.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object,
    clearCreateTaskData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    taskBasicInfo: {},
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0]关键字搜索任务' } })
  onSearch(value) {
    // this.props.search(value);
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        keyword: value,
        curPageNum,
        pageSize,
      },
    });
  }

  @autobind
  pageChange(obj) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
    // this.props.pageChange(obj);
  }

  @autobind
  sizeChange(obj) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        ...obj,
      },
    });
  }

  render() {
    const {
      data,
      todolist,
      location,
      push,
      replace,
      taskBasicInfo,
      getTaskBasicInfo,
      clearCreateTaskData } = this.props;
    const { query: { keyword } } = location;
    return (
      <div className={styles.todo}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            <p className="total-num">找到待办流程任务<em>&nbsp;{data.length}&nbsp;</em>个</p>
          </Col>
          <Col span={12}>
            <div className="search-box">
              <Input.Search
                className="search-input"
                placeholder="请输入任务名称"
                defaultValue={keyword}
                onSearch={this.onSearch}
                enterButton
              />
            </div>
          </Col>
        </Row>
        <ToDoList
          className="todoList"
          data={data}
          todolist={todolist}
          onPageChange={this.pageChange}
          onSizeChange={this.sizeChange}
          location={location}
          push={push}
          replace={replace}
          taskBasicInfo={taskBasicInfo}
          getTaskBasicInfo={getTaskBasicInfo}
          clearCreateTaskData={clearCreateTaskData}
        />
      </div>
    );
  }
}
