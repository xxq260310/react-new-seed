/*
 * @Description: 积分兑换产品历史查询报表
 * @Author: zhangjunli
 * @Date: 2018-4-10 13:47:16
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { Form, Input, Button, Row, Col, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import DateRangePicker from '../../components/common/dateRangePicker';
import Pagination from '../../components/common/Pagination';
import withRouter from '../../decorators/withRouter';
import styles from './home.less';

const FormItem = Form.Item;
const create = Form.create;
const dateFormat = 'YYYY/MM/DD';
const defaultParam = {
  pageNum: 1,
  productCode: '',
  brokerNumber: '',
  startTime: '',
  endTime: '',
};

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

function columns() {
  return [{
    title: '经纪客户号',
    key: 'brokerNumber',
    dataIndex: 'brokerNumber',
    width: '10%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '产品代码',
    dataIndex: 'productCode',
    key: 'productCode',
    width: '10%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '15%',
    render: item => (
      <div
        title={formatString(item)}
        className={styles.nameColum}
      >{formatString(item)}</div>
    ),
  }, {
    title: '兑换数量',
    dataIndex: 'exchangeNum',
    key: 'exchangeNum',
    width: '10%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '兑换日期',
    dataIndex: 'exchangeDate',
    key: 'exchangeDate',
    width: '10%',
    render: item => (<span>{moment(item).format('YYYY-MM-DD') || '--'}</span>),
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: '10%',
    render: item => (<span>{formatString(item)}</span>),
  }, {
    title: '服务营业部',
    dataIndex: 'orgName',
    key: 'orgName',
    width: '15%',
    render: item => (
      <div
        className={styles.nameColum}
        title={formatString(item)}
      >
        {formatString(item)}
      </div>
    ),
  }];
}

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  exchangeData: state.pointsExchange.exchangeData,
});

const mapDispatchToProps = {
  getExchangeList: fetchDataFunction(true, 'pointsExchange/getExchangeHistory'),
};

@create()
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends Component {
  static propTypes = {
    exchangeData: PropTypes.object,
    form: PropTypes.object.isRequired,
    getExchangeList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    exchangeData: {},
  }

  constructor(props) {
    super(props);
    this.state = defaultParam;
  }

  // 发送请求
  componentDidMount() {
    this.props.getExchangeList(defaultParam);
  }

  // 只能选择最近3个月的
  @autobind
  setDisableRange(date) {
    return date <= moment().subtract(3, 'months')
   || date >= moment();
  }

  // DateRangePicker 组件，不支持value属性，故不能用 Form 组件的 getFieldDecorator，需要单独处理选中和清除事件
  @autobind
  handleCreateDateChange(date) {
    const { startDate, endDate } = date;
    const startTime = _.isEmpty(startDate) ? '' : startDate.format(dateFormat);
    const endTime = _.isEmpty(endDate) ? '' : endDate.format(dateFormat);
    this.setState({
      startTime,
      endTime,
    });
  }

  @autobind
  handlePageChange(page) {
    const { getExchangeList } = this.props;
    this.setState(
      { pageNum: page },
      () => {
        getExchangeList({
          ...this.state,
          pageNum: page,
        });
      },
    );
  }

  @autobind
  handleSearch(e) {
    e.preventDefault();
    const { getExchangeList } = this.props;
    const { startTime, endTime } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { productCode = '', brokerNumber = '' } = values;
        const fieldValue = {
          productCode: _.isEmpty(productCode) ? '' : productCode,
          brokerNumber: _.isEmpty(brokerNumber) ? '' : brokerNumber,
          pageNum: 1,
          startTime,
          endTime,
        };
        const lastValue = { ...this.state, pageNum: 1 };
        // 过滤请求的条件相同的情况
        if (lastValue !== fieldValue) {
          this.setState(
            { productCode, brokerNumber },
            () => {
              getExchangeList({ ...fieldValue });
            },
          );
        }
      }
    });
  }

  @autobind
  drpWraperRef(input) {
    this.datePickRef = input;
  }

  @autobind
  handleReset() {
    this.props.form.resetFields();
    this.datePickRef.clearAllDate();
    const resetValue = _.omit(defaultParam, 'pageNum');
    this.setState({ ...resetValue });
  }

  render() {
    const { exchangeList, page = {} } = this.props.exchangeData || {};
    const { totalRecordNum = 1 } = page;
    const { getFieldDecorator } = this.props.form;
    const { curPageNum = 1 } = this.state;
    const paganationOption = {
      current: curPageNum,
      pageSize: 10,
      total: _.toNumber(totalRecordNum) || 1,
      onChange: this.handlePageChange,
    };
    return (
      <div className={styles.exchangeContainer}>
        <div className={styles.exchangeContent}>
          <div className={styles.headContainer}>
            <div className={styles.headLine}>积分兑换产品历史查询报表</div>
          </div>
          <Form className={styles.form} layout="inline" onSubmit={this.handleSearch}>
            <Row>
              <Col span={8}>
                <FormItem label={'产品代码'}>
                  {getFieldDecorator('productCode')(<Input className={styles.input} />)}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label={'经纪客户号'}>
                  {getFieldDecorator('brokerNumber')(<Input className={styles.input} />)}
                </FormItem>
              </Col>
              <Col span={8} className={styles.datePick} style={{ textAlign: 'right' }}>
                <FormItem label="兑换时间">
                  <DateRangePicker
                    ref={this.drpWraperRef}
                    disabledRange={this.setDisableRange}
                    onChange={this.handleCreateDateChange}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.buttonRow}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.btn}
                >查询</Button>
                <Button
                  onClick={this.handleReset}
                  className={styles.btn}
                >重置</Button>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey={'rowId'}
            columns={columns()}
            dataSource={exchangeList}
            pagination={false}
            className={styles.table}
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

