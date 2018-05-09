/**
 * @author sunweibin
 * @description 用来存放图表Tooltip的配置项
 */

// 堆叠柱状图的Tooltip配置
const stackTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'shadow',
  },
  backgroundColor: 'rgba(255, 255, 255, .9)',
  padding: [12, 11, 13, 13],
  extraCssText:
    `border-radius: 8px;
     box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),
              0 1px 18px 0 rgba(0,0,0,0.12),
              0 3px 5px -1px rgba(0,0,0,0.3);`,
  position(pos, params, dom, rect, size) {
    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    const obj = {};
    obj.top = pos[1] - size.contentSize[1];
    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
    return obj;
  },
};

export default { stackTooltip };
