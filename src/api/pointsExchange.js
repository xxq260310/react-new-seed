/**
 * @Description: 积分兑换产品历史查询相关接口
 * @Author: 张俊丽
 * @Date: 2018-04-10 14:35:50
 * @Last Modified by: 张俊丽
 * @Last Modified time: 2018-04-10 15:47:13
 */

export default function pointsExchange(api) {
  return {
    // 积分兑换产品历史查询
    getExchangeHistory: query => api.post('/groovynoauth/fsp/campaign/queryPageLoyaltyOrder', query),
  };
}
