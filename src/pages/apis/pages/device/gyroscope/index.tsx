import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { useCallback, useState } from "react";
import JSONTree from '@/pages/components/jsontree';

import "./index.scss";

/**
 * 设备-陀螺仪
 * @returns 
 */
const Index = () => {
  const [gyroscope1, setGyroscope1] = useState({});
  const [gyroscope2, setGyroscope2] = useState({});

  const _handleCallback1 = useCallback((res) => {
    console.log("回调函数 C1", res);
    setGyroscope1(res);
  }, []);

  const _handleCallback2 = useCallback((res) => {
    console.log("回调函数 C2", res);
    setGyroscope2(res);
  }, []);

  return (
    <View className="api-page">
      <View className="api-page__body">
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onGyroscopeChange(_handleCallback1);
          }}
        >
          Taro.onGyroscopeChange(C1)
        </Button>
        <JSONTree data={gyroscope1} />
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onGyroscopeChange(_handleCallback2);
          }}
        >
          Taro.onGyroscopeChange(C2)
        </Button>
        <JSONTree data={gyroscope2} />
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offGyroscopeChange(_handleCallback1);
          }}
        >
          Taro.offGyroscopeChange(C1)
        </Button>
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offGyroscopeChange(_handleCallback2);
          }}
        >
          Taro.offGyroscopeChange(C2)
        </Button>
        <Button
          type="primary"
          className="api-page-btn-error"
          onClick={() => {
            // @ts-ignore
            Taro.offGyroscopeChange();
          }}
        >
          Taro.offGyroscopeChange()
        </Button>
        <Button
          type="primary"
          className="api-page-btn-error"
          onClick={() => {
            Taro.startGyroscope({
              success: res => {
                console.log('成功', res)
              }
            });
          }}
        >
          Taro.startGyroscope()
        </Button>
        <Button
          type="primary"
          className="api-page-btn-error"
          onClick={() => {
            Taro.stopGyroscope();
          }}
        >
          Taro.stopGyroscope()
        </Button>
      </View>
    </View>
  )
}

export default Index;
