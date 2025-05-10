import { Alert, AlertButton, Platform } from "react-native";

type AlertOptions = AlertButton[];

type AlertExtra = {
  cancelable?: boolean;
};

const alertPolyfill = (
  title: string,
  description: string,
  options: AlertOptions = [],
  extra?: AlertExtra
) => {
  const result = window.confirm(
    [title, description].filter(Boolean).join("\n")
  );

  if (result) {
    const confirmOption = options.find(({ style }) => style !== "cancel");
    confirmOption?.onPress?.();
  } else {
    const cancelOption = options.find(({ style }) => style === "cancel");
    cancelOption?.onPress?.();
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
