/*
 * @Description: 降级客户处理页面
 * @Author: LiuJianShu
 * @Date: 2017-12-06 14:45:44
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-03-05 09:38:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';

import Button from '../../components/common/Button';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import fspPatch from '../../decorators/fspPatch';
import { time } from '../../helper';
import withRouter from '../../decorators/withRouter';
import config from './config';
import styles from './home.less';
import logable from '../../decorators/logable';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  custList: state.demote.custList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
// 获取左侧列表
  getCustList: fetchDataFunction(true, 'demote/getCustList'),
  // 获取客户列表
  updateCust: fetchDataFunction(true, 'demote/updateCust'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
@fspPatch()
export default class Demote extends PureComponent {
  static propTypes = {
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    updateCust: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    // 从 sessionStorage 中找此字段判断是否成功提交过，供前端判断是否显示数据用
    const clicked = sessionStorage.getItem('demoteClicked') || false;
    this.state = {
      currentPage: 1,
      pageSize: 10,
      data: [],
      clicked,
    };
  }

  componentDidMount() {
    const { getCustList } = this.props;
    getCustList({});
  }

  componentWillReceiveProps(nextProps) {
    const { custList: preCL } = this.props;
    const { custList: nextCL } = nextProps;
    if (preCL !== nextCL) {
      this.setState({
        data: nextCL,
      });
    }
  }

  @autobind
  onChange(page, pageSize) {
    this.setState({
      currentPage: page,
      pageSize,
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  onSubmit() {
    const { location: { query: { notifiId } }, updateCust } = this.props;
    const { data } = this.state;
    const checkedData = _.filter(data, o => !o.checked);
    const result = checkedData.map(item => item.econNum);
    const payload = {
      cust: result,
      notifiId,
      time: data[0].time,
    };
    updateCust(payload).then(() => {
      message.success('操作成功');
      // 设置 sessionStorage ，以此字段判断是否成功提交过，供前端判断是否显示数据用
      sessionStorage.setItem('demoteClicked', true);
      this.setState({
        clicked: true,
      });
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'Page为$args[0]' } })
  handlePageChange(page, pageSize) {
    this.onChange(page, pageSize);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: 'PageSize为$args[1]' } })
  handlePageSizeChange(page, pageSize) {
    this.onChange(page, pageSize);
  }

  // 切换表格的 switch 事件
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '降级客户处理是否划转',
    },
  })
  checkTableData(checked, record, index) {
    const { data, currentPage, pageSize } = this.state;
    const newData = [...data];
    const idx = ((currentPage - 1) * pageSize) + index;
    newData[idx] = {
      ...newData[idx],
      checked,
    };
    this.setState({
      data: newData,
    });
  }

  render() {
    const operation = {
      column: {
        key: 'switch',
        title: '是否划转',
      },
      operate: this.checkTableData,
    };
    const { data, clicked } = this.state;
    const noData = _.isEmpty(data);
    const date = noData ? '' : moment(time.format(data[0].endDate));
    if (noData || clicked) {
      return (
        <div className={styles.demoteWrapper}>
          <h2>您的划转操作正在进行中或者您暂时没有可以划转为零售的客户。</h2>
        </div>
      );
    }
    return (
      <div className={styles.demoteWrapper}>
        <h2 className={styles.title}>
          <span>提醒：</span>
          <span>{date.year()}年度，您名下有以下客户将降级划转为零售客户，请确认！<br />
            超过{date.format('YYYY年MM月DD日')}，未做确认，系统将自动划转！</span>
        </h2>
        <CommonTable
          data={data}
          titleList={config.titleList}
          operation={operation}
          pagination={{
            size: 'small',
            total: data.length,
            defaultPageSize: 10,
            current: this.state.currentPage,
            onChange: this.handlePageChange,
            onShowSizeChange: this.handlePageSizeChange,
            showSizeChanger: true,
          }}
        />
        <div className={styles.btnDiv}>
          <Button
            type="primary"
            onClick={this.onSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
