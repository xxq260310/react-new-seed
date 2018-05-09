/**
 * @Description: 个股详情页面
 * @Author: Liujianshu
 * @Date: 2018-02-28 14:07:50
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-09 15:21:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Layout } from 'antd';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import fspPatch from '../../decorators/fspPatch';
import Icon from '../../components/common/Icon';

import config from './config';
import styles from './detail.less';
import logable from '../../decorators/logable';

const { typeList } = config;
const { Header, Footer, Content } = Layout;
const EMPTY_PARAM = '暂无';
const pathname = '/stock';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  detail: state.stock.detail,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  push: routerRedux.push,
  // 获取列表
  getStockDetail: fetchDataFunction(true, 'stock/getStockDetail', true),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@fspPatch()
export default class StockDetail extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    getStockDetail: PropTypes.func.isRequired,
    detail: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: {
          id,
          type,
          keyword = '',
          code,
        },
      },
      detail,
    } = this.props;
    // 从类型数组里去掉当前点击的类型
    const filterTypeList = _.filter(typeList, o => o !== type);
    this.state = {
      id,
      type,
      keyword,
      code,
      detail,
      filterTypeList,
    };
  }

  componentDidMount() {
    const {
      getStockDetail,
      location: {
        query: {
          eventType,
          type,
        },
      },
    } = this.props;
    const { id, detail } = this.state;
    if (_.isEmpty(detail[id])) {
      const payload = {
        id,
        type,
        eventType,
      };
      getStockDetail(payload).then(() => {
        const { detail: newDetail } = this.props;
        this.setState({
          detail: newDetail,
        });
      });
    }
  }

  // a 链接事件
  @autobind
  @logable({ type: 'Click', payload: { name: '相关' } })
  hrefHandle(item) {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
        },
      },
      push,
    } = this.props;
    const { keyword, type, code } = this.state;

    const urlQuery = {
      // 类型
      type: item,
      // 每页条数
      pageSize,
      // 第几页
      pageNum: item === type ? pageNum : 1,
      // 搜索关键字
      // 如果搜索关键字为空，则取 code 为关键字，否则用 keyword
      keyword: _.isEmpty(keyword) ? code : keyword,
    };
    push({
      pathname,
      query: urlQuery,
    });
  }

  // 返回按钮事件
  @autobind
  @logable({ type: 'Click', payload: { name: '返回' } })
  goBackHandle() {
    const {
      location: {
        query: {
          pageSize = 10,
          pageNum = 1,
        },
      },
      push,
    } = this.props;
    const { keyword, type } = this.state;

    const urlQuery = {
      // 类型
      type,
      // 每页条数
      pageSize,
      // 第几页
      pageNum,
      // 搜索关键字
      keyword,
    };
    push({
      pathname,
      query: urlQuery,
    });
  }

  // 空方法，用于日志上报
  @logable({ type: 'Click', payload: { name: '下载PDF 全文' } })
  handleDownloadClick() {}

  @logable({ type: 'Click', payload: { name: '下载WORD 全文' } })
  handleDownload() {}

  render() {
    const { id, detail: dataDetail = {}, filterTypeList } = this.state;
    let title = '';
    let author = '';
    let pubdate = '';
    let detail = '';
    let pdfDownloadUrl = '';
    let wordDownloadUrl = '';

    if (!_.isEmpty(dataDetail[id])) {
      title = dataDetail[id].title;
      author = dataDetail[id].author;
      pubdate = dataDetail[id].pubdate;
      detail = dataDetail[id].detail;
      pdfDownloadUrl = dataDetail[id].pdfDownloadUrl;
      wordDownloadUrl = dataDetail[id].wordDownloadUrl;
    }

    // Д 为替换后端返回数据中的换行符而设置，无实际价值
    const newDetail = detail.replace(/\r\n|\n\t|\t\n|\n/g, 'Д');
    const splitArray = newDetail.split('Д');

    return (
      <Layout className={styles.detailWrapper}>
        <Header className={styles.header}>
          <h2>{title || EMPTY_PARAM}</h2>
          <h3>作者：{author || EMPTY_PARAM}　　　发布日期：{pubdate || EMPTY_PARAM}</h3>
        </Header>
        <Content className={styles.content}>
          {
            detail
            ?
              splitArray.map((item, index) => {
                const itemKey = `item${index}`;
                return (<div
                  key={itemKey}
                  className={styles.contentDiv}
                  dangerouslySetInnerHTML={{ __html: _.trim(item) }}
                />);
              })
            :
              <div>{EMPTY_PARAM}</div>
          }
        </Content>
        <Footer className={styles.footer}>
          <div className={styles.left}>
            {
              pdfDownloadUrl
              ?
                <a
                  onClick={this.handleDownloadClick}
                  href={pdfDownloadUrl}
                  download
                >
                  <Icon type="pdf1" />PDF 全文
                </a>
              :
                null
            }
            {
              wordDownloadUrl
              ?
                <a
                  onClick={this.handleDownload}
                  href={wordDownloadUrl}
                  download
                >
                  <Icon type="word1" />WORD 全文
                </a>
              :
                null
            }
            { /* <a><Icon type="chakan" />查看持仓客户</a> */ }
          </div>
          <div className={styles.right}>
            <a onClick={this.goBackHandle}><Icon type="fanhui1" />返回</a>
            {
              filterTypeList.map(item => (
                <a onClick={() => this.hrefHandle(item)} key={item}>相关{config[item].name}</a>
              ))
            }
          </div>
        </Footer>
      </Layout>
    );
  }
}
