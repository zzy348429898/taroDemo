import React, { Component } from "react";
import * as echarts from "./components/ecCanvas/echarts";
import { isH5 } from "@/utils/env";
import isEqual from "lodash/isEqual";
import { View } from "@tarojs/components";
import invoke from "lodash/invoke";
import EcCanvas from "./components/ecCanvas";
export type Chart = Record<string, any>;
export type Option = Record<string, any>;

export interface ChartProps {
  option: Option;
  width: string;
  height: string;
}

// 默认配置
export const ECHARTS_CONFIG = {
  RATIO: 2, // 分辨率
  REFRESH_DELAY: 800, // 刷新延迟。小程序需要久一点
};

/**
 * 创建网页的图表
 * @param chartOption
 * @param domId
 */
function createWebChart(chartOption: Option, domId: string): Chart {
  let chart = {};
  const $area = document.getElementById(domId);
  if ($area) {
    chart = echarts.init($area);
    chart.setOption(chartOption);
  }
  return chart;
}

/**
 * 创建小程序的图表构建函数
 * @param option
 * @param callback 成功后，返回实例
 */
function createWeAppChartInitialtor(
  option: Option,
  callback: (chart: Chart) => void
) {
  return function initChart(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width,
      height,
      devicePixelRatio: dpr, // 像素
    });
    canvas.setChart(chart);

    chart.setOption(option);
    callback && callback(chart);
    return chart;
  };
}

export default abstract class TaroChart<T> extends Component<T> {
  static id = 0; // 多个表格时候区分
  id: number;
  chart: Chart;
  ec: any; // 小程序专用
  refreshCallback: () => void; // 刷新后的回调

  constructor(props) {
    super(props);
    const option = this.getChartOption();
    const callback = (chart) => {
      this.chart = chart;
    };
    const initChartAfterMount = () => {
      if (isH5()) {
        this.chart = createWebChart(option, this.getDomId());
      }
      this.refresh();
    };
    const bindId = (): void => {
      this.id = TaroChart.id;
      TaroChart.id += 1;
    };

    bindId();
    this.ec = {
      onInit: createWeAppChartInitialtor(option, callback),
    };
    // 多刷新了一次，先注释
    // setTimeout(initChartAfterMount, ECHARTS_CONFIG.REFRESH_DELAY);
  }
  abstract getChartOption(): Option;
  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.option, prevProps.option)) {
      this.refresh();
    }
  }
  refresh(): void {
    if (this.chart) {
      const option = this.getChartOption();
      invoke(this.chart, "clear");
      this.chart.setOption(option);
      setTimeout(() => this.refreshCallback && this.refreshCallback(), 0);
    }
  }

  getDomId(): string {
    return `chart-area-${this.id}`;
  }

  render() {
    const { height, width } = this.props;
    const domId = this.getDomId();
    return isH5() ? (
      <View id={domId} style={{ height, width }} />
    ) : (
      <View style={{ height, width }}>
        <EcCanvas id={domId} canvasId={domId} ec={this.ec} type="2d" />
      </View>
    );
  }
}
