/**
 * @file routes/customerPool/ViewpointList.js
 * 投顾观点列表
 * @author zhangjunli
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';
import { linkTo } from '../../utils';
import { url as urlHelper } from '../../helper';
import withRouter from '../../decorators/withRouter';
import Pagination from '../../components/common/Pagination';
import styles from './viewpointList.less';
import logable from '../../decorators/logable';

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

const columns = ({ actionClick }) => {
  function handleClick(item) {
    if (_.isFunction(actionClick)) {
      actionClick(item);
    }
  }
  return [{
    title: '标题',
    key: 'texttitle',
    width: '30%',
    render: item => (
      <div
        className={classnames(styles.td, styles.headLine)}
        title={formatString(item.texttitle)}
        onClick={() => { handleClick(item); }}
      >
        <a>{formatString(item.texttitle)}</a>
      </div>
    ),
  }, {
    title: '类型',
    dataIndex: 'textcategorychinese',
    key: 'textcategorychinese',
    width: '14%',
    render: item => (
      <div className={classnames(styles.td, styles.category)}>{formatString(item)}</div>
    ),
  }, {
    title: '相关股票',
    dataIndex: 'aboutStock',
    key: 'aboutStock',
    width: '16%',
    render: item => (
      <div className={classnames(styles.td, styles.stock)}>{formatString(item)}</div>
    ),
  }, {
    title: '行业',
    dataIndex: 'induname',
    key: 'induname',
    width: '13%',
    render: item => (
      <div className={classnames(styles.td, styles.induname)}>{formatString(item)}</div>
    ),
  }, {
    title: '报告日期',
    dataIndex: 'pubdatelist',
    key: 'pubdatelist',
    width: '13%',
    render: (item) => {
      const dateArray = _.split(item, ' ');
      const date = _.isEmpty(dateArray) ? '' : _.head(dateArray);
      return (
        <div className={classnames(styles.td, styles.pubdatelist)}>{formatString(date)}</div>
      );
    },
  }, {
    title: '作者',
    dataIndex: 'authors',
    key: 'authors',
    width: '13%',
    render: item => (
      <div
        className={classnames(styles.td, styles.authors)}
        title={formatString(item)}
      >
        {formatString(item)}
      </div>
    ),
  }];
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  information: state.customerPool.information, // 首席投顾观点
});
const mapDispatchToProps = {
  getInformation: fetchDataFunction(true, 'customerPool/getInformation'),
  push: routerRedux.push,
  replace: routerRedux.replace,
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointList extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    information: PropTypes.object,
    getInformation: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    information: {},
  }

  constructor(props) {
    super(props);
    const {
      information: { infoVOList = [] },
      location: { query: { curPageNum = '1', pageSize = '20' } },
    } = props;
    // 注意 location的query中的字段，无论是key还是value都是字符串
    this.state = {
      curPageNum: _.toNumber(curPageNum), // 记录当前展示的页码
      curPageSize: _.toNumber(pageSize), // 记录当前每页的容量
      pageList: infoVOList, // 当前页码对应的列表数据
    };
  }

  componentWillReceiveProps(nextProps) {
    const { information: { infoVOList = [] } } = nextProps;
    this.setState({ pageList: infoVOList });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '咨询列表项$args[0].texttitle' } })
  handleTitleClick(item) {
    const { curPageSize, curPageNum } = this.state;
    const { push } = this.props;
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '资讯' };
    const url = '/customerPool/viewpointDetail';
    const query = { detailIndex: item.id, pageSize: curPageSize, curPageNum };
    linkTo({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
      name: '资讯详情',
    });
  }

  @autobind
  handlePageClick(page) {
    const { getInformation, replace, location: { pathname, query } } = this.props;
    const { curPageSize } = this.state;
    this.setState(
      { curPageNum: page },
      () => {
        const newQuery = { curPageNum: page, pageSize: curPageSize };
        getInformation(newQuery);
        replace({ pathname, query: { ...query, ...newQuery } });
      },
    );
  }

  @autobind
  handlePageSizeClick(current, size) {
    const { getInformation, replace, location: { pathname, query } } = this.props;
    this.setState(
      { curPageSize: size, curPageNum: 1 },
      () => {
        const newQuery = { curPageNum: 1, pageSize: size };
        getInformation(newQuery);
        replace({ pathname, query: { ...query, ...newQuery } });
      },
    );
  }

  render() {
    const { information: { totalCount } } = this.props;
    const { curPageNum = 1, pageList = [], curPageSize = 20 } = this.state;
    const newInfoVOList = _.map(
      pageList,
      (item, index) => ({
        ...item,
        aboutStock: `${formatString(item.secuabbr)} / ${formatString(item.tradingcode)}`,
        id: `${index}`,
      }),
    );
    const paganationOption = {
      current: curPageNum,
      pageSize: curPageSize,
      total: totalCount,
      onChange: this.handlePageClick,
      onShowSizeChange: this.handlePageSizeClick,
    };
    const tableColumns = columns({ actionClick: this.handleTitleClick });
    return (
      <div className={styles.listContainer}>
        <div
          className={styles.inner}
        >
          <Table
            rowKey={'id'}
            columns={tableColumns}
            dataSource={newInfoVOList}
            pagination={false}
            scroll={{ x: 1100 }}
            // 默认文案配置
            locale={{
              // 空数据时的文案
              emptyText: '暂无数据',
            }}
          />
          <Pagination {...paganationOption} />
        </div>
      </div>
    );
  }
}
