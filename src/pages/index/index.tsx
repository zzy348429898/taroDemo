import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Cell } from "@nutui/nutui-react-taro";
import style from "./index.module.less";
export default function Index() {
  const toPage = (url) => {
    Taro.navigateTo({ url });
  };
  return (
    <View className={style.index}>
      <Text>Hello world!</Text>
      <Cell onClick={() => toPage("/pages/qrCode/index")} title={'二维码'}></Cell>
      <Cell onClick={() => toPage("/pages/charts/index")} title={'图表'}></Cell>
    </View>
  );
}
