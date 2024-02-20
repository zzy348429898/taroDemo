import { Canvas, View } from "@tarojs/components";
import React, { useRef, useState, useEffect } from "react";
import echarts from "./echarts.js";
import WxCanvas from "./wx-canvas";
import style from "./index.module.less";
import uuid from "@/utils/uuid";
import classNames from "classnames";
import { isAlipay } from "@/utils/env";
import { getDpr, wrapTouch } from "./utils";
const _my = require("./api/index.js")(my);


interface Props {
  id: string;
  canvasId: string;
  ec: any;
  forceUseOldCanvas: boolean;
  init: (opt: { canvas: any; width: any; height: any}) => void;
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
    const ctx = _my.createCanvasContext(this.props.canvasId, this);
    this.ctx = ctx;
    const canvas = new WxCanvas(ctx, this.props.canvasId);
    echarts.setCanvasCreator(() => {
      return canvas;
    });
    // echarts.setPlatformAPI({
    //   createCanvas: () => {
    //     return canvas;
    //   },
    // });
    var query = _my.createSelectorQuery();
    const ratio = getDpr();
    query
      .select(`.${this.state.className}`)
      .boundingClientRect()
      .exec((res) => {
        let _w = ratio * res[0].width;
        let _h = ratio * res[0].height;
        let w = res[0].width;
        let h = res[0].height;
        this.setState((state) => ({ ...state, width: _w, height: _h }));
        if (typeof callback === "function") {
          this.chart = callback(canvas, w, h);
        } else if (
          this.props.ec &&
          typeof this.props.ec.onInit === "function"
        ) {
          this.chart = this.props.ec.onInit(canvas, w, h, getDpr());
        } else {
          this.props.init({
            canvas: canvas,
            width: w,
            height: h,
          });
        }
      });
  };

  canvasToTempFilePath = (opt) => {
    if (!opt.canvasId) {
      opt.canvasId = this.props.canvasId;
    }
    this.ctx.draw(true, () => {
      _my.canvasToTempFilePath(opt, this);
    });
  };

  touchStart = (e) => {
    if (this.chart && e.touches.length > 0) {
      var touch = e.touches[0];
      var handler = this.chart.getZr().handler;
      handler.dispatch("mousedown", {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.dispatch("mousemove", {
        zrX: touch.x,
        zrY: touch.y,
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
      });
      handler.dispatch("click", {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), "end");
    }
  };

  // ready
  componentDidMount(): void {
    if (!this.props.ec) {
      console.warn(
        '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' +
          'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>'
      );
      return;
    }

    if (!this.props.ec.lazyLoad) {
      setTimeout(() => this.init(), 200)
    }
  }
  render(): React.ReactNode {
    return (
      <Canvas
        id={this.props.canvasId}
        canvasId={this.props.canvasId}
        className={classNames(style["ec-canvas"], this.state.className)}
        disableScroll={false}
        onTouchStart={this.props.ec?.disableTouch ? undefined : this.touchStart}
        onTouchMove={this.props.ec?.disableTouch ? undefined : this.touchMove}
        onTouchEnd={this.props.ec?.disableTouch ? undefined : this.touchEnd}
        type="2d"
      ></Canvas>
    );
  }
}
export default EcCanvas;
