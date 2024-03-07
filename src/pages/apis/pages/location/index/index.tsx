import Taro from '@tarojs/taro';
import { useCallback, useState, useEffect } from "react";
import { View, Button } from '@tarojs/components';
import JSONTree from '@/pages/components/jsontree';
import { hadlePermissionsDeny } from '@/pages/utils/index';

import './index.scss'

/**
 * 设备-位置
 * @returns 
 */
const Index = () => {
  const [location, setLocation] = useState({});
  const [location1, setLocation1] = useState({});
  const [location2, setLocation2] = useState({});

  useEffect(() => {
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
            fail: (err) => {
              if (err.errMsg === 'authorize:denied/undetermined' || err.errMsg === 'authorize:fail') {
                hadlePermissionsDeny({ perssionText: '位置' })
              }
            }
          })
        }
      }
    })
  }, [])

  const _handleCallback1 = useCallback((res) => {
    console.log("回调函数 C1", res);
    setLocation1(res)
  }, []);

  const _handleCallback2 = useCallback((res) => {
    console.log("回调函数 C2", res);
    setLocation2(res)
  }, []);

  return (
    <View className="api-page">
      <View className="api-page__body">
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.getLocation({
              success: res => {
                setLocation(res)
              },
            }).catch(err => {
              if (err.errMsg === 'Permissions denied!') {
                // TODO: use errCode
                hadlePermissionsDeny({ perssionText: '位置' })
              }
            })
          }}
        >Taro.getLocation</Button>
        <JSONTree data={location} />
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onLocationChange(_handleCallback1)
          }}
        >Taro.onLocationChange(C1)</Button>
        <JSONTree data={location1} />
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.onLocationChange(_handleCallback2)
          }}
        >Taro.onLocationChange(C2)</Button>
        <JSONTree data={location2} />
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offLocationChange(_handleCallback1)
          }}
        >Taro.offLocationChange(C1)</Button>
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            Taro.offLocationChange(_handleCallback2)
          }}
        >Taro.offLocationChange(C2)</Button>
        <Button
          type="primary"
          className="api-page-btn-warning"
          onClick={() => {
            //@ts-ignore
            Taro.offLocationChange();
          }}
        >Taro.offLocationChange()</Button>
        <Button
          type="primary"
          className="api-page-btn-success"
          onClick={() => {
            Taro.startLocationUpdate({})
          }}
        >Taro.startLocationUpdate()</Button>
        <Button
          type="primary"
          className="api-page-btn-error"
          onClick={() => {
            Taro.stopLocationUpdate({
              success: () => Taro.showToast({ title: 'stop 成功', icon: 'none' })
            })
          }}
        >Taro.stopLocationUpdate()</Button>
      </View>
    </View>
  )
}

export default Index;
