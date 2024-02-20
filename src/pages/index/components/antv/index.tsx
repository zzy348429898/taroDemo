import { jsx, Canvas, Chart, Axis, Interval, Tooltip } from "@antv/f2";
import Taro, { useReady } from "@tarojs/taro";
import React from "react";
import style from "./index.module.less";
import { auto } from "@/lib/f2-context";
import F2Canvas from "@/components/j-canvas";
const AntvDemo = () => {
  const initAntv = (config) => {
    // F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
    const data = [
      { genre: "Sports", sold: 275 },
      { genre: "Strategy", sold: 115 },
      { genre: "Action", sold: 120 },
      { genre: "Shooter", sold: 350 },
      { genre: "Other", sold: 150 },
    ];
    const { props } = (
      <F2Canvas {...config}>
        <Chart data={data}>
          <Axis field="genre" />
          <Axis field="sold" />
          <Interval x="genre" y="sold" color="genre" />
          <Tooltip />
        </Chart>
      </F2Canvas>
    );
    const canvas = new F2Canvas(props);
    canvas.render();
  };
  return <F2Canvas onInit={initAntv} className={style.antv}></F2Canvas>;
};
export default AntvDemo;
