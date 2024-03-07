import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { useCallback, useState } from "react";
import JSONTree from '@/pages/components/jsontree';

import "./index.scss";

/**
 * 设备-网络
 * @returns 
 */
const Index = () => {
  const [networkStatus1, setNetworkStatus1] = useState({});
  const [networkStatus2, setNetworkStatus2] = useState({});

  const _handleCallback1 = useCallback((res) => {
    console.log("回调函数 C1", res);
    setNetworkStatus1(res);
  }, []);

  const _handleCallback2 = useCallback((res) => {
    console.log("回调函数 C2", res);
    setNetworkStatus2(res)
  }, []);

  return (
    <View className="api-page">
      <View className="api-page__body">
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onNetworkStatusChange(_handleCallback1);
          }}
        >
          Taro.onNetworkStatusChange(C1)
        </Button>
        <JSONTree data={networkStatus1} />
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onNetworkStatusChange(_handleCallback2);
          }}
        >
          Taro.onNetworkStatusChange(C2)
        </Button>
        <JSONTree data={networkStatus2} />
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offNetworkStatusChange(_handleCallback1);
          }}
        >
          Taro.offNetworkStatusChange(C1)
        </Button>
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offNetworkStatusChange(_handleCallback2);
          }}
        >
          Taro.offNetworkStatusChange(C2)
        </Button>
        <Button
          type="primary"
          className="api-page-btn-error"
          onClick={() => {
            Taro.offNetworkStatusChange();
          }}
        >
          Taro.offNetworkStatusChange()
        </Button>
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.getNetworkType().then(res => {
              Taro.showToast({ title: '网络状态：' + res.networkType, icon: 'none' })
            })
          }}
        >
          Taro.getNetworkType()
        </Button>
      </View>
    </View>
  )
}

export default Index;
