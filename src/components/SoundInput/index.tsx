import React, { FC, useState, useEffect, useImperativeHandle } from "react";
import { View, RootPortal } from "@tarojs/components";
import "./index.scss";
import Taro from "@tarojs/taro";
import { Popup } from "@nutui/nutui-react-taro";
import { scopeAuthorizeErrorHandler } from "@/common/authorize";
import XunFeiManager from "@/plugins/XunFeiVoice";
interface IProps {
  onChange: (str: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  onCancel?: () => void;
  child?: React.ReactNode;
}

let manager = XunFeiManager.newManager();

const SoundInput = React.forwardRef((props: any, ref) => {
  const [txt, setTxt] = useState("");
  const [showVoice, setShowVoice] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSpeakClick,
      };
    },
    []
  );

  manager.OnRecognitionResultChange = (res) => {
    console.log("识别结果变化: ", res);
    if (res && res.message == "success") {
      setTxt(res.result.voice_text_str);
      props.onChange && props.onChange(res.result.voice_text_str)
    }
  };
  manager.OnRecognitionComplete = (res) => {
    console.log("识别结束: ", res);
    if (res && res.message == "success") {
      // setTxt(res.result.voice_text_str)
    }
  };
  manager.OnError = (res) => {
    console.log("识别失败: ", res);
    scopeAuthorizeErrorHandler("scope.record", res);
  };

  const handleSpeakClick = async () => {
    await manager.start({ duration: 60000 });
    setShowVoice(true);
    props?.onStart?.();
    Taro.vibrateShort({
      // type: "light",
    });
  };

  return (
    <View className="sound-input-component">
      <View onClick={handleSpeakClick}>
        <View className="voice-input-icon"></View>
        <View className="voice-input-txt">点击说话</View>
      </View>
      <Popup
        visible={showVoice}
        position="bottom"
        closeOnOverlayClick={false}
        className="voice-rec-popup"
        overlayClassName="voice-rec-popup-overlay"
        round
        onClose={() => {
          setShowVoice(false);
        }}
      >
        <View
          onClick={() => {
            Taro.vibrateShort({
              // type: "medium",
            });
            setShowVoice(false);
            manager.stop();
            props?.onCancel?.();
          }}
          className="voice-rec-popup-cancel"
        >
          <View className="iconcool guanbi" />
          取消
        </View>
        <View
          onClick={() => {
            Taro.vibrateShort({
              // type: "medium",
            });
            manager.stop();
            setShowVoice(false);
            props?.onStop?.();
            !props.isOrder && props.onChange && props.onChange(txt);
          }}
          className="voice-rec-popup-content"
        >
          <View className="content-text-h2">小蝶正在听，请说出单据信息</View>
          <View className="content-text-h3">点击完成录音</View>

          <View className="content-float-text">
            剩余语音用量：{props.leftSpace || 0}
          </View>
        </View>
      </Popup>
    </View>
  );
});

export default SoundInput;
