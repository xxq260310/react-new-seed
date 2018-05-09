/**
 * @fileOverview chartRealTime/ChartGeneralOptions.js
 * @author sunweibin
 * @description 柱状图图表的通用配置项
 */

const generalOptions = {
  // 堆叠柱状图使用的颜色
  stackBarColors: ['#3983ff', '#4adad5', '#756fb8', '#ff4e7b', '#ff784e', '#ffb24e', '#7f1de5', '#70c381', '#789262', '#70c381'],
  // 柱状图颜色
  barColor: '#108ee9',
  // 坐标轴的通用样式
  AxisOptions: {
    // splitNumber: 4,
    axisLine: {
      lineStyle: {
        color: '#e7eaec',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: '#999',
      },
    },
  },

  // grid
  gridOptions: {
    show: true,
    top: '0',
    left: '0',
    right: '40px',
    bottom: '20px',
    containLabel: true,
    borderWidth: '1',
    borderColor: '#e7eaec',
  },

  // 柱状阴影
  barShadow: {
    type: 'bar',
    itemStyle: {
      normal: {
        color: 'rgba(0,0,0,0.05)',
      },
    },
    barGap: '-100%',
    barCategoryGap: '30%',
    animation: false,
    barWidth: 6,
  },

  // 配置柱状图渐变
  createBarLinear(input) {
    const output = [];
    input.forEach((item) => {
      const bar = {
        name: 'no',
        value: item,
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgb(136,214,254)',
              }, {
                offset: 1, color: 'rgb(24,141,240)',
              }],
            },
          },
        },
      };
      output.push(bar);
    });
    return output;
  },
};

export default generalOptions;
