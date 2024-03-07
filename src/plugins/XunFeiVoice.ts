import Taro from "@tarojs/taro";
const MD5 = require("md5.js");
import { Base64 } from "js-base64";
const Base64HmacSHA1 = require("@/utils/secret/SHA1");
import { ShortSocket, ShortSocketTask } from "@/apis/socket/ShortSocket";
import { isAlipay, isTT, isWeApp } from "@/utils/env";
function isJsonString(str: any) {
  if (typeof str !== "string") return false;
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
const getRecordStartConfig = (duration) => {
  if (isWeApp()) {
    return {
      sampleRate: 16000,
      numberOfChannels: 1,
      format: "PCM",
      frameSize: 1.25,
      duration,
    };
  } else if (isTT()) {
    return {
      sampleRate: 16000,
      numberOfChannels: 1,
      format: "pcm",
      frameSize: 1.25,
      duration,
    };
  } else if (isAlipay()) {
    return {
      sampleRate: 16000,
      numberOfChannels: 1,
      format: "acc",
      frameSize: 1.25,
      duration,
    };
  } else {
    return {
      sampleRate: 16000,
      numberOfChannels: 1,
      // format: getRecordFormat(),
      // @ts-ignore
      format: "acc",
      frameSize: 1.25,
      duration,
    };
  }
};
const newManager = () => {
  return {
    start: () => {
      console.log("XunFeiVoice: start");
    },
    stop: () => {
      console.log("XunFeiVoice: stop");
    },
    OnRecognitionComplete: () => {
      console.log("XunFeiVoice: OnRecognitionComplete");
    },
    OnRecognitionResultChange: () => {
      console.log("XunFeiVoice: OnRecognitionResultChange");
    },
    OnError: () => {
      console.log("XunFeiVoice: OnError");
    },
  } as any;
};

/**
 * 获取websocket url
 * 该接口需要后端提供，这里为了方便前端处理, H5端会暴露API_KEY, 小程序端做了保护,但是只要是客户端执行的代码都无法百分百安全
 */
const getWebSocketUrl = () => {
  // 请求地址根据语种不同变化
  let url = "wss://rtasr.xfyun.cn/v1/ws";
  let appId = "ea5a7654";
  let secretKey = "714dc13673909ce920e0ac38a2c807df";
  let ts = Math.floor(new Date().getTime() / 1000);
  let signa = new MD5().update(appId + ts).digest("hex");
  let signatureSha = Base64HmacSHA1(secretKey, signa);
  let signature = encodeURIComponent(signatureSha);
  return `${url}?appid=${appId}&ts=${ts}&signa=${signature}&vadMdn=2&roleType=2`;
};

//这个数据封装成跟腾讯语音识别一样,方便可以随时替换回腾讯的语音
export interface VoiceAsrRes {
  message: string;
  result: {
    voice_text_str: string;
  };
}

interface XunFeiData {
  action: "started" | "result" | "error";
  code: string;
  data: string;
  desc: string;
  sid: string;
}

class XunFeiManager {
  private socket: ShortSocketTask | null = null;
  private record: Taro.RecorderManager | null = null;
  public OnRecognitionComplete: (res: VoiceAsrRes) => void;
  public OnRecognitionResultChange: (res: VoiceAsrRes) => void;
  public OnError: (error: any) => void;

  private resultText = "";

  constructor() {}

  handleXunFeiData = (xfData: XunFeiData) => {
    if (xfData.action == "started") {
      console.log("XunFeiVoice: 开始识别");
    }
    if (xfData.action == "result") {
      console.log("XunFeiVoice: 接收数据");
      //解析数据
      const data = JSON.parse(xfData.data);
      // 转写结果
      let resultTextTemp = "";
      data.cn.st.rt.forEach((j) => {
        j.ws.forEach((k) => {
          k.cw.forEach((l) => {
            resultTextTemp += l.w;
          });
        });
      });
      if (data.cn.st.type == 0) {
        // 【最终】识别结果：
        this.resultText += resultTextTemp;
        resultTextTemp = "";
      }
      //接收到数据就认为识别结果改变, 调用OnRecognitionResultChange,构造VoiceAsrRes
      this.OnRecognitionResultChange &&
        this.OnRecognitionResultChange({
          message: "success",
          result: {
            voice_text_str: this.resultText + resultTextTemp,
          },
        });
    }
    if (xfData.action == "error") {
      console.log("XunFeiVoice: 接收数据出错了");
      this.OnError && this.OnError(xfData);
    }
  };

  private initWebSocket({ duration }) {
    const url = getWebSocketUrl();
    this.socket = new ShortSocket().getInstance(url);

    //接收到讯飞返回的数据, 具体的数据结构看 https://www.xfyun.cn/doc/asr/rtasr/API.html
    this.socket.onMessage((res) => {
      console.log("Socket: onMessage");
      if (isJsonString(res.data)) {
        this.handleXunFeiData(JSON.parse(res.data));
      }
    });

    this.socket.onOpen(() => {
      //开始录音要在建立完成socket连接之后  采样率为16K 单通道 PCM格式  讯飞要求每40MS发送1280字节也就是1.25KB
      // @ts-ignore
      this.record?.start(getRecordStartConfig(duration));
    });

    //连接出错的时候要结束录音
    this.socket.onError(() => {
      this.record?.stop();
      this.resultText = "";
    });
  }

  private initRecord() {
    this.record = Taro.getRecorderManager();
    this.record.onFrameRecorded((res) => {
      this.socket?.send({
        data: res.frameBuffer,
        success: () => {
          // console.log('Socket: sendFrameSuccess')
        },
        fail: () => {
          console.log("Socket: sendFrameFailed");
        },
      });
      if (res.isLastFrame) {
        console.log("RecorderManager: isLastFrame");
        //在这里调用OnRecognitionComplete
        this.socket?.send({ data: '{"end": true}' });
        this.OnRecognitionComplete &&
          this.OnRecognitionComplete({
            message: "success",
            result: {
              voice_text_str: this.resultText,
            },
          });
        this.resultText = "";
      }
    });
    this.record.onStop(() => {
      console.log("RecorderManager: onStop");
      //强制断开socket连接, 这里不用重置socket, 因为socket内部有重置instance的逻辑
      this.socket?.close(true);
      this.resultText = "";
    });
    this.record.onStart((res) => {
      console.log("RecorderManager: onStart");
    });
  }

  public start({ duration }) {
    console.log("XunFeiVoice: start");

    //这里要先初始话录音再初始化socket
    this.initRecord();
    this.initWebSocket({ duration });
  }
  public stop() {
    console.log("XunFeiVoice: stop");

    //结束语音录制
    this.record?.stop();
    setTimeout(() => {
      this.socket?.close(true);
      this.resultText = "";
    }, 1000);
  }
}

const XunFeiVoice = {
  newManager: () => {
    // let manager = newManager();
    // if (process.env.TARO_ENV === "weapp") {
    let manager = new XunFeiManager();
    // }
    return manager;
  },
};

export default XunFeiVoice;
