// ui
import TaroChart, { ChartProps, Option } from './index'

export default class LineChart extends TaroChart<ChartProps> {
  getChartOption(): Option {
    const { option } = this.props
    const { series = [], xAxis = {}, yAxis = {}, grid = {}, ...other } = option

    return {
      // tooltip: {
      //   trigger: 'axis',
      //   backgroundColor: 'rgba(0,0,0,0.7)',
      //   textStyle: {
      //     height: 48
      //   },
      //   padding: 8,
      //   axisPointer: {
      //     lineStyle: {
      //       color: '#e6e6e6'
      //     }
      //   }
      // },
      grid: {
        top: 10,
        bottom: '10%',
        left: '10%',
        right: 10,
        ...grid
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: '#f2f2f2'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        },
        splitLine: {
          lineStyle: {
            color: '#e6e6e6',
            type: 'dashed'
          }
        },
        ...xAxis
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        },
        splitLine: {
          lineStyle: {
            color: '#e6e6e6',
            type: 'dashed'
          }
        },
        ...yAxis
      },
      series: series || [],
      ...other
    }
  }
}
