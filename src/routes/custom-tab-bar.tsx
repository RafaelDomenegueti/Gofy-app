import { View } from "react-native";
import { PlayerControls } from "../components/PlayerControls";
import { usePlayer } from "../hooks/usePlayer";

export function CustomTabBar() {
  const { currentContent } = usePlayer();

  return (
    <View className="w-full">
      {currentContent && <PlayerControls />}
    </View>
  );
}
