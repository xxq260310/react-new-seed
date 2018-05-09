/**
 * @description 历史排名图表通用配置
 * @author sunweibin
 */

const chartOptions = {
  // 堆叠柱状图使用的颜色
  stackBarColors: ['#3983ff', '#4adad5', '#756fb8', '#ff4e7b', '#ff784e', '#ffb24e', '#7f1de5', '#70c381', '#789262', '#70c381'],
  // 柱状图颜色
  barColor: '#108ee9',
  // y轴样式
  yAxis: {
    type: 'category',
    inverse: true,
    show: false,
    axisLabel: {
      show: false,
    },
    axisTick: { show: false },
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#e7eaec',
      },
    },
  },
  // x轴样式
  xAxis: {
    type: 'value',
    scale: true,
    splitNumber: 6,
    axisLine: {
      show: false,
      onZero: true,
      lineStyle: {
        color: '#e7eaec',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#e7eaec',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#999',
      },
    },
    splitLine: {
      show: false,
    },
  },
  // 坐标轴样式
  chartGrid: [
    {
      show: false,
      top: '0',
      left: '20px',
      right: '40px',
      bottom: '20px',
      containLabel: false,
      borderWidth: '1',
      borderColor: '#e7eaec',
    },
    {
      show: false,
      top: '0',
      left: '20px',
      right: '40px',
      bottom: '20px',
      containLabel: false,
      borderWidth: '1',
      borderColor: '#e7eaec',
      z: 10,
    },
  ],
  chartTooltip: {
    show: true,
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'transparent',
      },
    },
    backgroundColor: 'rgba(255, 255, 255, .9)',
    padding: [12, 11, 13, 13],
    position(pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      const obj = {};
      const ch = size.contentSize[1];
      const y = pos[1];
      const vh = size.viewSize[1];
      let top = y - (ch / 2);
      if (y < ch) {
        top = y + 30;
      } else if (y > (vh - ch)) {
        top = vh - ch;
      }
      obj.top = top;
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 10;
      return obj;
    },
    extraCssText:
      `border-radius: 8px;
       box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14),
                0 1px 18px 0 rgba(0,0,0,0.12),
                0 3px 5px -1px rgba(0,0,0,0.3);`,
  },
};

const stackTootip = {
  ...chartOptions.chartTooltip,
};

export default { ...chartOptions, stackTootip };
