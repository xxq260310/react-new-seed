/**
 * @Author: sunweibin
 * @Date: 2017-11-22 15:24:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-22 13:43:35
 * @description 此处存放权限所依据的职责ID集合
 */
import duty from './duty';

const auth = {
  /**
   * 服务订购中的新建申请需要的各项职责集合
   */
  commission: {
    /**
     * 批量佣金调整申请需要的职责
     */
    batch: [duty.HTSC_PLYJSZ],
    /**
     * 单佣金调整的权限-1,此种权限需要必须是:岗位为服务岗
     */
    single_1: [duty.HTSC_ZHFW_YYBZXG, duty.HTSC_YYBFWG],
    /**
     * 单佣金调整的权限-2
     */
    single_2: [duty.HTSC_HLWFWJL],
    /**
     * 资讯订阅申请需要的职责
     */
    subscribe: [duty.HTSC_ZHFW_YYBZXG, duty.HTSC_YYBFWG, duty.HTSC_FWJL, duty.HTSC_HTGGST],
    /**
     * 资讯退订申请需要的职责
     */
    unsubscribe: [duty.HTSC_ZHFW_YYBZXG, duty.HTSC_YYBFWG, duty.HTSC_FWJL, duty.HTSC_HTGGST],
  },
};

export default auth;
