import QrCode from "@/components/qrCode";
import { Canvas, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

const QrCodePage = () => {
  return (
    <View>
        <QrCode width={256} height={256} code="hello world"></QrCode>
    </View>
  );
};
export default QrCodePage;
