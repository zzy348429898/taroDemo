import React, { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Label,
  Progress,
  Radio,
  RadioGroup,
  Slider,
  Swiper,
  SwiperItem,
  Switch,
  Text,
  View,
} from "@tarojs/components";
import styles from "./index.module.less";
import Picker from "@/components/picker";
const TaroUI = () => {
  const [pickerValue, setPickerValue] = useState();
  const onPickerChange = (option, value) => {
    setPickerValue(value);
  };
  const radioGroupList = [
    {
      value: "美国",
      text: "美国",
      checked: false,
    },
    {
      value: "中国",
      text: "中国",
      checked: true,
    },
    {
      value: "巴西",
      text: "巴西",
      checked: false,
    },
    {
      value: "日本",
      text: "日本",
      checked: false,
    },
    {
      value: "英国",
      text: "英国",
      checked: false,
    },
    {
      value: "法国",
      text: "法国",
      checked: false,
    },
  ];
  return (
    <View className={styles.taroUI}>
      <View>滑块视图容器</View>
      <View>
        <Swiper
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem>
            <View style={{ height: "100%", background: "red" }} />
          </SwiperItem>
          <SwiperItem>
            <View style={{ height: "100%", background: "blue" }} />
          </SwiperItem>
          <SwiperItem>
            <View style={{ height: "100%", background: "green" }} />
          </SwiperItem>
        </Swiper>
      </View>
      <View>进度条</View>
      <View>
        <Progress percent={20} showInfo strokeWidth={2} />
        {/* <Progress percent={40} strokeWidth={2} active />
        <Progress percent={60} strokeWidth={2} active />
        <Progress percent={80} strokeWidth={2} active activeColor="blue" /> */}
      </View>
      <View>表单</View>
      <View>
        <Form>
          <View>
            <Checkbox value="选中" checked>
              选中
            </Checkbox>
            <Checkbox style="margin-left: 20rpx" value="未选中">
              未选中
            </Checkbox>
          </View>
          <View>
            <RadioGroup>
              {radioGroupList.map((item, i) => {
                return (
                  <Label
                    style={{
                      marginRight: "24px",
                      paddingBottom: "12px",
                      display: "inline-block",
                    }}
                    for={i.toString()}
                    key={i}
                  >
                    <Radio value={item.value} checked={item.checked}>
                      {item.text}
                    </Radio>
                  </Label>
                );
              })}
            </RadioGroup>
          </View>
          <View>
            <Input type="text" placeholder="最大输入长度为 10" maxlength={10} />
          </View>
          <View>
            <Input type="number" placeholder="这是一个数字输入框" />
          </View>
          <View>
            <Input password placeholder="这是一个密码输入框" />
          </View>
          <View>
            <Picker
              value={pickerValue}
              onChange={onPickerChange}
              pickerProps={{
                options: [
                  {
                    text: "中国",
                    value: "中国",
                  },
                  {
                    text: "美国",
                    value: "美国",
                  },
                ],
              }}
            >
              {pickerValue || "从底部弹起的滚动选择器"}
            </Picker>
          </View>
          <View>
            <Slider step={1} value={100} showValue min={50} max={200} />
          </View>
          <View>
            <Switch checked>开关</Switch>
          </View>
          <Button formType="submit" type="primary">
            提交
          </Button>
        </Form>
      </View>
    </View>
  );
};

export default TaroUI;
