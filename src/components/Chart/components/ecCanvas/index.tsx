import { Canvas, View } from "@tarojs/components";
import React, { useRef, useState, useEffect } from "react";
import * as echarts from "./echarts";
import { canUseNewCanvasFn, compareVersion, wrapTouch } from "./utils";
import Taro from "@tarojs/taro";
import WxCanvas from "./wx-canvas";
import style from "./index.module.less";
import uuid from "@/utils/uuid";
import classNames from "classnames";
import { isAlipay, isWeApp } from "@/utils/env";
interface Props {
  id: string;
  canvasId: string;
  ec: any;
  forceUseOldCanvas: boolean;
  init: (opt: { canvas: any; width: any; height: any; canvasDpr: any }) => void;
}
interface State {
  isUseNewCanvas: boolean;
  className: string;
}
class EcCanvas extends React.Component<Props, State> {
  ctx: any;
  chart: any;
  canvasNode: any;
  canvasRef: React.RefObject<unknown>;
  constructor(props) {
    super(props);
    this.state = {
      isUseNewCanvas: true,
      className: `ec4${uuid()}`,
    };
    this.canvasRef = React.createRef();
  }
  // methods
  init = (callback) => {
    const canUseNewCanvas = canUseNewCanvasFn();
    const forceUseOldCanvas = this.props.forceUseOldCanvas;
    const isUseNewCanvas = canUseNewCanvas && !forceUseOldCanvas;
    this.setState((state) => ({ ...state, isUseNewCanvas }));
    if (forceUseOldCanvas && canUseNewCanvas) {
      console.warn("开发者强制使用旧canvas,建议关闭");
    }
    if (isUseNewCanvas) {
      this.initByNewWay(callback)
    } else {
      const isValid = compareVersion(Taro.getSystemInfoSync().SDKVersion, "1.9.91") >= 0;
      if (!isValid) {
        console.error(
          "微信基础库版本过低，需大于等于 1.9.91。参见：https://github.com/ecomfe/echarts-for-weixin#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82"
        );
        return;
      } else {
        console.warn(
          "建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能"
        );
        this.initByOldWay(callback);
      }
    }
  };
  initByOldWay = (callback) => {
    this.ctx.current = Taro.createCanvasContext(this.props.canvasId, this);
    const canvas = new WxCanvas(this.ctx.current, this.props.canvasId, false);
    echarts.setCanvasCreator(() => {
      return canvas;
    });
    const canvasDpr = 1;
    const query = Taro.createSelectorQuery().in(this);
    // const query = Taro.createSelectorQuery();
    query
      .select(`.${this.state.className}`)
      .boundingClientRect((res) => {
        if (typeof callback === "function") {
          this.chart = callback(canvas, res.width, res.height, canvasDpr);
        } else if (
          this.props.ec &&
          typeof this.props.ec?.onInit === "function"
        ) {
          this.chart = this.props.ec?.onInit(
            canvas,
            res.width,
            res.height,
            canvasDpr
          );
        } else {
          this.props.init({
            canvas: canvas,
            width: res.width,
            height: res.height,
            canvasDpr: canvasDpr,
          });
        }
      })
      .exec();
  };
  initByNewWay = (callback) => {
    const queryCbWx = (res) => {
      const canvasNode = res[0].node;
      this.canvasNode = canvasNode;
      const canvasDpr = Taro.getSystemInfoSync().pixelRatio;
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height;
      const ctx = canvasNode.getContext("2d");
      debugger
      const canvas = new WxCanvas(ctx, this.props.canvasId, true, canvasNode);
      echarts.setCanvasCreator(() => {
        return canvas;
      });
      if (typeof callback === "function") {
        this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
      } else if (
        this.props.ec &&
        typeof this.props.ec?.onInit === "function"
      ) {
        this.chart = this.props.ec?.onInit(
          canvas,
          canvasWidth,
          canvasHeight,
          canvasDpr
        );
      } else {
        this.props.init({
          canvas: canvas,
          width: res.width,
          height: res.height,
          canvasDpr: canvasDpr,
        });
      }
    }
    const queryCbAliPay = (res) => {
      debugger;
      const canvasNode = res[0].node;
      this.canvasNode = canvasNode;
      const canvasDpr = Taro.getSystemInfoSync().pixelRatio;
      const canvasWidth = res[0].width;
      const canvasHeight = res[0].height;
      const ctx =  Taro.createCanvasContext(this.props.canvasId);
      const canvas = new WxCanvas(ctx, this.props.canvasId, true, canvasNode);
      echarts.setCanvasCreator(() => {
        return canvas;
      });
      if (typeof callback === "function") {
        this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
      } else if (
        this.props.ec &&
        typeof this.props.ec?.onInit === "function"
      ) {
        this.chart = this.props.ec?.onInit(
          canvas,
          canvasWidth,
          canvasHeight,
          canvasDpr
        );
      } else {
        this.props.init({
          canvas: canvas,
          width: res.width,
          height: res.height,
          canvasDpr: canvasDpr,
        });
      }
    }
    const query = Taro.createSelectorQuery();
    if(isAlipay()){
      query
      .select(`.${this.state.className}`)
      .boundingClientRect(queryCbAliPay);
    } else{
      query
      .select(`.${this.state.className}`)
      .fields({ node: true, size: true })
      .exec(queryCbWx);
    }

  };
  canvasToTempFilePath = (opt) => {
    if (this.state.isUseNewCanvas) {
      const query = Taro.createSelectorQuery();
      query
        .select(`.${this.state.className}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvasNode = res[0].node;
          opt.canvas = canvasNode;
          Taro.canvasToTempFilePath(opt);
        });
    } else {
      if (!opt.canvasId) {
        opt.canvasId = this.props.canvasId;
      }
      this.ctx.current.draw(true, () => {
        Taro.canvasToTempFilePath(opt, this);
      });
    }
  };
  touchStart = (e) => {
    if (this.chart && e.touches.length > 0) {
      var touch = e.touches[0];
      var handler = this.chart.getZr().handler;
      handler.dispatch("mousedown", {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => {},
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      });
      handler.dispatch("mousemove", {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => {},
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      });
      handler.processGesture(wrapTouch(e), "start");
    }
  };
  touchMove = (e) => {
    if (this.chart && e.touches.length > 0) {
      var touch = e.touches[0];
      var handler = this.chart.getZr().handler;
      handler.dispatch("mousemove", {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => {},
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      });
      handler.processGesture(wrapTouch(e), "change");
    }
  };
  touchEnd = (e) => {
    if (this.chart) {
      const touch = e.changedTouches ? e.changedTouches[0] : {};
      var handler = this.chart.getZr().handler;
      handler.dispatch("mouseup", {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => {},
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      });
      handler.dispatch("click", {
        zrX: touch.x,
        zrY: touch.y,
        preventDefault: () => {},
        stopImmediatePropagation: () => {},
        stopPropagation: () => {},
      });
      handler.processGesture(wrapTouch(e), "end");
    }
  };
  // ready
  componentDidMount(): void {
    echarts.registerPreprocessor((option) => {
      if (option && option.series) {
        if (option.series.length > 0) {
          option.series.forEach((series) => {
            series.progressive = 0;
          });
        } else if (typeof option.series === "object") {
          option.series.progressive = 0;
        }
      }
    });
    if (!this.props.ec) {
      console.warn(
        '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>'
      );
      return;
    }
    if (!this.props.ec?.lazyLoad) {
      this.init();
    }
  }
  render(): React.ReactNode {
    if (this.state.isUseNewCanvas) {
      // 新的：接口对其了H5
      return (
        <Canvas
          ref={this.canvasRef}
          id={this.props.canvasId}
          canvasId={this.props.canvasId}
          type="2d"
          className={classNames(style["ec-canvas"], this.state.className)}
          onTouchStart={
            this.props.ec?.disableTouch ? undefined : this.touchStart
          }
          onTouchMove={this.props.ec?.disableTouch ? undefined : this.touchMove}
          onTouchEnd={this.props.ec?.disableTouch ? undefined : this.touchEnd}
        ></Canvas>
      );
    } else {
      // 旧的
      return (
        <Canvas
          ref={this.canvasRef}
          id={this.props.canvasId}
          canvasId={this.props.canvasId}
          className={classNames(style["ec-canvas"], this.state.className)}
          onTouchStart={
            this.props.ec?.disableTouch ? undefined : this.touchStart
          }
          onTouchMove={this.props.ec?.disableTouch ? undefined : this.touchMove}
          onTouchEnd={this.props.ec?.disableTouch ? undefined : this.touchEnd}
          type="2d"
        ></Canvas>
      );
    }
  }
}
export default EcCanvas;
