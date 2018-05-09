/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-01 14:56:05
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-11 10:34:51
 * redux连接的创建服务记录
 */

import { connect } from 'dva';
import CreateServiceRecord from './CreateServiceRecord';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // uuid
  custUuid: state.performerView.custUuid,
  // 删除附件结果
  deleteFileResult: state.performerView.deleteFileResult,
});

const mapDispatchToProps = {
  // 获取uuid
  queryCustUuid: fetchDataFunction(true, 'performerView/queryCustUuid'),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceRecord);
