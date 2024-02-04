import { View, Text } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import Chart from "@/components/Chart/chart";
import style from "./index.module.less";

import "./index.less";

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
  return (
    <View className="index">
      <Text>Hello world!</Text>
      <View className={style["chart-wrapper"]}>
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
      </View>
    </View>
  );
}
