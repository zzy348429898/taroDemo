import React, { PropsWithChildren, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { render, unmountComponentAtNode } from '@tarojs/react';
import { document, TaroRootElement } from '@tarojs/runtime';
import { View } from '@tarojs/components'
import './index.scss'

interface ToastProps {
  title?: string
}
const Toast = (props: ToastProps) => {
  const { title } = props
  return <View className='show-toast-wrapper'>
    <View className='toast-inner'>
      {title}
    </View>
  </View>;
};

const create = (opt?: Taro.showToast.Option | undefined) => {
  const view = document.createElement('view');
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  //@ts-ignore
  const pageElement = document.getElementById<TaroRootElement>(path);
  render(<Toast title={opt?.title} />, view);
  pageElement?.appendChild(view);
  return () => {
    view.style.display = 'none'
    //TODO: destroy会导致页面卡死,先用display: none
    // destroy(view);
  };
};


const destroy = (node) => {
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  //@ts-ignore
  const pageElement = document.getElementById<TaroRootElement>(path);
  unmountComponentAtNode(node);
  pageElement?.remove(node);
};


/** 覆盖原生的showToast方法,自己实现 */
export function initShowToast() {

  Taro.showToast = (option?: Taro.showToast.Option | undefined) => {
    return new Promise((resolve, reject) => {
      let close = create(option)
      setTimeout(() => {
        close()
        // resolve()
      }, option?.duration ? option?.duration : 2000)
    })
  }

}