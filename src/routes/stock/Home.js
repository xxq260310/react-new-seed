/**
 * @Description: 个股页面
 * @Author: Liujianshu
 * @Date: 2018-02-26 16:22:05
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-02 09:53:10
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Table, Input } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import config from './config';
import styles from './home.less';
import logable from '../../decorators/logable';

const TabPane = Tabs.TabPane;
const { typeList } = config;
const EMPTY_PARAM = '暂无';
const pathname = '/stock/detail';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  list: state.stock.list,
  page: state.stock.page,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  // 获取列表
  getStockList: fetchDataFunction(true, 'stock/getStockList', true),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class Stock extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    getStockList: PropTypes.func.isRequired,
    list: PropTypes.array,
    page: PropTypes.object,
  }

  static defaultProps = {
    list: [],
    page: {},
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          type = typeList[0],
          keyword = '',
        },
      },
    } = props;
    this.state = {
      // tab 页类型
      type,
      // 每页条数
      pageSize,
      // 当前页
      pageNum,
      // 总条数
      total: 0,
      // 搜索关键字
      keyword,
    };
  }

  componentDidMount() {
    // 请求所有股票点评
    this.sendRequest({});
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '个股资讯',
      type: '$props.location.query.type',
    },
  })
  rowClickHandle(record) {
    const { id, code, eventType } = record;
    const { push } = this.props;
    const { type, pageSize, pageNum, keyword } = this.state;
    const urlQuery = {
      // 点击的列表 ID
      id,
      // 类型
      type,
      // 每页条数
      pageSize,
      // 第几页
      pageNum,
      // 搜索关键字
      keyword,
      // 股票代码
      code,
      // 事件类型
      eventType,
    };
    push({
      pathname,
      query: urlQuery,
    });
  }

  // tab 切换事件
  @autobind
  @logable({ type: 'Click', payload: { name: '切换Tab：' } })
  tabChangeHandle(key) {
    const { keyword } = this.state;
    this.setState({
      type: key,
    }, () => {
      this.sendRequest({
        type: key,
        keyword,
        page: 1,
        pageSize: 10,
      });
    });
  }

  // 搜索框变化事件
  @autobind
  searchChangeHandle(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  // 搜索事件
  @autobind
  searchHandle() {
    const { keyword } = this.state;
    this.sendRequest({
      keyword,
      page: 1,
      pageSize: 10,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '$state.keyword关键字搜索' } })
  handlerEnterSearch() {
    this.searchHandle();
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '$state.keyword关键字查询' } })
  handleClickSearch() {
    this.searchHandle();
  }

  // 翻页事件
  @autobind
  pageChangeHandle(page, pageSize) {
    const { keyword } = this.state;
    const payload = {
      page,
      pageSize,
      keyword,
    };
    this.setState({
      pageSize,
      pageNum: page,
    }, () => {
      this.sendRequest(payload);
    });
  }

  @autobind
  sendRequest(obj) {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
          keyword = '',
        },
      },
      getStockList,
    } = this.props;
    const { type } = this.state;
    const payload = {
      type,
      page: pageNum,
      pageSize,
      keyword,
      orderBy: '',
      ...obj,
    };
    getStockList(payload).then(() => {
      const { page = {} } = this.props;
      this.setState({
        pageSize: page.pageSize || 10,
        pageNum: page.curPageNum || 1,
        total: page.totalRecordNum || 0,
      });
    });
  }

  @autobind
  wrapperTD(array) {
    const { type } = this.state;
    // 为包裹的 div 设置 className
    const boolArray = typeList.map(item => type === item);
    const divClassName = classnames({
      [styles[typeList[0]]]: boolArray[0],
      [styles[typeList[1]]]: boolArray[1],
      [styles[typeList[2]]]: boolArray[2],
    });
    let resultArr = { ...array };
    if (!_.isEmpty(array)) {
      resultArr = array.map((item) => {
        const newItem = item;
        newItem.render = text => <div className={divClassName} title={text || EMPTY_PARAM}>
          {text || EMPTY_PARAM}
        </div>;
        return newItem;
      });
    }
    return resultArr;
  }

  render() {
    const { type, keyword, pageNum, pageSize, total } = this.state;
    const { list } = this.props;
    // 分页
    const paginationOption = {
      pageSize: Number(pageSize),
      current: Number(pageNum),
      total: Number(total),
      onChange: this.pageChangeHandle,
    };

    return (
      <div className={styles.stockWrapper}>
        <div className={styles.search}>
          搜索：
          <Input
            placeholder="股票名称/股票代码/股票简称"
            onPressEnter={this.handlerEnterSearch}
            onChange={this.searchChangeHandle}
            style={{ width: '34.7%' }}
            value={keyword}
          />
          <Button
            type="primary"
            size="small"
            onClick={this.handleClickSearch}
          >
            查询
          </Button>
        </div>
        <Tabs defaultActiveKey={type} onChange={this.tabChangeHandle}>
          {
            typeList.map(item => (<TabPane tab={`个股${config[item].name}`} key={item}>
              <Table
                columns={this.wrapperTD(config[item].titleList)}
                dataSource={list}
                pagination={false}
                onRow={record => ({
                  onClick: () => this.rowClickHandle(record),       // 点击行
                })}
                rowKey="id"
                // 默认文案配置
                locale={{
                  // 空数据时的文案
                  emptyText: '暂无数据',
                }}
              />
              <Pagination {...paginationOption} />
            </TabPane>))
          }
        </Tabs>
      </div>
    );
  }
}
