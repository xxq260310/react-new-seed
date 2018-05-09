/**
 * @descripton 雷达图配置项
 * @author sunweibin
 */

const radarConfig = {
  legend: {
    data: [
      { name: '本期', icon: 'square' },
      { name: '上期', icon: 'square' },
    ],
    bottom: 0,
    left: '60px',
    itemGap: 20,
  },
  radarCommon: {
    radius: '75%',
    shape: 'circle',
    splitNumber: 6,
    center: ['50%', '50%'],
    name: {
      textStyle: {
        color: '#666666',
      },
    },
    nameGap: '6',
    splitLine: {
      lineStyle: {
        color: [
          '#ebf2ff',
        ].reverse(),
      },
    },
    splitArea: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#b9e7fd',
      },
    },
  },
  seriesCommon: {
    type: 'radar',
    smooth: true,
    symbolSize: 1,
  },
  currentRadar: {
    name: '本期',
    areaStyle: {
      normal: {
        color: 'rgba( 56, 216, 232, 0.2 )',
      },
    },
    itemStyle: {
      normal: {
        color: '#38d8e8',
        lineStyle: {
          color: 'rgb( 56, 216, 232 )',
          width: 1,
        },
      },
    },
  },
  contrastRadar: {
    name: '上期',
    areaStyle: {
      normal: {
        left: '10px',
        color: 'rgba( 117, 111, 184, 0.2 )',
      },
    },
    itemStyle: {
      normal: {
        color: '#756fb8',
        lineStyle: {
          color: 'rgb( 117, 111, 184 )',
          width: 1,
        },
      },
    },
  },
  currentLabel: {
    show: true,
    position: 'top',
    textStyle: {
      color: '#38d8e8',
    },
  },
  contrastLabel: {
    show: true,
    position: 'bottom',
    textStyle: {
      color: '#756fb8',
    },
  },
};

export default radarConfig;
