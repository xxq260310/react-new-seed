/**
 * @Author: ouchangzhi
 * @Date: 2018-01-17 09:28:11
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-02-07 20:27:01
 * @description 售前适当性查询
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Row, Col, Table, message } from 'antd';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import QualifiedCustModal from '../../components/preSaleQuery/QualifiedCustModal';
import SearchForm from '../../components/preSaleQuery/SearchForm';
import emp from '../../helper/emp';
import Icon from '../../components/common/Icon';
import logable, { logPV } from '../../decorators/logable';

import styles from './home.less';

const productRequirementMap = {
  1: '合格投资者-小集合类',
  2: '合格投资者-私募类',
  3: '合格投资者-信托类',
};
const effects = {
  // 查询客户列表
  custList: 'preSaleQuery/getCustList',
  // 查询产品列表
  productList: 'preSaleQuery/getProductList',
  // 查询匹配结果
  matchResult: 'preSaleQuery/getMatchResult',
  // 重置匹配结果
  resetMatchResult: 'preSaleQuery/resetMatchResult',
  // 重置客户列表和产品列表
  resetQueryList: 'preSaleQuery/resetQueryList',
};

const mapStateToProps = state => ({
  // 客户列表
  custList: state.preSaleQuery.custList,
  // 产品列表
  productList: state.preSaleQuery.productList,
  // 匹配结果
  matchResult: state.preSaleQuery.matchResult,
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustList: getDataFunction(false, effects.custList),
  // 获取产品列表
  getProductList: getDataFunction(false, effects.productList),
  // 获取匹配结果
  getMatchResult: getDataFunction(true, effects.matchResult),
  // 重置匹配结果
  resetMatchResult: getDataFunction(false, effects.resetMatchResult),
  // 重置客户列表和产品列表
  resetQueryList: getDataFunction(false, effects.resetQueryList),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class PreSaleQuery extends PureComponent {
  static propTypes = {
    custList: PropTypes.array.isRequired,
    productList: PropTypes.array.isRequired,
    matchResult: PropTypes.object.isRequired,
    getCustList: PropTypes.func.isRequired,
    getProductList: PropTypes.func.isRequired,
    getMatchResult: PropTypes.func.isRequired,
    resetMatchResult: PropTypes.func.isRequired,
    resetQueryList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 选中的客户
      selectedCustItem: {
        custCode: '',
        custName: '',
      },
      // 选中的产品
      selectedProductItem: {
        productCode: '',
        productName: '',
      },
      // 显示与隐藏合格投资者Modal
      isQualifiedCustModalVisible: false,
    };
  }

  @autobind
  handleQueryCustList(value) {
    if (!value) {
      message.warning('请输入经纪客户号/客户名称');
    } else {
      this.props.getCustList({ keywords: value, pstnId: emp.getPstnId() });
    }
  }

  @autobind
  handleQueryProductList(value) {
    if (!value) {
      message.warning('请输入产品代码/产品名称');
    } else {
      this.props.getProductList({ keywords: value, pstnId: emp.getPstnId() });
    }
  }

  @autobind
  handleSelectCustItem(obj) {
    this.setState({
      selectedCustItem: obj,
    });
  }

  @autobind
  handleSelectProductItem(obj) {
    this.setState({
      selectedProductItem: obj,
    });
  }

  @autobind
  handleSearch(e) {
    e.preventDefault();
    if (!this.state.selectedCustItem.custNumber) {
      message.warning('请选择经纪客户号/客户名称');
    } else if (!this.state.selectedProductItem.productCode) {
      message.warning('请选择产品代码/产品名称');
    } else {
      this.props.getMatchResult({
        custCode: this.state.selectedCustItem.custNumber,
        productCode: this.state.selectedProductItem.productCode,
      });
    }
  }

  @autobind
  handleReset() {
    this.setState({
      selectedCustItem: {},
      selectedProductItem: {},
      isQualifiedCustModalVisible: false,
    });
    this.props.resetMatchResult();
    this.props.resetQueryList();
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '合格投资者Modal' } })
  handleQualifiedCustModalHide() {
    this.setState({
      isQualifiedCustModalVisible: false,
    });
  }

  @autobind
  @logPV({ pathname: '/modal/qualifiedCust', title: '' })
  handleQualifiedCustModalShow() {
    this.setState({
      isQualifiedCustModalVisible: true,
    });
  }

  @autobind
  formatText(text) {
    return text && text.split('\r\n').map(item => <p>{item}</p>);
  }

  render() {
    const { matchResult } = this.props;
    const {
      custType = {
        fact: { },
      },
      matchTable = {
        fact: { result: [] },
      },
      contractSign = { fact: {} },
      qualifiedCust = {
        fact: { yxq: ' ', matchResult: ' ', totalAssets: ' ' },
      },
      doubleRecord = { fact: {} },
    } = matchResult;
    const columns = [
      {
        title: '类别',
        dataIndex: 'type',
      },
      {
        title: '客户信息',
        dataIndex: 'custInfo',
        render: this.formatText,
        width: '40%',
      },
      {
        title: '产品信息',
        dataIndex: 'productInfo',
      },
      {
        title: '匹配结果',
        dataIndex: 'result',
      },
    ];
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <SearchForm
            custList={this.props.custList}
            productList={this.props.productList}
            selectedCustItem={this.state.selectedCustItem}
            selectedProductItem={this.state.selectedProductItem}
            onSearch={this.handleSearch}
            onSelectCustItem={this.handleSelectCustItem}
            onQueryCustList={this.handleQueryCustList}
            onSelectProductItem={this.handleSelectProductItem}
            onQueryProductList={this.handleQueryProductList}
            onReset={this.handleReset}
          />
          <div className={styles.divider} />
          <div className={styles.resultWrap}>
            {/* 投资者类型 */}
            <div className={styles.list}>
              <h2 className={styles.listTitle}>
                <i className={styles.prefix} />
                <span className={styles.name}>投资者类型</span>
              </h2>
              <div className={styles.listContent}>
                <Row type="flex" className={styles.row}>
                  <Col span={7}>
                    <span className={styles.itemName}>类型：</span>
                    {
                      custType.fact.type &&
                        (<span className={styles.itemValue}>
                          {custType.fact.type}
                        </span>)
                    }
                  </Col>
                  {
                    custType.fact.typeCode !== 'general' &&
                      (<Col span={7} offset={1}>
                        <span className={styles.itemName}>有效期：</span>
                        <span className={styles.itemValue}>
                          {custType.fact.yxq}
                        </span>
                      </Col>)
                  }
                </Row>
                {
                  custType.msg &&
                    (<div className={styles.msg}>
                      <Icon type="tixing" className={styles.tixing} />
                      <span>{custType.msg}</span>
                    </div>)
                }
              </div>
            </div>
            <div className={styles.divider} />
            {/* 适当性匹配结果 */}
            <div className={styles.list}>
              <h2 className={styles.listTitle}>
                <i className={styles.prefix} />
                <span className={styles.name}>适当性匹配结果</span>
              </h2>
              <div className={styles.listContent}>
                <Row type="flex" className={styles.row}>
                  <Col span={7}>
                    <span className={styles.itemName}>风险测评有效期：</span>
                    {
                      matchTable.fact.yxq &&
                        (<span className={styles.itemValue}>
                          {matchTable.fact.yxq}
                        </span>)
                    }
                  </Col>
                </Row>
                {
                  matchTable.fact.result &&
                    (<Table
                      className={styles.table}
                      columns={columns}
                      dataSource={matchTable.fact.result}
                      pagination={false}
                      // 默认文案配置
                      locale={{
                        // 空数据时的文案
                        emptyText: '暂无数据',
                      }}
                    />)
                }
                {
                  matchTable.msg &&
                    (<div className={styles.msg}>
                      <Icon type="tixing" className={styles.tixing} />
                      <span>{matchTable.msg}</span>
                    </div>)
                }
              </div>
            </div>
            {/* 合同签署 */}
            {
              contractSign &&
                (<div>
                  <div className={styles.divider} />
                  <div className={styles.list}>
                    <h2 className={styles.listTitle}>
                      <i className={styles.prefix} />
                      <span className={styles.name}>合同签署</span>
                    </h2>
                    <div className={styles.listContent}>
                      <Row type="flex" className={styles.row}>
                        <Col span={7}>
                          <span className={styles.itemName}>产品要求：</span>
                          <span className={styles.itemValue}>
                            {contractSign.fact.requirement}
                          </span>
                        </Col>
                        <Col span={7} offset={1}>
                          <span className={styles.itemName}>客户签署情况：</span>
                          <span className={styles.itemValue}>
                            {contractSign.fact.signature}
                          </span>
                        </Col>
                      </Row>
                      {
                        contractSign.msg &&
                          (<div className={styles.msg}>
                            <Icon type="tixing" className={styles.tixing} />
                            <span>{contractSign.msg}</span>
                          </div>)
                      }
                    </div>
                  </div>
                </div>)
            }
            {/* 合格投资 */}
            {
              qualifiedCust &&
                (<div>
                  <div className={styles.divider} />
                  <div className={styles.list}>
                    <h2 className={styles.listTitle}>
                      <i className={styles.prefix} />
                      <span className={styles.name}>合格投资</span>
                    </h2>
                    <div className={styles.listContent}>
                      <Row type="flex" className={styles.row}>
                        <Col span={8}>
                          <span className={styles.itemName}>产品要求：</span>
                          <span className={styles.itemValue}>
                            {productRequirementMap[qualifiedCust.fact.productRequireMent]}
                            {
                              qualifiedCust.fact.productRequireMent &&
                                (<Icon
                                  type="wenhao"
                                  className={styles.wenhao}
                                  onClick={this.handleQualifiedCustModalShow}
                                />)
                            }
                          </span>
                        </Col>
                        <Col span={8}>
                          <span className={styles.itemName}>客户情况：</span>
                          <span className={styles.itemValue}>
                            {qualifiedCust.fact.custInfo}
                          </span>
                        </Col>
                        {
                          qualifiedCust.fact.yxq &&
                            (
                              <Col span={7}>
                                <span className={styles.itemName}>有效期：</span>
                                <span className={styles.itemValue}>
                                  {qualifiedCust.fact.yxq}
                                </span>
                              </Col>
                            )
                        }
                      </Row>
                      <Row type="flex" className={styles.row}>
                        {
                          qualifiedCust.fact.matchResult &&
                            (
                              <Col span={7}>
                                <span className={styles.itemName}>匹配结果：</span>
                                <span className={styles.itemValue}>
                                  {qualifiedCust.fact.matchResult}
                                </span>
                              </Col>
                            )
                        }
                        {
                          qualifiedCust.fact.totalAssets &&
                            (
                              <Col span={7} offset={qualifiedCust.fact.matchResult ? 1 : 0}>
                                <span className={styles.itemName}>总资产（万元）：</span>
                                <span className={styles.itemValue}>
                                  {qualifiedCust.fact.totalAssets}
                                </span>
                              </Col>
                            )
                        }
                      </Row>
                      {
                        qualifiedCust.msg &&
                          (<div className={styles.msg}>
                            <Icon type="tixing" className={styles.tixing} />
                            <span>{qualifiedCust.msg}</span>
                          </div>)
                      }
                    </div>
                  </div>
                </div>)
            }
            {/* 双录要求 */}
            {
              doubleRecord &&
                (<div>
                  <div className={styles.divider} />
                  <div className={styles.list}>
                    <h2 className={styles.listTitle}>
                      <i className={styles.prefix} />
                      <span className={styles.name}>双录要求</span>
                    </h2>
                    <div className={styles.listContent}>
                      <Row type="flex" className={styles.row}>
                        <Col span={7}>
                          <span className={styles.itemName}>客户双录情况：</span>
                          <span className={styles.itemValue}>
                            { doubleRecord.fact.isNeedDoubleRecord }
                          </span>
                        </Col>
                      </Row>
                      {
                        doubleRecord.msg &&
                          (<div className={styles.msg}>
                            <Icon type="tixing" className={styles.tixing} />
                            <span>{doubleRecord.msg}</span>
                          </div>)
                      }
                    </div>
                  </div>
                </div>)
            }
          </div>
        </div>
        <QualifiedCustModal
          visible={this.state.isQualifiedCustModalVisible}
          type={qualifiedCust ? qualifiedCust.fact.productRequireMent : null}
          title={
            qualifiedCust ? productRequirementMap[qualifiedCust.fact.productRequireMent] : null
          }
          onQualifiedCustModalHide={this.handleQualifiedCustModalHide}
        />
      </div>
    );
  }
}
