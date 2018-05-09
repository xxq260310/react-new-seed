/**
 *@file customerPool/CustomerGrouplist
 *客户分组列表
 *@author zhuyanwen
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Table from '../../common/commonTable';
import tableStyles from '../../common/commonTable/index.less';
import './customerGrouplist.less';

const renderColumnTitle = [
  {
    key: 'groupName',
    value: '分组名称',
  },
  {
    key: 'xComments',
    value: '分组描述',
  },
  {
    key: 'relatCust',
    value: '客户数',
  },
  {
    key: 'createdTm',
    value: '创建时间',
  },
];
export default class CustomerGrouplist extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    pageData: PropTypes.object.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    onSingleRowSelectionChange: PropTypes.func.isRequired,
    currentSelectRowKeys: PropTypes.array.isRequired,
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.groupId }));
    }

    return [];
  }

  render() {
    const {
      data,
      onRowSelectionChange,
      onSingleRowSelectionChange,
      currentSelectRowKeys,
      pageData,
      onSizeChange,
      onPageChange,
    } = this.props;

    const dataSource = this.addIdToDataSource(data);

    return (
      <div className={'customerGrouplistTable'}>
        <Table
          pageData={pageData}
          listData={dataSource}
          onSizeChange={onSizeChange}
          onPageChange={onPageChange}
          tableClass={
            classnames({
              [tableStyles.groupTable]: true,
            })
          }
          // 构造表格头部
          titleColumn={renderColumnTitle}
          columnWidth={['30%', '25%', '15%', '20%']}
          isNeedRowSelection
          onSingleRowSelectionChange={onSingleRowSelectionChange}
          onRowSelectionChange={onRowSelectionChange}
          currentSelectRowKeys={currentSelectRowKeys}
        />
      </div>
    );
  }

}
