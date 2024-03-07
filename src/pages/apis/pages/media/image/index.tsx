import { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import { hadlePermissionsDeny } from '@/pages/utils/index'
import './index.scss';

/**
 * 媒体-图片
 * @returns 
 */
const Index = () => {

  const initSource: string = 'https://pic5.58cdn.com.cn/nowater/fangfe/n_v25a185c1657984016926f26af591912c4.jpg';
  const initPaths: string[] = [];

  const [source, setSource] = useState(initSource);
  const [tempFilePaths, setTempFilePath] = useState(initPaths);

  return (
    <View className='api-page'>
      <View className='common-border' style={{ alignItems: 'center' }}>
        <Image src={source} />
      </View>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={async () => {
          const res = await Taro.getSetting({})
          if (!res.authSetting['scope.writePhotosAlbum']) {
            Taro.authorize({
              scope: 'scope.writePhotosAlbum',
              fail: (err) => {
                if (err.errMsg === 'authorize:denied/undetermined' || err.errMsg === 'authorize:fail') {
                  hadlePermissionsDeny({ perssionText: '照片' })
                }
              }
            })
          } else {
            Taro.saveImageToPhotosAlbum({
              filePath: source,
            }).then(() => {
              Taro.showToast({ title: '保存成功' })
            }).catch(err => {
              console.log('失败：', err);
              Taro.showToast({ title: '保存失败', icon: 'none' })
            });
          }
        }}
      >Taro.saveImageToPhotosAlbum</Button>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={() => {
          Taro.previewImage({
            current: source,
            urls: [source],
          });
        }}
      >Taro.previewImage</Button>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={() => {
          Taro.getImageInfo({
            src: source,
            success: res => {
              Taro.showToast({ title: `width: ${res.width} \n height: ${res.height}`, icon: 'none' });
            },
            fail: err => {
              console.log(err);
            }
          });
        }}
      >Taro.getImageInfo</Button>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={() => {
          if (tempFilePaths.length === 0) {
            Taro.showToast({ title: '请先点击 chooseImage 选择图片', icon: 'none' })
          } else {
            Taro.compressImage({
              src: tempFilePaths[0],
              quality: 10,
              success: res => {
                console.log(res.tempFilePath);
                setSource(res.tempFilePath)
              },
              fail: err => {
                console.log(err);
              }
            });
          }
        }}
      >Taro.compressImage</Button>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={() => {
          Taro.chooseImage({
            count: 3,
            sourceType: ['album'],
            success: res => {
              setTempFilePath(res.tempFilePaths);
              setSource(res.tempFilePaths[0])
            },
            fail: err => {
              console.log(err);
            }
          })
        }}
      >Taro.chooseImage</Button>
      <Button
        type="primary"
        className="api-page-btn-success"
        onClick={() => {
          Taro.downloadFile({
            url: 'https://pic1.58cdn.com.cn/nowater/fangfe/n_v2e36a29a2a50d45fcaa02de3b2bf59919.png',
            success: res => {
              console.log(res);
              if (res.statusCode == 200) {
                Taro.showToast({ title: '下载完成（临时文件）', icon: 'none' });
                setSource(res.tempFilePath);
              }
            },
            fail: err => {
              console.log('下载失败：', err);
              Taro.showToast({ title: '下载失败', icon: 'none' });
            }
          });
        }}
      >Taro.downloadFile</Button>
    </View>
  )
}

export default Index;
