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
      <Cell onClick={() => toPage("/pages/taroUI/index")} title={'taroUI'}></Cell>
      {/* <Cell onClick={() => toPage("/pages/taro3Table/index")} title={'多功能表格组件'}></Cell> */}
      {/* <Cell onClick={() => toPage("/pages/nutUI/index")} title={'nutUI'}></Cell> */}
      <Cell onClick={() => toPage("/pages/pageParams/index")} title={'页面传参与回调'}></Cell>
      <Cell onClick={() => toPage("/pages/qrCode/index")} title={'二维码'}></Cell>
      <Cell onClick={() => toPage("/pages/charts/index")} title={'图表'}></Cell>
      <Cell onClick={() => toPage("/pages/soundInput/index")} title={'语音输入'}></Cell>
      <Cell onClick={() => toPage("/pages/components/index")} title={'组件'}></Cell>

    </View>
  );
}
