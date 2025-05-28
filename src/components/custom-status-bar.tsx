import { SafeAreaView, StatusBar, StatusBarStyle, View } from "react-native";

export const CustomStatusBar = ({ backgroundColor, barStyle }: { backgroundColor: string, barStyle: StatusBarStyle }) => {
  return (
    <View style={{ backgroundColor, height: StatusBar.currentHeight }}>
      <SafeAreaView>
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} translucent />
      </SafeAreaView>
    </View>
  );
};
