/*
 * @Author: xuxiaoqin
 * @Date: 2017-11-14 13:27:16
 * @Last Modified by:   xuxiaoqin
 * @Last Modified time: 2017-11-14 13:27:16
 * 检查提示框的状态
 */

export default {};

// 检测提示信息展示状态
export const checkTooltipStatus = (target, name, descriptor) => {
  const origin = descriptor.value;

  return {
    ...descriptor,
    value(...args) {
      const { isShowTooltip } = this.state;
      if (!isShowTooltip) {
        this.setState({
          isShowTooltip: !isShowTooltip,
        });
      }
      origin.apply(this, args);
    },
  };
};
