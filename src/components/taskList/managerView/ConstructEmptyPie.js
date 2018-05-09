export default {};

export const constructEmptyPie = () => ({
  tooltip: {
    show: false,
  },
  series: [
    {
      name: '暂无数据',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true,
          position: 'center',
          fontSize: 14,
          color: '#a1a1a1',
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [
        { value: 0, name: '暂无数据' },
      ],
      itemStyle: {
        normal: {
          color: '#e2e2e2',
        },
      },
      silent: true,
    },
  ],
});
