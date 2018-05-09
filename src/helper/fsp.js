/*
 * @Description: 操作fsp相关方法
 * @Author: XiaZhiQiang
 * @Date: 2018/1/31 18:18
 * @Last Modified by: XiaZhiQiang
 * @Last Modified time: 2018/1/31 18:18
 */
import { fspContainer } from '../config';

const fsp = {
  /**
   * 操作fsp返回顶部
   * @author XiaZhiQiang
   * @returns {void}
   */
  scrollToTop() {
    const fspBody = document.querySelector(fspContainer.container);
    if (fspBody) {
      fspBody.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  },
};

export default fsp;
