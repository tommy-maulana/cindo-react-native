import { Platform, Dimensions } from "react-native";

export const isIphoneX = () => {
  const { width, height } = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height >= 812 || width >= 812)
  );
};

export const bottomBarHeight = isIphoneX() ? 23 : 0;
