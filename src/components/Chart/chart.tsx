// ui
import TaroChart, { ChartProps, Option } from './index'

export default class LineChart extends TaroChart<ChartProps> {
  getChartOption(): Option {
    const { option } = this.props
    return option
  }
}
