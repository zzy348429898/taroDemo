# Taro 的常见问题

## 1. View的overflow:auto不生效

使用ScrollView

```jsx
    <ScrollView scrollY>
```

## 2. 滑动穿透

```jsx
    // 这个 View 组件会绑定 catchtouchmove 事件而不是 bindtouchmove\
    <View catchMove></View>
```

## 3. 点击穿透

```css
    pointer-events: none;
```

## 4. 嵌套Popup

参考经营助手的代码 /src/components/upload-order-img-com/index.tsx

## 5. 小程序云环境共享

参考经营助手的代码 /src/pages/bind/index.tsx

```typescript
const handleGetPhoneNumber = async ({ detail }) => {
Tips.loading()
const { errMsg, code } = detail
if (errMsg === 'getPhoneNumber:ok') {
    const xtCloudInstance = await getXTWechatCloud()
    xtCloudInstance.callFunction({
    name: 'getPhoneNumber',
    data: {
        code,
        appid: APPID
    },
    complete: (res: any) => {
        const { errMsg, result } = res
        if (errMsg === 'cloud.callFunction:ok') {
        const phoneNumber = result?.phoneInfo?.phoneNumber
        setPhone(phoneNumber)
        Tips.loaded()
        return
        }
        Tips.loaded()
        Tips.toast('获取手机号码失败')
    }
    })
}
}
```

以及协同小程序 /cloudfunctions/getPhoneNumber/index.js
```ts
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (params, context) => {
  const { code, appid } = params //得到前端通过手机号按钮获取到的clouid
  let result = await cloud.openapi({appid}).phonenumber.getPhoneNumber({
    code: code
  })
  
  return result
}
```
