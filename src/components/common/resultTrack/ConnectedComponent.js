/*
 * @Author: xuxiaoqin
 * @Date: 2018-01-08 10:39:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-09 14:44:15
 * 将公用的获取数据的方法通过connect单独生成connect组件
 * 避免在组件被引用多次的时候，需要传入很多次公用方法
 */

import { connect } from 'dva';
import ResultTrack from './index';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 一级指标目标数据
  indicatorTargetData: state.customerPool.indicatorData,
  // 搜索出来的产品列表
  searchedProductList: state.customerPool.productList,
});

const mapDispatchToProps = {
  // 查询一级指标数据
  queryIndicatorData: fetchDataFunction(true, 'customerPool/queryIndicatorData'),
  // 查询产品
  queryProduct: fetchDataFunction(true, 'customerPool/queryProduct'),
};

// withRef暴露被包裹组件给引用的组件
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(ResultTrack);
