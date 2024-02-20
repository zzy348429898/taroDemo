import { View, Text, Canvas } from "@tarojs/components";
import Taro, { useLoad, useReady } from "@tarojs/taro";
import Chart from "@/components/Chart/chart";
import ChartAlipay from "@/components/ChartAlipay/chart";
import style from "./index.module.less";
import "./index.less";
import { isAlipay, isWeApp } from "@/utils/env";
import { useEffect } from "react";
import QRCode from "@/lib/qrcode";
import AntvDemo from "./components/antv";
import VChartDemo from "./components/vChart";
import BarChart from "./components/antv/bar";
export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });
  const data = {
    categories: ["Category 1", "Category 2", "Category 3"],
    series: [
      {
        name: "Series 1",
        data: [10, 20, 30],
      },
    ],
  };
  const drawQrcode = () => {
    Taro.createSelectorQuery()
      .select("#qrCode")
      .fields({ node: true, size: true })
      .exec((res) => {
        const qrCode = new QRCode(res[0].node, {
          width: 256,
          height: 256,
          typeNumber: 4,
          colorDark: "#000000",
          colorLight: "#ffffff",
        });
        qrCode.makeCode("zzy");
      });
  };
  // useReady(() => {
  //   drawQrcode();
  // });
  return (
    <View className="index">
      <Text>Hello world!</Text>
      {/* <Canvas className={style.qrCode} id="qrCode" type="2d"></Canvas> */}
      {/* <AntvDemo /> */}
      {/* <BarChart /> */}
      {/* <VChartDemo /> */}
      <View className={style["chart-wrapper"]}>
        {isWeApp() ? (
          <Chart
            option={{
              title: {
                text: "Bar Chart",
              },
              xAxis: {
                type: "category",
                data: data.categories,
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "Series 1",
                  type: "bar",
                  data: data.series[0].data,
                },
              ],
            }}
            height={Taro.pxTransform(480)}
            width="100%"
          />
        ) : null}
        {isAlipay() ? (
          <ChartAlipay
            option={{
              title: {
                text: "Bar Chart",
              },
              xAxis: {
                type: "category",
                data: data.categories,
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "Series 1",
                  type: "bar",
                  data: data.series[0].data,
                },
              ],
            }}
            height={Taro.pxTransform(480)}
            width="100%"
          />
        ) : null}
      </View>
    </View>
  );
}
