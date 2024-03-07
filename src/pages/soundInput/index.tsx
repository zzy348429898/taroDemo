import QrCode from "@/components/qrCode";
import { Canvas, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import style from "./index.module.less";
import { useState } from "react";
import SoundInput from "@/components/SoundInput";

const Sound = () => {
  const [inputText, setInputText] = useState("");
  const onChange = (text) => setInputText(text);
  return (
    <View className={style.soundInput}>
      <Text>{inputText}</Text>
      <SoundInput onChange={onChange}></SoundInput>
    </View>
  );
};
export default Sound;
