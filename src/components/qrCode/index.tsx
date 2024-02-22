import { useState, useEffect, useRef } from "react";
import QRCode from "@/lib/qrcode";
import { Canvas, View } from "@tarojs/components";
import Taro, { useReady } from "@tarojs/taro";
interface Props {
  code: string;
  width: number;
  height: number;
}
const QrCode = (props: Props) => {
  const [didMount, setDidMount] = useState(false);
  const canvasNode = useRef();
  const checkReady = () => {
    Taro.createSelectorQuery()
      .select("#qrCode")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0].node) {
          setDidMount(true);
          canvasNode.current = res[0].node;
        } else {
          setTimeout(checkReady, 16);
        }
      });
  };
  const drawQrCode = () => {
    if (canvasNode.current) {
      const qrCode = new QRCode(canvasNode.current, {
        width: props.width,
        height: props.height,
        typeNumber: 4,
        colorDark: "#000000",
        colorLight: "#ffffff",
      });
      qrCode.makeCode("zzy");
    }
  };
  useEffect(() => {
    checkReady();
  }, []);
  useEffect(() => {
    if (didMount) {
      drawQrCode();
    }
  }, [props.code, didMount]);
  return (
    <Canvas
      id="qrCode"
      type="2d"
      width={Taro.pxTransform(props.width)}
      height={Taro.pxTransform(props.height)}
    ></Canvas>
  );
};
export default QrCode;
