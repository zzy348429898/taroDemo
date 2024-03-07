import { PickerProps, Picker as NutPick } from '@nutui/nutui-react-taro'
import { Text } from '@tarojs/components'
import React, { ReactNode, useMemo } from 'react'

interface Props {
  value?: string
  onChange?: (option: any, value: string) => void
  children?: ReactNode
  formatter?: string
  pickerProps?: Partial<PickerProps>
}
interface State {
  visible: boolean
}
export const Picker = (props: Props) => {
  const [state, setState] = React.useState<State>({
    visible: false
  })
  const toggle = () => {
    setState(state => ({ ...state, visible: !state.visible }))
  }
  const onConfirm = (option, value) => {
    props.onChange && props.onChange(option, value)
  }
  const value = useMemo(() => {
    return props.value ? [props.value] : []
  }, [props.value])
  return (
    <>
      <Text onClick={toggle}>{props.children}</Text>
      <NutPick
        visible={state.visible}
        onClose={toggle}
        value={value}
        onConfirm={onConfirm}
        {...(props.pickerProps || {})}
      ></NutPick>
    </>
  )
}

export default Picker
