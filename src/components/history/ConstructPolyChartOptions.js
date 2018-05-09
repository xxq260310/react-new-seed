/**
 * by xuxiaoqin
 * ConstructPolyChartOptions.js
 */
export default {};

export const constructPolyChartOptions = (option = {}) => {
  const {
    xAxisTickArea,
    current,
    previous,
    yAxisMin,
    yAxisMax,
    onAxisPointerMouseMove,
  } = option;

  const polyChartOptions = {
    tooltip: {
      trigger: 'axis',
      show: true,
      axisPointer: {
        type: 'line',
        label: {
          formatter(params) {
            // console.log(params);
            onAxisPointerMouseMove(params);
          },
        },
        lineStyle: {
          color: '#108ee9',
        },
      },
      showContent: false,
      snap: true,
    },
    // legend: {
    //   data: [
    //     {
    //       name: '本期',
    //       icon: 'square',
    //     },
    //     {
    //       name: '上期',
    //       icon: 'square',
    //     },
    //   ],
    //   bottom: 0,
    //   left: '10%',
    //   itemGap: 10,
    // },
    grid: {
      top: '20px',
      left: '20px',
      right: '80px',
      bottom: '40px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        // axisPointer: {
        //   status: true,
        // },
        axisLabel: {
          textStyle: {
            color: '#a1a1a1',
            fontSize: 12,
            // align: 'left',
          },
          margin: 15,
          showMinLabel: false,
        },
        splitLine: {
          show: false,
        },
        data: xAxisTickArea,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        // splitLine: {
        //   show: false,
        // },
        axisLabel: {
          textStyle: {
            color: '#a1a1a1',
            fontSize: 12,
          },
          margin: 15,
        },
        min: yAxisMin,
        max: yAxisMax,
      },
    ],
    series: [
      {
        name: '本期',
        type: 'line',
        areaStyle: {
          normal: {
            color: '#d7f7fa',
          },
        },
        smooth: true,
        lineStyle: {
          normal: {
            color: '#38d8e8',
            width: 1,
          },
        },
        itemStyle: {
          normal: {
            opacity: 0,
            color: '#38d8e8',
          },
          emphasis: {
            color: '#38d8e8',
            opacity: 1,
            borderColor: '#ffffff',
          },
        },
        symbolSize: 6,
        data: current,
        stack: null,
      },
      {
        name: '上期',
        type: 'line',
        stack: null, // 不要堆叠
        areaStyle: {
          normal: {
            color: '#c3dced',
          },
        },
        lineStyle: {
          normal: {
            color: '#756fb8',
            width: 1,
          },
        },
        itemStyle: {
          normal: {
            opacity: 0,
            color: '#756fb8',
          },
          emphasis: {
            color: '#756fb8',
            opacity: 1,
            borderColor: '#ffffff',
          },
        },
        symbolSize: 6,
        smooth: true,
        data: previous,
      },
    ],
  };

  return polyChartOptions;
};
